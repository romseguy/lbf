import {
  ArrowBackIcon,
  AtSignIcon,
  EditIcon,
  PhoneIcon,
  SettingsIcon
} from "@chakra-ui/icons";
import {
  Box,
  Text,
  Heading,
  Grid,
  useToast,
  TabPanels,
  TabPanel,
  Flex,
  Tooltip,
  Alert,
  AlertIcon,
  IconButton,
  Icon
} from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import DOMPurify from "isomorphic-dompurify";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaGlobeEurope, FaMapMarkedAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { css } from "twin.macro";

import {
  Button,
  GridHeader,
  GridItem,
  IconFooter,
  Link
} from "features/common";
import { DocumentsList } from "features/documents/DocumentsList";
import { EventsList } from "features/events/EventsList";
import { TopicsList } from "features/forum/TopicsList";
import { Layout } from "features/layout";
import { ProjectsList } from "features/projects/ProjectsList";
import {
  useAddSubscriptionMutation,
  useGetSubscriptionQuery
} from "features/subscriptions/subscriptionsApi";
import { SubscriptionPopover } from "features/subscriptions/SubscriptionPopover";
import {
  isFollowedBy,
  isSubscribedBy,
  selectSubscriptionRefetch
} from "features/subscriptions/subscriptionSlice";
import { selectUserEmail } from "features/users/userSlice";
import { useSession } from "hooks/useAuth";
import { Visibility as EventVisibility } from "models/Event";
import { IOrg, orgTypeFull, orgTypeFull2 } from "models/Org";
import { hasItems } from "utils/array";
import { OrgConfigPanel } from "./OrgConfigPanel";
import { OrgPageTabs } from "./OrgPageTabs";
import { selectOrgRefetch } from "./orgSlice";
import { useGetOrgQuery } from "./orgsApi";

export type Visibility = {
  isVisible: {
    logo: boolean;
    banner: boolean;
    subscribers: boolean;
    topics: boolean;
  };
  setIsVisible: (obj: Visibility["isVisible"]) => void;
};

let cachedRefetchOrg = false;
let cachedRefetchSubscription = false;
let cachedEmail: string | undefined;

export const OrgPage = ({
  populate,
  ...props
}: {
  populate?: string;
  org: IOrg;
  session: Session | null;
}) => {
  const router = useRouter();
  const { data, loading: isSessionLoading } = useSession();
  const session = data || props.session;
  const toast = useToast({ position: "top" });
  const userEmail = useSelector(selectUserEmail) || session?.user.email;

  //#region org
  const orgQuery = useGetOrgQuery(
    { orgUrl: props.org.orgUrl, populate },
    {
      selectFromResult: (query) => query
    }
  );
  const org = orgQuery.data || props.org;
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
  useEffect(() => {
    console.log("refetching org with new route", router.asPath);
    orgQuery.refetch();
    setIsEdit(false);
  }, [router.asPath]);

  const orgCreatedByUserName =
    typeof org.createdBy === "object"
      ? org.createdBy.userName || org.createdBy._id
      : "";
  const orgCreatedByUserId =
    typeof org.createdBy === "object" ? org.createdBy._id : "";
  const isCreator =
    session?.user.userId === orgCreatedByUserId || session?.user.isAdmin;
  const publicEvents = org.orgEvents.filter(
    (orgEvent) => orgEvent.eventVisibility === EventVisibility.PUBLIC
  );
  //#endregion

  //#region sub
  const [addSubscription, addSubscriptionMutation] =
    useAddSubscriptionMutation();
  const subQuery = useGetSubscriptionQuery(userEmail);
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

  const isFollowed = isFollowedBy({ org, subQuery });
  const isSubscribed = isSubscribedBy(org, subQuery);
  //#endregion

  //#region local state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(0);
  const [isConfig, setIsConfig] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isVisible, setIsVisible] = useState<Visibility["isVisible"]>({
    logo: false,
    banner: false,
    topics: false,
    subscribers: false
  });
  //#endregion

  const addEvent = () => {
    if (!isSessionLoading) {
      if (!session) setIsLogin(isLogin + 1);
      else if (isCreator) setIsEventModalOpen(true);
    }
  };

  return (
    <Layout org={org} isLogin={isLogin} session={props.session}>
      {isCreator && !isConfig ? (
        <Button
          colorScheme="teal"
          leftIcon={<SettingsIcon boxSize={6} data-cy="orgSettings" />}
          onClick={() => setIsConfig(true)}
          mb={2}
        >
          Paramètres {orgTypeFull(org.orgType)}
        </Button>
      ) : isConfig ? (
        <Button
          colorScheme="pink"
          leftIcon={<ArrowBackIcon boxSize={6} />}
          onClick={() => setIsConfig(false)}
          mb={2}
        >
          {`Revenir à la page ${orgTypeFull(org.orgType)}`}
        </Button>
      ) : null}

      {!subQuery.isLoading && !isConfig && (
        <Flex flexDirection="row" flexWrap="wrap" mt={-3}>
          {isFollowed && (
            <Box mr={3} mt={3}>
              <SubscriptionPopover
                org={org}
                query={orgQuery}
                subQuery={subQuery}
                followerSubscription={isFollowed}
                //isLoading={subQuery.isLoading || subQuery.isFetching}
              />
            </Box>
          )}

          <Box mt={3}>
            <SubscriptionPopover
              org={org}
              query={orgQuery}
              subQuery={subQuery}
              followerSubscription={isFollowed}
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

      {isSubscribed && !isConfig && (
        <Alert status="info" mb={3}>
          <AlertIcon />
          <Box>
            <Text>
              Vous êtes adhérent {orgTypeFull(org.orgType)} {org.orgName}.
              <Text fontSize="smaller">
                Vous avez donc accès aux événements et discussions réservées aux
                adhérents.
              </Text>
            </Text>
          </Box>
        </Alert>
      )}

      {!isConfig && (
        <OrgPageTabs>
          <TabPanels>
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
                  dark={{ bg: "gray.500" }}
                  borderTopRadius="lg"
                >
                  <Grid templateRows="auto 1fr">
                    <GridHeader borderTopRadius="lg" alignItems="center">
                      <Heading size="sm" py={3}>
                        Coordonnées
                      </Heading>
                    </GridHeader>

                    <GridItem
                      light={{ bg: "orange.100" }}
                      dark={{ bg: "gray.500" }}
                    >
                      <Box p={5}>
                        {!org.orgAddress &&
                          !hasItems(org.orgEmail) &&
                          !hasItems(org.orgPhone) &&
                          !hasItems(org.orgWeb) && (
                            <Link
                              onClick={() => {
                                setIsEdit(true);
                                setIsConfig(true);
                              }}
                              variant="underline"
                            >
                              Cliquez ici pour ajouter les coordonnées{" "}
                              {orgTypeFull(org.orgType)}.
                            </Link>
                          )}

                        {org.orgAddress && (
                          <Flex flexDirection="column">
                            <Flex alignItems="center">
                              <Icon as={FaMapMarkedAlt} mr={3} />
                              {org.orgAddress}
                            </Flex>
                          </Flex>
                        )}

                        {org.orgEmail && (
                          <Flex flexDirection="column">
                            {org.orgEmail?.map(({ email }, index) => (
                              <Flex key={`email-${index}`} alignItems="center">
                                <AtSignIcon mr={3} />
                                <Link
                                  variant="underline"
                                  href={`mailto:${email}`}
                                >
                                  {email}
                                </Link>
                              </Flex>
                            ))}
                          </Flex>
                        )}

                        {org.orgPhone && (
                          <Flex flexDirection="column">
                            {org.orgPhone?.map(({ phone }, index) => (
                              <Flex key={`phone-${index}`} alignItems="center">
                                <PhoneIcon mr={3} />
                                <Link
                                  variant="underline"
                                  href={`tel:+33${phone.substr(
                                    1,
                                    phone.length
                                  )}`}
                                >
                                  {phone}
                                </Link>
                              </Flex>
                            ))}
                          </Flex>
                        )}

                        {org.orgWeb && (
                          <Flex flexDirection="column">
                            {org.orgWeb?.map(({ url, prefix }, index) => (
                              <Flex key={`web-${index}`} alignItems="center">
                                <Icon as={FaGlobeEurope} mr={3} />
                                <Link
                                  variant="underline"
                                  href={
                                    !url.includes("http") ? prefix + url : url
                                  }
                                >
                                  {url
                                    .replace(/\/$/, "")
                                    .replace(/(https|http):\/\//, "")}
                                </Link>
                              </Flex>
                            ))}
                          </Flex>
                        )}
                      </Box>
                    </GridItem>
                  </Grid>
                </GridItem>

                <GridItem
                  rowSpan={1}
                  borderTopRadius="lg"
                  light={{ bg: "orange.100" }}
                  dark={{ bg: "gray.500" }}
                >
                  <GridHeader borderTopRadius="lg" alignItems="center">
                    <Flex flexDirection="row" alignItems="center">
                      <Heading size="sm" py={3}>
                        Description {orgTypeFull(org.orgType)}
                      </Heading>
                      {org.orgDescription && isCreator && (
                        <Tooltip
                          placement="bottom"
                          label="Modifier la description"
                        >
                          <IconButton
                            aria-label="Modifier la description"
                            icon={<EditIcon />}
                            bg="transparent"
                            ml={3}
                            _hover={{ color: "green" }}
                            onClick={() => {
                              setIsConfig(true);
                              setIsEdit(true);
                            }}
                          />
                        </Tooltip>
                      )}
                    </Flex>
                  </GridHeader>

                  <GridItem>
                    <Box className="ql-editor" p={5}>
                      {org.orgDescription && org.orgDescription.length > 0 ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(org.orgDescription)
                          }}
                        />
                      ) : isCreator ? (
                        <Link
                          onClick={() => {
                            setIsEdit(true);
                            setIsConfig(true);
                          }}
                          variant="underline"
                        >
                          Cliquez ici pour ajouter la description{" "}
                          {orgTypeFull(org.orgType)}.
                        </Link>
                      ) : (
                        <Text fontStyle="italic">Aucune description.</Text>
                      )}
                    </Box>
                  </GridItem>
                </GridItem>
              </Grid>
            </TabPanel>

            <TabPanel aria-hidden>
              <EventsList
                events={!session ? publicEvents : org.orgEvents}
                org={org}
                orgQuery={orgQuery}
                isCreator={isCreator}
                isSubscribed={isSubscribed}
                isLogin={isLogin}
                setIsLogin={setIsLogin}
              />
              <IconFooter />
            </TabPanel>

            <TabPanel aria-hidden>
              <ProjectsList
                org={org}
                orgQuery={orgQuery}
                isCreator={isCreator}
                isFollowed={!!isFollowed}
                isSubscribed={isSubscribed}
                isLogin={isLogin}
                setIsLogin={setIsLogin}
              />
              <IconFooter />
            </TabPanel>

            <TabPanel aria-hidden>
              {(isCreator || isSubscribed) && (
                // <DidYouKnow mb={3}>
                //   Le saviez-vous ? Vous pouvez notifier vos abonnés de l'ajout
                //   d'une nouvelle discussion.
                // </DidYouKnow>
                <Alert status="info" mb={5}>
                  <AlertIcon />
                  <Box>
                    Cette section a pour vocation de proposer une alternative
                    plus simple et respectueuse des abonnées aux{" "}
                    <Tooltip label="synonymes : mailing lists, newsletters">
                      <Text
                        display="inline"
                        borderBottom="1px dotted black"
                        cursor="pointer"
                      >
                        listes de diffusion
                      </Text>
                    </Tooltip>
                    .
                  </Box>
                </Alert>
              )}
              <TopicsList
                org={org}
                query={orgQuery}
                subQuery={subQuery}
                isCreator={isCreator}
                isFollowed={!!isFollowed}
                isSubscribed={isSubscribed}
                isLogin={isLogin}
                setIsLogin={setIsLogin}
              />
              <IconFooter />
            </TabPanel>

            <TabPanel aria-hidden>
              <DocumentsList
                org={org}
                query={orgQuery}
                isCreator={isCreator}
                isSubscribed={isSubscribed}
                isLogin={isLogin}
                setIsLogin={setIsLogin}
              />
              <IconFooter />
            </TabPanel>
          </TabPanels>
        </OrgPageTabs>
      )}

      {isConfig && session && (
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
