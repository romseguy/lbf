import { ArrowBackIcon, EditIcon, SettingsIcon } from "@chakra-ui/icons";
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
  IconButton
} from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import DOMPurify from "isomorphic-dompurify";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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

export const OrgPage = ({
  populate,
  ...props
}: {
  populate?: string;
  org: IOrg;
}) => {
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();
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
    console.log("refetching org");
    orgQuery.refetch();
    setIsEdit(false);
  }, [router.asPath, refetchOrg]);

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
  const subscriptionRefetch = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    console.log("refetching subscription");
    subQuery.refetch();
  }, [subscriptionRefetch, userEmail]);

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
    <Layout org={org} isLogin={isLogin}>
      {isCreator && !isConfig ? (
        <Button
          aria-label="Paramètres"
          colorScheme="green"
          leftIcon={<SettingsIcon boxSize={6} data-cy="orgSettings" />}
          onClick={() => setIsConfig(true)}
          mb={2}
        >
          Paramètres {orgTypeFull(org.orgType)}
        </Button>
      ) : isConfig && !isEdit ? (
        <Button
          leftIcon={<ArrowBackIcon boxSize={6} />}
          onClick={() => setIsConfig(false)}
          mb={2}
        >
          {`Revenir ${orgTypeFull2(org.orgType)}`}
        </Button>
      ) : null}

      {!subQuery.isLoading && !isCreator && !isConfig && (
        <Flex>
          <>
            {isFollowed && (
              <Box mr={3}>
                <SubscriptionPopover
                  org={org}
                  query={orgQuery}
                  subQuery={subQuery}
                  followerSubscription={isFollowed}
                  //isLoading={subQuery.isLoading || subQuery.isFetching}
                />
              </Box>
            )}

            <SubscriptionPopover
              org={org}
              query={orgQuery}
              subQuery={subQuery}
              followerSubscription={isFollowed}
              notifType="push"
              //isLoading={subQuery.isLoading || subQuery.isFetching}
            />
          </>
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

      {(isCreator || isSubscribed) && (
        <Alert status="info" mb={3}>
          <AlertIcon />
          <Box>
            <Text>
              {isCreator ? (
                <>
                  Vous êtes administrateur {orgTypeFull(org.orgType)}{" "}
                  {org.orgName}.
                </>
              ) : isSubscribed ? (
                <>
                  Vous êtes adhérent {orgTypeFull(org.orgType)} {org.orgName}.
                  <Text fontSize="smaller">
                    Vous avez donc accès aux événements et discussions réservées
                    aux adhérents.
                  </Text>
                </>
              ) : null}
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
                  & {
                    grid-template-columns: minmax(425px, 1fr) minmax(170px, 1fr);
                  }
                  @media (max-width: 650px) {
                    & {
                      grid-template-columns: 1fr !important;
                    }
                  }
                `}
              >
                <GridItem
                  rowSpan={4}
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

                <GridItem
                  light={{ bg: "orange.100" }}
                  dark={{ bg: "gray.500" }}
                  borderTopRadius="lg"
                >
                  <Grid templateRows="auto 1fr">
                    <GridHeader borderTopRadius="lg" alignItems="center">
                      <Heading size="sm" py={3}>
                        Adresse
                      </Heading>
                    </GridHeader>

                    <GridItem
                      light={{ bg: "orange.100" }}
                      dark={{ bg: "gray.500" }}
                    >
                      <Box p={5}>
                        {org.orgAddress || (
                          <Text fontStyle="italic">Aucune adresse.</Text>
                        )}
                      </Box>
                    </GridItem>
                  </Grid>
                </GridItem>

                <GridItem
                  light={{ bg: "orange.100" }}
                  dark={{ bg: "gray.500" }}
                  borderTopRadius="lg"
                >
                  <Grid templateRows="auto 1fr">
                    <GridHeader borderTopRadius="lg" alignItems="center">
                      <Heading size="sm" py={3}>
                        Adresse e-mail
                      </Heading>
                    </GridHeader>

                    <GridItem
                      light={{ bg: "orange.100" }}
                      dark={{ bg: "gray.500" }}
                      overflowX="auto"
                    >
                      <Box p={5}>
                        {org.orgEmail || (
                          <Text fontStyle="italic">Aucune adresse e-mail.</Text>
                        )}
                      </Box>
                    </GridItem>
                  </Grid>
                </GridItem>

                <GridItem
                  light={{ bg: "orange.100" }}
                  dark={{ bg: "gray.500" }}
                  borderTopRadius="lg"
                >
                  <Grid templateRows="auto 1fr">
                    <GridHeader borderTopRadius="lg" alignItems="center">
                      <Heading size="sm" py={3}>
                        Numéro de téléphone
                      </Heading>
                    </GridHeader>

                    <GridItem
                      light={{ bg: "orange.100" }}
                      dark={{ bg: "gray.500" }}
                    >
                      <Box p={5}>
                        {org.orgPhone || (
                          <Text fontStyle="italic">
                            Aucun numéro de téléphone.
                          </Text>
                        )}
                      </Box>
                    </GridItem>
                  </Grid>
                </GridItem>

                <GridItem
                  light={{ bg: "orange.100" }}
                  dark={{ bg: "gray.500" }}
                  borderTopRadius="lg"
                >
                  <Grid templateRows="auto 1fr">
                    <GridHeader borderTopRadius="lg" alignItems="center">
                      <Heading size="sm" py={3}>
                        Site internet
                      </Heading>
                    </GridHeader>

                    <GridItem
                      light={{ bg: "orange.100" }}
                      dark={{ bg: "gray.500" }}
                    >
                      <Box p={5}>
                        {org.orgWeb ? (
                          <Link variant="underline" href={org.orgWeb}>
                            {org.orgWeb}
                          </Link>
                        ) : (
                          <Text fontStyle="italic">Aucun site internet.</Text>
                        )}
                      </Box>
                    </GridItem>
                  </Grid>
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
                <Alert status="info" mb={3}>
                  <AlertIcon />
                  Ajoutez une discussion pour notifier les abonnés.
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
