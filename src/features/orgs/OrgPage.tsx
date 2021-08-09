import { IOrg, orgTypeFull, orgTypeFull2 } from "models/Org";
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
  TabPanel
} from "@chakra-ui/react";
import { AddIcon, ArrowBackIcon, SettingsIcon } from "@chakra-ui/icons";
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
import { useGetOrgByNameQuery } from "features/orgs/orgsApi";
import { useGetSubscriptionQuery } from "features/subscriptions/subscriptionsApi";
import { SubscriptionPopover } from "features/subscriptions/SubscriptionPopover";
import {
  isFollowedBy,
  isSubscribedBy,
  selectSubscriptionRefetch
} from "features/subscriptions/subscriptionSlice";
import { selectSubscribedEmail } from "features/users/userSlice";
import { OrgConfigPanel } from "./OrgConfigPanel";
import { selectOrgRefetch } from "./orgSlice";
import { OrgPageTabs } from "./OrgPageTabs";

export type Visibility = {
  isVisible: {
    banner: boolean;
    subscribers: boolean;
    topics: boolean;
  };
  setIsVisible: (obj: Visibility["isVisible"]) => void;
};

export const OrgPage = ({
  routeName,
  ...props
}: {
  org: IOrg;
  routeName: string;
}) => {
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();

  const orgQuery = useGetOrgByNameQuery(routeName);
  const refetchOrg = useSelector(selectOrgRefetch);
  useEffect(() => {
    console.log("refetching org");
    orgQuery.refetch();
    setIsEdit(false);
  }, [router.asPath, refetchOrg]);
  const org = orgQuery.data || props.org;
  const orgCreatedByUserName =
    typeof org.createdBy === "object" ? org.createdBy.userName : "";

  const isCreator = session?.user.userName === orgCreatedByUserName;

  const subscribedEmail = useSelector(selectSubscribedEmail);

  const subQuery = useGetSubscriptionQuery(
    subscribedEmail || session?.user.userId
  );
  const subscriptionRefetch = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    console.log("refetching subscription");
    subQuery.refetch();
  }, [subscriptionRefetch]);

  const [isFollowed, setIsFollowed] = useState(isFollowedBy(org, subQuery));
  const [isSubscribed, setIsSubscribed] = useState(
    isSubscribedBy(org, subQuery)
  );
  useEffect(() => {
    if (org && subQuery.data) {
      setIsFollowed(isFollowedBy(org, subQuery));
      setIsSubscribed(isSubscribedBy(org, subQuery));
    }
  }, [org, subQuery.data]);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(0);
  const [isConfig, setIsConfig] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isVisible, setIsVisible] = useState<Visibility["isVisible"]>({
    topics: false,
    banner: false,
    subscribers: false
  });

  const toast = useToast({ position: "top" });

  return (
    <Layout pageTitle={org.orgName} isLogin={isLogin} banner={org.orgBanner}>
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
          {`Revenir à ${orgTypeFull2(org.orgType)}`}
        </Button>
      ) : null}

      {!isCreator && (
        <SubscriptionPopover
          org={org}
          mySubscription={subQuery.data}
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
          isFollowed={isFollowed}
          isLoading={subQuery.isLoading}
        />
      )}

      <Box my={3}>
        <Text fontSize="smaller">
          Organisation ajoutée le{" "}
          {format(parseISO(org.createdAt!), "eeee d MMMM yyyy", {
            locale: fr
          })}{" "}
          par :{" "}
          <Link
            variant="underline"
            href={`/${encodeURIComponent(orgCreatedByUserName)}`}
          >
            {orgCreatedByUserName}
          </Link>{" "}
          {isCreator && "(Vous)"}
        </Text>
      </Box>

      {!isConfig && (
        <OrgPageTabs>
          <TabPanels>
            <TabPanel>
              <>
                <Grid templateRows="auto 1fr">
                  <GridHeader borderTopRadius="lg" alignItems="center">
                    <Heading size="sm" py={3}>
                      Description {orgTypeFull(org.orgType)}
                    </Heading>
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
                          Cliquez ici pour ajouter la description.
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
            <TabPanel>
              <>
                <Button
                  colorScheme="teal"
                  leftIcon={<AddIcon />}
                  mb={5}
                  onClick={() => {
                    if (!isSessionLoading) {
                      if (!session) setIsLogin(isLogin + 1);
                      // TODO: check if user is SUB
                      else if (isCreator) setIsEventModalOpen(true);
                    }
                  }}
                  data-cy="addEvent"
                >
                  Ajouter un événement
                </Button>

                {isEventModalOpen && session && (
                  <EventModal
                    session={session}
                    initialEventOrgs={[org]}
                    onCancel={() => setIsEventModalOpen(false)}
                    onSubmit={async (eventUrl) => {
                      await router.push(`/${eventUrl}`);
                    }}
                    onClose={() => setIsEventModalOpen(false)}
                  />
                )}
              </>
              {Array.isArray(org.orgEvents) && org.orgEvents.length > 0 ? (
                <div>
                  <EventsList events={org.orgEvents || []} />
                  <IconFooter />
                </div>
              ) : null}
            </TabPanel>
            <TabPanel>
              <>
                <TopicsList
                  entity={org}
                  query={orgQuery}
                  isCreator={isCreator}
                  isFollowed={isFollowed}
                  isSubscribed={isSubscribed}
                  isLogin={isLogin}
                  setIsLogin={setIsLogin}
                />
                <IconFooter />
              </>
            </TabPanel>
          </TabPanels>
        </OrgPageTabs>
      )}

      {isConfig && session && (
        <OrgConfigPanel
          session={session}
          org={org}
          orgQuery={orgQuery}
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
