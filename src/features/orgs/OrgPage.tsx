import {
  AddIcon,
  ArrowBackIcon,
  ChatIcon,
  EditIcon,
  SettingsIcon
} from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  IconButton,
  Input,
  List,
  ListItem,
  Switch,
  TabPanel,
  TabPanels,
  Text,
  Tooltip,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import DOMPurify from "isomorphic-dompurify";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { css } from "twin.macro";
import {
  EntityButton,
  EntityInfo,
  GridHeader,
  GridItem,
  IconFooter,
  Link
} from "features/common";
import { DocumentsList } from "features/documents/DocumentsList";
import { EventsList } from "features/events/EventsList";
import { Forum } from "features/forum/Forum";
import { TopicsList } from "features/forum/TopicsList";
import { Layout } from "features/layout";
import { MapContainer } from "features/map/MapContainer";
import { ProjectsList } from "features/projects/ProjectsList";
import {
  useAddSubscriptionMutation,
  useGetSubscriptionQuery
} from "features/subscriptions/subscriptionsApi";
import { SubscriptionPopover } from "features/subscriptions/SubscriptionPopover";
import { selectSubscriptionRefetch } from "features/subscriptions/subscriptionSlice";
import { selectUserEmail } from "features/users/userSlice";
import { useSession } from "hooks/useAuth";
import { Visibility as EventVisibility } from "models/Event";
import { IOrg, IOrgTab, orgTypeFull, orgTypeFull4, OrgTypes } from "models/Org";
import {
  getFollowerSubscription,
  getSubscriberSubscription
} from "models/Subscription";
import { PageProps } from "pages/_app";
import { hasItems, indexOfbyKey, sortOn } from "utils/array";
import { OrgConfigPanel } from "./OrgConfigPanel";
import { OrgPageTabs, defaultTabs } from "./OrgPageTabs";
import { useEditOrgMutation, useGetOrgQuery, useGetOrgsQuery } from "./orgsApi";
import { selectOrgRefetch } from "./orgSlice";
import { capitalize } from "utils/string";

export type Visibility = {
  isVisible: {
    banner?: boolean;
    logo?: boolean;
    lists?: boolean;
    subscribers?: boolean;
    topics?: boolean;
  };
  setIsVisible: (obj: Visibility["isVisible"]) => void;
};

let cachedRefetchOrg = false;
let cachedRefetchSubscription = false;
let cachedEmail: string | undefined;

export const OrgPage = ({
  isMobile,
  populate,
  tab,
  tabItem,
  ...props
}: PageProps & {
  populate?: string;
  tab?: string;
  tabItem?: string;
  org: IOrg;
}) => {
  const router = useRouter();
  const { data, loading: isSessionLoading } = useSession();
  const session = data || props.session;
  const toast = useToast({ position: "top" });
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const userEmail = useSelector(selectUserEmail) || session?.user.email;

  //#region org
  const [editOrg, editOrgMutation] = useEditOrgMutation();
  const orgQuery = useGetOrgQuery(
    { orgUrl: props.org.orgUrl, populate },
    {
      selectFromResult: (query) => query
    }
  );
  const org = orgQuery.data || props.org;
  const orgsWithLocation =
    org.orgs?.filter(({ orgLat, orgLng }) => !!orgLat && !!orgLng) || [];
  const [description, setDescription] = useState<string | undefined>();
  useEffect(() => {
    // setIsEdit(false);
    // setIsConfig(false);

    if (org.orgDescription && org.orgDescription.length > 0) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(org.orgDescription, "text/html");
      const links = (doc.firstChild as HTMLElement).getElementsByTagName("a");

      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        link.setAttribute("title", link.innerText);

        if (
          isMobile &&
          (link.href.includes("http") || link.href.includes("mailto:"))
        ) {
          link.classList.add("clip");

          if (link.href.includes("mailto:"))
            link.innerText = "@" + link.innerText;
        }
      }

      setDescription(doc.body.innerHTML);
    } else setDescription(undefined);
  }, [org]);

  const { orgNetworks } = useGetOrgsQuery(
    { populate: "orgs" },
    {
      selectFromResult: (query) => ({
        orgNetworks: query.data?.filter(
          (o) =>
            o.orgName !== org.orgName &&
            o.orgType === OrgTypes.NETWORK &&
            !!o.orgs?.find(({ orgName }) => orgName === org.orgName)
        )
      })
    }
  );

  const orgCreatedByUserName =
    typeof org.createdBy === "object"
      ? org.createdBy.userName || org.createdBy._id
      : "";
  const orgCreatedByUserId =
    typeof org.createdBy === "object" ? org.createdBy._id : "";
  const hasInfo =
    hasItems(org.orgAddress) ||
    hasItems(org.orgEmail) ||
    hasItems(org.orgPhone) ||
    hasItems(org.orgWeb);
  const isCreator =
    session?.user.userId === orgCreatedByUserId ||
    session?.user.isAdmin ||
    false;
  const publicEvents = org.orgEvents.filter(
    (orgEvent) => orgEvent.eventVisibility === EventVisibility.PUBLIC
  );
  const [title = "Événements des 7 prochains jours", setTitle] = useState<
    string | undefined
  >();
  //#endregion

  //#region sub
  const [addSubscription, addSubscriptionMutation] =
    useAddSubscriptionMutation();
  const subQuery = useGetSubscriptionQuery({ email: userEmail });
  const refetchSubscription = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    if (refetchSubscription !== cachedRefetchSubscription) {
      cachedRefetchSubscription = refetchSubscription;
      console.log("refetching subscription");
      subQuery.refetch();
    }
  }, [refetchSubscription]);
  useEffect(() => {
    if (userEmail !== cachedEmail) {
      cachedEmail = userEmail;
      console.log("refetching subscription with new email", userEmail);
      subQuery.refetch();
    }
  }, [userEmail]);

  const followerSubscription = getFollowerSubscription({ org, subQuery });
  const subscriberSubscription = getSubscriberSubscription({ org, subQuery });
  //#endregion

  //#region local state
  const [isLogin, setIsLogin] = useState(0);
  const [isConfig, setIsConfig] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isVisible, setIsVisible] = useState<Visibility["isVisible"]>({
    logo: false,
    banner: false,
    topics: false,
    subscribers: false
  });

  const tabs = useMemo(() => {
    return [...(org.orgTabs || defaultTabs)].sort(
      sortOn(
        "label",
        defaultTabs
          .filter(({ label }) => label !== "")
          .map(({ label }) => label)
      )
    );
  }, [org.orgTabs, defaultTabs]);

  const [tabsState, setTabsState] = useState<
    (IOrgTab & { checked: boolean })[]
  >(tabs.map((t) => ({ ...t, checked: true })));
  useEffect(() => {
    setTabsState(
      tabs.map((t) => ({
        ...t,
        checked: true
      }))
    );
  }, [org]);
  //#endregion

  const refetchOrg = useSelector(selectOrgRefetch);
  useEffect(() => {
    if (refetchOrg !== cachedRefetchOrg) {
      cachedRefetchOrg = refetchOrg;
      console.log("refetching org");
      orgQuery.refetch();
    }
  }, [refetchOrg]);
  useEffect(() => {
    if (userEmail !== cachedEmail) {
      cachedEmail = userEmail;
      console.log("refetching org with new email", userEmail);
      orgQuery.refetch();
    }
  }, [userEmail]);

  if (org.orgUrl === "forum") {
    return (
      <Layout org={org} isLogin={isLogin} isMobile={isMobile} session={session}>
        <Forum isLogin={isLogin} setIsLogin={setIsLogin} tabItem={tabItem} />
      </Layout>
    );
  }

  return (
    <Layout org={org} isLogin={isLogin} isMobile={isMobile} session={session}>
      {isCreator && !isConfig && !isEdit && (
        <Button
          colorScheme="teal"
          leftIcon={<SettingsIcon boxSize={6} data-cy="orgSettings" />}
          onClick={() => setIsConfig(true)}
          mb={5}
        >
          Configuration {orgTypeFull(org.orgType)}
        </Button>
      )}

      {isEdit && (
        <Button
          colorScheme="teal"
          leftIcon={<ArrowBackIcon boxSize={6} />}
          onClick={() => setIsEdit(false)}
        >
          Retour
        </Button>
      )}

      {!isEdit && isConfig && (
        <Button
          colorScheme="teal"
          leftIcon={<ArrowBackIcon boxSize={6} />}
          onClick={() => setIsConfig(false)}
        >
          {`Revenir à la page ${orgTypeFull(org.orgType)}`}
        </Button>
      )}

      {!isConfig && !isEdit && !subQuery.isLoading && (
        <Flex flexDirection="row" flexWrap="wrap" mt={-3}>
          {followerSubscription && (
            <Box mr={3} mt={3}>
              <SubscriptionPopover
                org={org}
                query={orgQuery}
                subQuery={subQuery}
                followerSubscription={followerSubscription}
                //isLoading={subQuery.isLoading || subQuery.isFetching}
              />
            </Box>
          )}

          <Box mt={3}>
            <SubscriptionPopover
              org={org}
              query={orgQuery}
              subQuery={subQuery}
              followerSubscription={followerSubscription}
              notifType="push"
              //isLoading={subQuery.isLoading || subQuery.isFetching}
            />
          </Box>
        </Flex>
      )}

      <Box my={3}>
        <Text fontSize="smaller">
          Organisation ajoutée le{" "}
          {format(parseISO(org.createdAt!), "eeee d MMMM yyyy", {
            locale: fr
          })}{" "}
          par :{" "}
          <Link variant="underline" href={`/${orgCreatedByUserName}`}>
            {orgCreatedByUserName}
          </Link>{" "}
          {isCreator && !session?.user.isAdmin && "(Vous)"}
        </Text>
      </Box>

      {subscriberSubscription && !isConfig && (
        <Alert status="info" mb={3}>
          <AlertIcon />
          <Box>
            Vous êtes adhérent {orgTypeFull(org.orgType)} {org.orgName}.
            <Text fontSize="smaller">
              Vous avez donc accès aux événements, discussions et projets
              réservés aux adhérents.
            </Text>
          </Box>
        </Alert>
      )}

      {!isConfig && !isEdit && (
        <OrgPageTabs org={org} session={session} tab={tab} tabs={tabs}>
          {({ setCurrentTabIndex }) => {
            return (
              <TabPanels
                css={css`
                  & > * {
                    padding: 12px 0 !important;
                  }
                `}
              >
                {!!tabs.find(({ label }) => label === "Accueil") && (
                  <TabPanel aria-hidden>
                    <Grid
                      // templateColumns="minmax(425px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr)"
                      gridGap={5}
                      css={css`
                        @media (max-width: 650px) {
                          & {
                            grid-template-columns: 1fr !important;
                          }
                        }
                      `}
                    >
                      <GridItem
                        light={{ bg: "orange.100" }}
                        dark={{ bg: "gray.600" }}
                        borderTopRadius="lg"
                      >
                        <Grid templateRows="auto 1fr">
                          <GridHeader
                            display="flex"
                            alignItems="center"
                            borderTopRadius="lg"
                          >
                            <Heading size="sm" py={3}>
                              Coordonnées {orgTypeFull(org.orgType)}
                            </Heading>
                            {hasInfo && isCreator && (
                              <Tooltip
                                hasArrow
                                label="Modifier les coordonnées"
                                placement="bottom"
                              >
                                <IconButton
                                  aria-label="Modifier les coordonnées"
                                  icon={<EditIcon />}
                                  bg="transparent"
                                  _hover={{ color: "green" }}
                                  onClick={() => setIsEdit(true)}
                                />
                              </Tooltip>
                            )}
                          </GridHeader>

                          <GridItem
                            light={{ bg: "orange.100" }}
                            dark={{ bg: "gray.600" }}
                          >
                            <Box p={5}>
                              {hasInfo ? (
                                <EntityInfo entity={org} />
                              ) : isCreator ? (
                                <Button
                                  colorScheme="teal"
                                  leftIcon={<AddIcon />}
                                  onClick={() => setIsEdit(true)}
                                >
                                  Ajouter
                                </Button>
                              ) : (
                                <Text fontStyle="italic">
                                  Aucunes coordonnées.
                                </Text>
                              )}
                            </Box>
                          </GridItem>
                        </Grid>
                      </GridItem>

                      {Array.isArray(orgNetworks) && orgNetworks.length > 0 && (
                        <GridItem
                          light={{ bg: "orange.100" }}
                          dark={{ bg: "gray.600" }}
                          borderTopRadius="lg"
                        >
                          <Grid templateRows="auto 1fr">
                            <GridHeader
                              borderTopRadius="lg"
                              alignItems="center"
                            >
                              <Heading size="sm" py={3}>
                                {capitalize(orgTypeFull4(org.orgType))} est
                                membre des réseaux ci-dessous :
                              </Heading>
                            </GridHeader>

                            <GridItem
                              light={{ bg: "orange.100" }}
                              dark={{ bg: "gray.600" }}
                            >
                              <Box p={5}>
                                {orgNetworks.map((network) => (
                                  <EntityButton
                                    key={network._id}
                                    org={network}
                                  />
                                ))}
                              </Box>
                            </GridItem>
                          </Grid>
                        </GridItem>
                      )}

                      {org.orgType === OrgTypes.NETWORK && (
                        <>
                          {orgsWithLocation.length > 0 && (
                            <GridItem
                              rowSpan={1}
                              borderTopRadius="lg"
                              light={{ bg: "orange.100" }}
                              dark={{ bg: "gray.600" }}
                            >
                              <GridHeader
                                borderTopRadius="lg"
                                alignItems="center"
                              >
                                <Flex alignItems="center">
                                  <Heading size="sm" py={3}>
                                    Carte du réseau
                                  </Heading>
                                  {isCreator && (
                                    <Tooltip
                                      hasArrow
                                      label="Ajouter ou supprimer des organisations du réseau"
                                      placement="bottom"
                                    >
                                      <IconButton
                                        aria-label="Ajouter ou supprimer des organisations du réseau"
                                        icon={<EditIcon />}
                                        bg="transparent"
                                        _hover={{ color: "green" }}
                                        onClick={() => setIsEdit(true)}
                                      />
                                    </Tooltip>
                                  )}
                                </Flex>
                              </GridHeader>
                              <GridItem
                                light={{ bg: "orange.100" }}
                                dark={{ bg: "gray.600" }}
                              >
                                <MapContainer
                                  orgs={orgsWithLocation}
                                  center={{
                                    lat: orgsWithLocation[0].orgLat,
                                    lng: orgsWithLocation[0].orgLng
                                  }}
                                />
                              </GridItem>
                            </GridItem>
                          )}

                          {Array.isArray(org.orgs) && org.orgs.length > 0 && (
                            <GridItem
                              rowSpan={1}
                              borderTopRadius="lg"
                              light={{ bg: "orange.100" }}
                              dark={{ bg: "gray.600" }}
                            >
                              <GridHeader
                                borderTopRadius="lg"
                                alignItems="center"
                              >
                                <Flex alignItems="center">
                                  <Heading size="sm" py={3}>
                                    Membres du réseau
                                  </Heading>
                                  {isCreator && (
                                    <Tooltip
                                      hasArrow
                                      label="Ajouter ou supprimer des organisations du réseau"
                                      placement="bottom"
                                    >
                                      <IconButton
                                        aria-label="Ajouter ou supprimer des organisations du réseau"
                                        icon={<EditIcon />}
                                        bg="transparent"
                                        _hover={{ color: "green" }}
                                        onClick={() => setIsEdit(true)}
                                      />
                                    </Tooltip>
                                  )}
                                </Flex>
                              </GridHeader>
                              <GridItem
                                light={{ bg: "orange.100" }}
                                dark={{ bg: "gray.600" }}
                              >
                                <List p={3} spacing={1}>
                                  {[...org.orgs]
                                    .sort((a, b) => {
                                      if (a.orgName > b.orgName) return -1;
                                      if (a.orgName < b.orgName) return 1;
                                      return 0;
                                    })
                                    .map((org) => (
                                      <ListItem key={org._id}>
                                        <EntityButton org={org} />
                                      </ListItem>
                                    ))}
                                </List>
                              </GridItem>
                            </GridItem>
                          )}
                        </>
                      )}

                      {/* org.orgDescription */}
                      <GridItem
                        rowSpan={1}
                        borderTopRadius="lg"
                        light={{ bg: "orange.100" }}
                        dark={{ bg: "gray.600" }}
                      >
                        <GridHeader
                          display="flex"
                          alignItems="center"
                          borderTopRadius="lg"
                        >
                          <Heading size="sm" py={3}>
                            Présentation {orgTypeFull(org.orgType)}
                          </Heading>
                          {org.orgDescription && isCreator && (
                            <Tooltip
                              hasArrow
                              label="Modifier la présentation"
                              placement="bottom"
                            >
                              <IconButton
                                aria-label="Modifier la présentation"
                                icon={<EditIcon />}
                                bg="transparent"
                                _hover={{ color: "green" }}
                                onClick={() => setIsEdit(true)}
                              />
                            </Tooltip>
                          )}
                        </GridHeader>

                        <GridItem p={5}>
                          {description && description.length > 0 ? (
                            <div className="rteditor">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(description, {
                                    ADD_TAGS: ["iframe"]
                                  })
                                }}
                              />
                            </div>
                          ) : isCreator ? (
                            <Button
                              colorScheme="teal"
                              leftIcon={<AddIcon />}
                              onClick={() => setIsEdit(true)}
                            >
                              Ajouter
                            </Button>
                          ) : (
                            <Text fontStyle="italic">Aucune présentation.</Text>
                          )}
                        </GridItem>
                      </GridItem>
                    </Grid>
                  </TabPanel>
                )}

                {!!tabs.find(({ label }) => label === "Événements") && (
                  <TabPanel aria-hidden>
                    <Flex flexWrap="wrap" margin="0 auto" maxWidth="4xl">
                      <Box flexGrow={1}>
                        <Heading
                          className="rainbow-text"
                          fontFamily="DancingScript"
                        >
                          {title}
                        </Heading>
                      </Box>
                      <Box width="100%" mt={5}>
                        <EventsList
                          events={!session ? publicEvents : org.orgEvents}
                          org={org}
                          orgQuery={orgQuery}
                          isCreator={isCreator}
                          isSubscribed={!!subscriberSubscription}
                          isLogin={isLogin}
                          setIsLogin={setIsLogin}
                          setTitle={setTitle}
                        />
                        <IconFooter />
                      </Box>
                    </Flex>
                  </TabPanel>
                )}

                {!!tabs.find(({ label }) => label === "Projets") && (
                  <TabPanel aria-hidden>
                    <ProjectsList
                      org={org}
                      orgQuery={orgQuery}
                      subQuery={subQuery}
                      isCreator={isCreator}
                      isFollowed={!!followerSubscription}
                      isSubscribed={!!subscriberSubscription}
                      isLogin={isLogin}
                      setIsLogin={setIsLogin}
                    />
                    <IconFooter />
                  </TabPanel>
                )}

                {!!tabs.find(({ label }) => label === "Discussions") && (
                  <TabPanel aria-hidden>
                    <Alert status="info" mb={5}>
                      <AlertIcon />
                      <Box>
                        Cette section a pour vocation principale de proposer une
                        alternative plus pratique et respectueuse aux{" "}
                        <Tooltip label="synonymes : mailing lists, newsletters">
                          <Text
                            display="inline"
                            borderBottom={`1px dotted ${
                              isDark ? "white" : "black"
                            }`}
                            cursor="pointer"
                          >
                            listes de diffusion
                          </Text>
                        </Tooltip>{" "}
                        traditionnelles. Également libre à vous de l'utiliser
                        comme bon vous semble, et de faire des suggestions sur
                        le
                        <ChatIcon color={isDark ? "yellow" : "green"} mx={1} />
                        <Link
                          //className={className}
                          variant="underline"
                          href="/forum"
                          //onMouseEnter={() => setClassName("rainbow-text")}
                          //onMouseLeave={() => setClassName(undefined)}
                        >
                          forum
                        </Link>
                        .
                      </Box>
                    </Alert>

                    <TopicsList
                      org={org}
                      query={orgQuery}
                      mutation={[editOrg, editOrgMutation]}
                      subQuery={subQuery}
                      isCreator={isCreator}
                      isFollowed={!!followerSubscription}
                      isSubscribed={!!subscriberSubscription}
                      isLogin={isLogin}
                      setIsLogin={setIsLogin}
                      currentTopicName={tabItem}
                    />
                    <IconFooter />

                    {process.env.NODE_ENV === "development" &&
                      session?.user.isAdmin && (
                        <Box mb={5}>
                          <Button
                            onClick={async () => {
                              await editOrg({
                                orgUrl: org.orgUrl,
                                payload: { orgTopics: [] }
                              }).unwrap();
                              orgQuery.refetch();
                            }}
                          >
                            RAZ
                          </Button>
                        </Box>
                      )}
                  </TabPanel>
                )}

                {!!tabs.find(({ label }) => label === "Galerie") && (
                  <TabPanel aria-hidden>
                    <DocumentsList
                      org={org}
                      isCreator={isCreator}
                      isSubscribed={!!subscriberSubscription}
                      isLogin={isLogin}
                      setIsLogin={setIsLogin}
                    />
                    <IconFooter />
                  </TabPanel>
                )}

                <TabPanel aria-hidden>
                  {defaultTabs
                    .filter((defaultTab) => defaultTab.label !== "")
                    .map((defaultTab) => {
                      return (
                        <Flex
                          key={"tab-" + defaultTab.label}
                          alignItems="center"
                          mb={1}
                          maxWidth="fit-content"
                        >
                          <Switch
                            isChecked={
                              !!tabsState.find(
                                (t) => t.label === defaultTab.label && t.checked
                              )
                            }
                            mr={1}
                            onChange={async (e) => {
                              const newTabs = tabsState.map((t) =>
                                t.label === defaultTab.label
                                  ? { ...t, checked: e.target.checked }
                                  : t
                              );
                              setTabsState(newTabs);

                              let orgTabs;

                              if (
                                e.target.checked &&
                                !org.orgTabs?.find(
                                  ({ label }) => label === defaultTab.label
                                )
                              ) {
                                orgTabs = [
                                  ...tabs.map(({ label, url }) => ({
                                    label,
                                    url
                                  })),
                                  {
                                    label: defaultTab.label,
                                    url: defaultTab.url
                                  }
                                ];
                              } else {
                                orgTabs = newTabs
                                  .filter(({ checked }) => !!checked)
                                  .map(({ label, url }) => ({ label, url }));
                                setCurrentTabIndex(
                                  indexOfbyKey(orgTabs, "label", "")
                                );
                              }

                              await editOrg({
                                orgUrl: org.orgUrl,
                                payload: { orgTabs }
                              });
                              orgQuery.refetch();
                            }}
                          />
                          <Input
                            defaultValue={defaultTab.label}
                            isDisabled={defaultTabs
                              .map(({ label }) => label)
                              .includes(defaultTab.label)}
                            onChange={(e) => {
                              let changed = false;
                              const newTabs = tabsState.map((t) => {
                                if (t.label === defaultTab.label) {
                                  if (e.target.value !== t.label)
                                    changed = true;
                                  return {
                                    ...t,
                                    label: e.target.value
                                  };
                                }
                                return t;
                              });

                              if (changed) setTabsState(newTabs);
                            }}
                          />
                        </Flex>
                      );
                    })}
                </TabPanel>
              </TabPanels>
            );
          }}
        </OrgPageTabs>
      )}

      {session && isCreator && (
        <OrgConfigPanel
          session={session}
          org={org}
          orgQuery={orgQuery}
          subQuery={subQuery}
          isConfig={isConfig}
          isEdit={isEdit}
          isVisible={isVisible}
          setIsConfig={setIsConfig}
          setIsEdit={setIsEdit}
          setIsVisible={setIsVisible}
        />
      )}
    </Layout>
  );
};
