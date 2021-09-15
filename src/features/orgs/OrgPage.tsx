import { Visibility as EventVisibility } from "models/Event";
import { IOrg, orgTypeFull, orgTypeFull2, OrgTypesV } from "models/Org";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useSession } from "hooks/useAuth";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import DOMPurify from "isomorphic-dompurify";
import {
  Box,
  Text,
  Heading,
  Grid,
  useToast,
  TabPanels,
  TabPanel,
  Icon,
  Flex,
  Tooltip,
  Alert,
  AlertIcon,
  IconButton
} from "@chakra-ui/react";
import {
  AddIcon,
  ArrowBackIcon,
  EditIcon,
  SettingsIcon
} from "@chakra-ui/icons";
import {
  Button,
  GridHeader,
  GridItem,
  IconFooter,
  Link
} from "features/common";
import { EventsList } from "features/events/EventsList";
import { TopicsList } from "features/forum/TopicsList";
import { Layout } from "features/layout";
import { EventModal } from "features/modals/EventModal";
import { useGetSubscriptionQuery } from "features/subscriptions/subscriptionsApi";
import { SubscriptionPopover } from "features/subscriptions/SubscriptionPopover";
import {
  isFollowedBy,
  isSubscribedBy,
  selectSubscriptionRefetch
} from "features/subscriptions/subscriptionSlice";
import { selectUserEmail } from "features/users/userSlice";
import { OrgConfigPanel } from "./OrgConfigPanel";
import { selectOrgRefetch } from "./orgSlice";
import { OrgPageTabs } from "./OrgPageTabs";
import { ProjectsList } from "features/projects/ProjectsList";
import { useGetOrgQuery } from "./orgsApi";

export type Visibility = {
  isVisible: {
    banner: boolean;
    subscribers: boolean;
    topics: boolean;
  };
  setIsVisible: (obj: Visibility["isVisible"]) => void;
};

export const OrgPage = ({ ...props }: { org: IOrg }) => {
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();
  const toast = useToast({ position: "top" });

  //#region org
  const orgQuery = useGetOrgQuery(
    { orgUrl: props.org.orgUrl, populate: "orgProjects" },
    {
      selectFromResult: (query) => query
    }
  );
  const org = orgQuery.data || props.org;

  const refetchOrg = useSelector(selectOrgRefetch);
  useEffect(() => {
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
  const storedUserEmail = useSelector(selectUserEmail);
  const userEmail = storedUserEmail || session?.user.email || "";
  const subQuery = useGetSubscriptionQuery(userEmail || session?.user.userId);
  const isFollowed = isFollowedBy({ org, subQuery });
  const isSubscribed = isSubscribedBy(org, subQuery);
  //#endregion

  //#region local state
  const [email, setEmail] = useState(userEmail);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(0);
  const [isConfig, setIsConfig] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isVisible, setIsVisible] = useState<Visibility["isVisible"]>({
    topics: false,
    banner: false,
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
    <Layout
      org={org}
      pageTitle={org.orgName}
      isLogin={isLogin}
      banner={org.orgBanner}
    >
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

      {!isCreator && (
        <SubscriptionPopover
          org={org}
          isFollowed={isFollowed}
          mySubscription={subQuery.data}
          isLoading={subQuery.isLoading || subQuery.isFetching}
          onSubmit={(subscribed: boolean) => {
            if (subscribed) {
              toast({
                title: `Vous êtes maintenant abonné à ${org.orgName}`,
                status: "success",
                duration: 9000,
                isClosable: true
              });
            } else {
              toast({
                title: `Vous êtes désabonné de ${org.orgName}`,
                status: "success",
                duration: 9000,
                isClosable: true
              });
            }
            subQuery.refetch();
          }}
        />
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
              <>
                <Grid templateRows="auto 1fr">
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

                  <GridItem
                    light={{ bg: "orange.100" }}
                    dark={{ bg: "gray.500" }}
                  >
                    <Box p={5}>
                      {org.orgDescription ? (
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
                </Grid>
                <IconFooter />
              </>
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
                email={email}
                setEmail={setEmail}
              />
              <IconFooter />
            </TabPanel>

            <TabPanel aria-hidden>
              <TopicsList
                org={org}
                query={orgQuery}
                isCreator={isCreator}
                isFollowed={!!isFollowed}
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
