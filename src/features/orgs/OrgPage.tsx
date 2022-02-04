import {
  AddIcon,
  ArrowBackIcon,
  ChatIcon,
  EditIcon,
  HamburgerIcon,
  SettingsIcon
} from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  Spinner,
  Switch,
  TabPanel,
  TabPanels,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import DOMPurify from "isomorphic-dompurify";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { css } from "twin.macro";
import {
  EntityButton,
  EntityInfo,
  Link,
  TabContainer,
  TabContainerContent,
  TabContainerHeader
} from "features/common";
import { DocumentsList } from "features/documents/DocumentsList";
import { EventsList } from "features/events/EventsList";
import { Forum } from "features/forum/Forum";
import { TopicsList } from "features/forum/TopicsList";
import { Layout } from "features/layout";
import { ProjectsList } from "features/projects/ProjectsList";
import { SubscribePopover } from "features/subscriptions/SubscribePopover";
import { selectSubscriptionRefetch } from "features/subscriptions/subscriptionSlice";
import { Visibility as EventVisibility, Visibility } from "models/Event";
import { IOrg, IOrgTab, orgTypeFull, orgTypeFull5, OrgTypes } from "models/Org";
import {
  getFollowerSubscription,
  getSubscriberSubscription,
  ISubscription
} from "models/Subscription";
import { PageProps } from "pages/_app";
import { hasItems, sortOn } from "utils/array";
import { capitalize } from "utils/string";
import { AppQuery } from "utils/types";
import { OrgConfigPanel } from "./OrgConfigPanel";
import { OrgPageTabs, defaultTabs } from "./OrgPageTabs";
import { useEditOrgMutation, useGetOrgsQuery } from "./orgsApi";
import { selectOrgRefetch } from "./orgSlice";
import { FaRegMap } from "react-icons/fa";
import { IoIosGitNetwork } from "react-icons/io";
import { MapModal } from "features/modals/MapModal";
import { NetworksModal } from "features/modals/NetworksModal";
import { InputNode } from "features/treeChart/types";
import { OrgsList } from "./OrgsList";

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

let cachedEmail: string | undefined;
let cachedRefetchOrg = false;
let cachedRefetchSubscription = false;

export const OrgPage = ({
  email,
  isMobile,
  orgQuery,
  subQuery,
  session,
  tab,
  tabItem
}: PageProps & {
  orgQuery: AppQuery<IOrg>;
  subQuery: AppQuery<ISubscription>;
  tab?: string;
  tabItem?: string;
}) => {
  cachedEmail = email;
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const {
    isOpen: isMapModalOpen,
    onOpen: openMapModal,
    onClose: closeMapModal
  } = useDisclosure({ defaultIsOpen: false });
  const {
    isOpen: isNetworksModalOpen,
    onOpen: openNetworksModal,
    onClose: closeNetworksModal
  } = useDisclosure({ defaultIsOpen: false });

  //#region org
  const [editOrg, editOrgMutation] = useEditOrgMutation();
  const org = orgQuery.data;
  const orgsWithLocation =
    org.orgs?.filter(({ orgLat, orgLng }) => !!orgLat && !!orgLng) || [];

  const [description, setDescription] = useState<string | undefined>();
  useEffect(() => {
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

  const orgCreatedByUserName =
    typeof org.createdBy === "object"
      ? org.createdBy.userName || org.createdBy._id
      : "";
  const orgCreatedByUserId =
    typeof org.createdBy === "object" ? org.createdBy._id : "";
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

  const hasInfo =
    hasItems(org.orgAddress) ||
    hasItems(org.orgEmail) ||
    hasItems(org.orgPhone) ||
    hasItems(org.orgWeb);
  const isCreator =
    session?.user.userId === orgCreatedByUserId ||
    session?.user.isAdmin ||
    false;
  const events = !session
    ? org.orgEvents.filter(
        (orgEvent) => orgEvent.eventVisibility === EventVisibility.PUBLIC
      )
    : org.orgEvents;
  const [title = "Événements des 7 prochains jours", setTitle] = useState<
    string | undefined
  >();
  //#endregion

  //#region sub
  const isFollowed = !!getFollowerSubscription({ org, subQuery });
  const subscriberSubscription = getSubscriberSubscription({ org, subQuery });
  //#endregion

  //#region local state
  const [isConfig, setIsConfig] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [isVisible, setIsVisible] = useState<Visibility["isVisible"]>({
    logo: false,
    banner: false,
    topics: false,
    subscribers: false
  });

  const inputNodes: InputNode[] = useMemo(
    () =>
      org.orgs
        ? org.orgs
            .filter((o) => o.orgVisibility !== Visibility.PRIVATE)
            .map((o) => ({
              name: o.orgName,
              children: o.orgs?.map(({ orgName }) => ({ name: orgName }))
            }))
        : [],
    [org.orgs]
  );

  const tabs = useMemo(() => {
    return [...(org.orgTabs || defaultTabs)]
      .sort(
        sortOn(
          "label",
          defaultTabs
            .filter(({ label }) => label !== "")
            .map(({ label }) => label)
        )
      )
      .map((tab) => ({
        ...tab,
        ...defaultTabs.find((defaultTab) => {
          //if (tab.label === "") return defaultTab.label === "Paramètres"
          return defaultTab.label === tab.label;
        })
      }));
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

  //#region cross refetch
  const refetchOrg = useSelector(selectOrgRefetch);
  const refetchSubscription = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    if (refetchOrg !== cachedRefetchOrg) {
      console.log("refetching org");
      cachedRefetchOrg = refetchOrg;
      orgQuery.refetch();
    }

    if (refetchSubscription !== cachedRefetchSubscription) {
      console.log("refetching subscription");
      cachedRefetchSubscription = refetchSubscription;
      subQuery.refetch();
    }
  }, [refetchOrg, refetchSubscription]);
  useEffect(() => {
    if (email !== cachedEmail) {
      console.log("email changed, refetching");
      cachedEmail = email;
      orgQuery.refetch();
      subQuery.refetch();
    }
  }, [email]);
  //#endregion

  const configButtons = () => {
    return (
      <>
        {isCreator && !isConfig && !isEdit && (
          <Button
            colorScheme="teal"
            leftIcon={<SettingsIcon boxSize={6} data-cy="org-settings" />}
            onClick={() => setIsConfig(true)}
            mb={2}
          >
            Configuration {orgTypeFull(org.orgType)}
          </Button>
        )}

        {isEdit && (
          <Button
            colorScheme="teal"
            leftIcon={<ArrowBackIcon boxSize={6} />}
            onClick={() => setIsEdit(false)}
            mb={2}
          >
            Retour
          </Button>
        )}

        {!isEdit && isConfig && (
          <Button
            colorScheme="teal"
            leftIcon={<ArrowBackIcon boxSize={6} />}
            onClick={() => setIsConfig(false)}
            mb={2}
          >
            {`Revenir à la page ${orgTypeFull(org.orgType)}`}
          </Button>
        )}
      </>
    );
  };

  if (org.orgUrl === "forum") {
    if (!orgQuery.isLoading && !org) {
      <Layout isLogin={isLogin} isMobile={isMobile} session={session}>
        <Alert status="warning">
          <AlertIcon />
          Veuillez créer l'organisation forum.
        </Alert>
      </Layout>;
    }
    return (
      <Layout org={org} isLogin={isLogin} isMobile={isMobile} session={session}>
        {configButtons()}

        {!isConfig && !isEdit && (
          <Forum
            isLogin={isLogin}
            setIsLogin={setIsLogin}
            orgQuery={orgQuery}
            subQuery={subQuery}
            tabItem={tabItem}
          />
        )}

        {session && isCreator && (
          <OrgConfigPanel
            session={session}
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
  }

  return (
    <Layout org={org} isLogin={isLogin} isMobile={isMobile} session={session}>
      {configButtons()}

      {!isConfig && !isEdit && !subQuery.isLoading && (
        <Flex flexDirection="row" flexWrap="wrap" mt={-3}>
          {isFollowed && (
            <Box mr={3} mt={3}>
              <SubscribePopover
                org={org}
                query={orgQuery}
                subQuery={subQuery}
              />
            </Box>
          )}

          <Box mt={3}>
            <SubscribePopover
              org={org}
              query={orgQuery}
              subQuery={subQuery}
              notifType="push"
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
        <OrgPageTabs
          org={org}
          session={session}
          currentTabLabel={tab}
          tabs={tabs}
        >
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
                    <TabContainer>
                      <TabContainerHeader
                        heading={`Coordonnées ${orgTypeFull(org.orgType)}`}
                      >
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
                      </TabContainerHeader>

                      <TabContainerContent p={3}>
                        {hasInfo ? (
                          <EntityInfo entity={org} />
                        ) : isCreator ? (
                          <Button
                            alignSelf="flex-start"
                            colorScheme="teal"
                            leftIcon={<AddIcon />}
                            onClick={() => setIsEdit(true)}
                          >
                            Ajouter
                          </Button>
                        ) : (
                          <Text fontStyle="italic">Aucunes coordonnées.</Text>
                        )}
                      </TabContainerContent>
                    </TabContainer>

                    {org.orgType === OrgTypes.NETWORK && (
                      <TabContainer>
                        <TabContainerHeader heading="Topologie du réseau">
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
                        </TabContainerHeader>
                        <TabContainerContent p={3}>
                          {orgQuery.isLoading ? (
                            <Spinner />
                          ) : (
                            <>
                              <Button
                                alignSelf="flex-start"
                                colorScheme="teal"
                                leftIcon={<IoIosGitNetwork />}
                                mb={5}
                                onClick={openNetworksModal}
                              >
                                Arborescence
                              </Button>

                              <Button
                                alignSelf="flex-start"
                                colorScheme="teal"
                                leftIcon={<FaRegMap />}
                                onClick={openMapModal}
                                mb={5}
                              >
                                Carte
                              </Button>

                              <Button
                                alignSelf="flex-start"
                                colorScheme="teal"
                                leftIcon={<HamburgerIcon />}
                                onClick={() => setIsListOpen(!isListOpen)}
                              >
                                Liste
                              </Button>

                              {isListOpen && (
                                <OrgsList
                                  data={org.orgs}
                                  isLoading={orgQuery.isLoading}
                                />
                              )}
                            </>
                          )}
                        </TabContainerContent>
                      </TabContainer>
                    )}

                    {Array.isArray(orgNetworks) && orgNetworks.length > 0 && (
                      <TabContainer>
                        <TabContainerHeader
                          heading={`
                            ${capitalize(orgTypeFull5(org.orgType))} est
                            membre ${
                              orgNetworks.length === 1
                                ? "du réseau"
                                : "des réseaux"
                            } :
                          `}
                        />
                        <TabContainerContent p={3}>
                          {orgNetworks.map((network) => (
                            <Flex>
                              <EntityButton
                                key={network._id}
                                org={network}
                                mb={1}
                              />
                            </Flex>
                          ))}
                        </TabContainerContent>
                      </TabContainer>
                    )}

                    <TabContainer>
                      <TabContainerHeader
                        heading={`Présentation ${orgTypeFull(org.orgType)}`}
                      >
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
                      </TabContainerHeader>
                      <TabContainerContent p={3}>
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
                            alignSelf="flex-start"
                            colorScheme="teal"
                            leftIcon={<AddIcon />}
                            onClick={() => setIsEdit(true)}
                          >
                            Ajouter
                          </Button>
                        ) : (
                          <Text fontStyle="italic">Aucune présentation.</Text>
                        )}
                      </TabContainerContent>
                    </TabContainer>
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
                          events={events}
                          org={org}
                          orgQuery={orgQuery}
                          isCreator={isCreator}
                          isSubscribed={!!subscriberSubscription}
                          isLogin={isLogin}
                          setIsLogin={setIsLogin}
                          setTitle={setTitle}
                        />
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
                      isFollowed={isFollowed}
                      isSubscribed={!!subscriberSubscription}
                      isLogin={isLogin}
                      setIsLogin={setIsLogin}
                    />
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
                      isFollowed={isFollowed}
                      isSubscribed={!!subscriberSubscription}
                      isLogin={isLogin}
                      setIsLogin={setIsLogin}
                      currentTopicName={tabItem}
                    />

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
                            isDisabled={defaultTab.label === "Accueil"}
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
                              }

                              setCurrentTabIndex(orgTabs.length - 1);

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

      {isNetworksModalOpen && (
        <NetworksModal
          inputNodes={inputNodes}
          isMobile={isMobile}
          isOpen={isNetworksModalOpen}
          rootName={org.orgName}
          onClose={closeNetworksModal}
        />
      )}

      {isMapModalOpen && (
        <MapModal
          isOpen={isMapModalOpen}
          header="Carte des réseaux"
          orgs={
            org.orgs?.filter(
              (org) =>
                typeof org.orgLat === "number" &&
                typeof org.orgLng === "number" &&
                org.orgUrl !== "forum"
            ) || []
          }
          onClose={closeMapModal}
        />
      )}
    </Layout>
  );
};

// {orgsWithLocation.length > 0 && (
//   <TabContainer>
//     <TabContainerHeader heading="Carte du réseau">
//       {isCreator && (
//         <Tooltip
//           hasArrow
//           label="Ajouter ou supprimer des organisations du réseau"
//           placement="bottom"
//         >
//           <IconButton
//             aria-label="Ajouter ou supprimer des organisations du réseau"
//             icon={<EditIcon />}
//             bg="transparent"
//             _hover={{ color: "green" }}
//             onClick={() => setIsEdit(true)}
//           />
//         </Tooltip>
//       )}
//     </TabContainerHeader>
//     <TabContainerContent>
//       <MapContainer
//         orgs={orgsWithLocation}
//         center={{
//           lat: orgsWithLocation[0].orgLat,
//           lng: orgsWithLocation[0].orgLng
//         }}
//       />
//     </TabContainerContent>
//   </TabContainer>
// )}

// {Array.isArray(org.orgs) && org.orgs.length > 0 && (
//   <TabContainer>
//     <TabContainerHeader heading="Membres du réseau">
//       {isCreator && (
//         <Tooltip
//           hasArrow
//           label="Ajouter ou supprimer des organisations du réseau"
//           placement="bottom"
//         >
//           <IconButton
//             aria-label="Ajouter ou supprimer des organisations du réseau"
//             icon={<EditIcon />}
//             bg="transparent"
//             _hover={{ color: "green" }}
//             onClick={() => setIsEdit(true)}
//           />
//         </Tooltip>
//       )}
//     </TabContainerHeader>
//     <TabContainerContent>
//       {[...org.orgs]
//         .sort((a, b) => {
//           if (a.orgName > b.orgName) return -1;
//           if (a.orgName < b.orgName) return 1;
//           return 0;
//         })
//         .map((childOrg, index) => {
//           return (
//             <Flex>
//               <EntityButton
//                 org={childOrg}
//                 mb={
//                   index === org.orgs!.length - 1 ? 3 : 0
//                 }
//                 mt={3}
//                 mx={3}
//               />
//             </Flex>
//           );
//         })}
//     </TabContainerContent>
//   </TabContainer>
// )}
