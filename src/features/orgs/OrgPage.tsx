import { IOrg, OrgTypes, OrgTypesV } from "models/Org";
import { IOrgSubscription, SubscriptionTypes } from "models/Subscription";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import parse from "html-react-parser";
import {
  Box,
  Text,
  Heading,
  useColorModeValue,
  Grid,
  IconButton,
  useToast
} from "@chakra-ui/react";
import { useSession } from "hooks/useAuth";
import { Layout } from "features/layout";
import { useGetOrgByNameQuery } from "features/orgs/orgsApi";
import { Button, GridHeader, GridItem, Link } from "features/common";
import { AddIcon, ChevronLeftIcon, SettingsIcon } from "@chakra-ui/icons";
import tw, { css } from "twin.macro";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { TopicsList } from "features/forum/TopicsList";
import { EventsList } from "features/events/EventsList";
import { TopicModal } from "features/modals/TopicModal";
import { OrgConfigPanel } from "./OrgConfigPanel";
import { SubscriptionPopover } from "features/subscriptions/SubscriptionPopover";
import { useGetSubscriptionQuery } from "features/subscriptions/subscriptionsApi";
import { OrgEventHeader } from "./OrgEventHeader";
import { selectUserEmail } from "features/users/userSlice";
import { useSelector } from "react-redux";

export type Visibility = {
  isVisible: {
    banner: boolean;
    subscribers: boolean;
    topics: boolean;
  };
  setIsVisible: (obj: Visibility["isVisible"]) => void;
};

const isFollowedInitialState = (org: IOrg, subQuery: any) =>
  !!subQuery.data?.orgs?.find(
    (orgSubscription: IOrgSubscription) =>
      (orgSubscription.orgId === org._id &&
        orgSubscription.type === SubscriptionTypes.FOLLOWER) ||
      orgSubscription.type === SubscriptionTypes.BOTH
  );
const isSubscribedInitialState = (org: IOrg, subQuery: any) =>
  !!subQuery.data?.orgs?.find(
    (orgSubscription: IOrgSubscription) =>
      (orgSubscription.orgId === org._id &&
        orgSubscription.type === SubscriptionTypes.SUBSCRIBER) ||
      orgSubscription.type === SubscriptionTypes.BOTH
  );

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
  useEffect(() => {
    console.log("refetching org");
    orgQuery.refetch();
    setIsEdit(false);
  }, [router.asPath]);
  const org = orgQuery.data || props.org;
  const isCreator = session?.user.userId === org.createdBy._id;

  const userEmail = useSelector(selectUserEmail);
  const subQuery = useGetSubscriptionQuery(userEmail || session?.user.userId);
  const [isFollowed, setIsFollowed] = useState(
    isFollowedInitialState(org, subQuery)
  );
  const [isSubscribed, setIsSubscribed] = useState(
    isSubscribedInitialState(org, subQuery)
  );
  useEffect(() => {
    if (!session) {
      setIsFollowed(false);
      setIsSubscribed(false);
    } else {
      setIsFollowed(isFollowedInitialState(org, subQuery));
      setIsSubscribed(isSubscribedInitialState(org, subQuery));
    }
  }, [session, subQuery.data]);

  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(0);
  const [isConfig, setIsConfig] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isVisible, setIsVisible] = useState<Visibility["isVisible"]>({
    topics: false,
    banner: false,
    subscribers: false
  });

  const toast = useToast({ position: "top" });
  const eventBg = useColorModeValue("blue.100", "blue.800");

  return (
    <Layout pageTitle={org.orgName} isLogin={isLogin} banner={org.orgBanner}>
      {isTopicModalOpen && org && (
        <TopicModal
          org={org}
          onCancel={() => setIsTopicModalOpen(false)}
          onSubmit={async (topicName) => {
            orgQuery.refetch();
            setIsTopicModalOpen(false);
          }}
          onClose={() => setIsTopicModalOpen(false)}
        />
      )}

      {isCreator && !isConfig ? (
        <Button
          aria-label="Paramètres"
          colorScheme="green"
          leftIcon={<SettingsIcon boxSize={6} data-cy="orgSettings" />}
          onClick={() => setIsConfig(true)}
          mb={2}
        >
          Paramètres {org.orgType === OrgTypes.ASSO ? "de l'" : "du"}
          {OrgTypesV[org.orgType].toLowerCase()}
        </Button>
      ) : isConfig ? (
        <IconButton
          aria-label="Précédent"
          icon={<ChevronLeftIcon boxSize={6} />}
          onClick={() => setIsConfig(false)}
          mb={2}
        />
      ) : null}

      {!isCreator && (
        <SubscriptionPopover
          org={org}
          onSubmit={() => {
            toast({
              title: `Vous êtes maintenant abonné à ${org.orgName}`,
              status: "success",
              duration: 9000,
              isClosable: true
            });
            //orgQuery.refetch();
            setIsFollowed(true);
          }}
          isDisabled={isFollowed}
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
            href={`/${encodeURIComponent(org.createdBy.userName)}`}
          >
            @{org.createdBy.userName}
          </Link>{" "}
          {isCreator && "(Vous)"}
        </Text>
      </Box>

      {!isConfig && (
        <Grid
          templateColumns={`${
            // session ? "minmax(325px, 1fr) minmax(325px, 1fr)" : "1fr"
            "1fr"
          }`}
          gridGap={5}
          css={css`
            @media (max-width: 730px) {
              & {
                grid-template-columns: 1fr;
              }
            }
          `}
        >
          <GridItem>
            <Grid templateRows="auto 1fr">
              <GridHeader borderTopRadius="lg" alignItems="center">
                <Heading size="sm" py={3}>
                  Description{" "}
                  {org.orgType === OrgTypes.ASSO
                    ? "de l'association"
                    : "du groupe"}
                </Heading>
              </GridHeader>

              <GridItem light={{ bg: "orange.100" }} dark={{ bg: "gray.500" }}>
                <Box p={5}>
                  {org.orgDescription ? (
                    parse(org.orgDescription)
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
          </GridItem>

          <GridItem
            css={css`
              @media (max-width: 730px) {
                & {
                  grid-column: 1;
                }
              }
            `}
          >
            <GridHeader
              borderTopRadius="lg"
              alignItems="center"
              onClick={() => {}}
            >
              <Grid templateColumns="1fr auto" alignItems="center">
                <GridItem
                  css={css`
                    @media (max-width: 730px) {
                      & {
                        padding-top: 12px;
                        padding-bottom: 12px;
                      }
                    }
                  `}
                >
                  <Heading size="sm">Discussions</Heading>
                </GridItem>
                <GridItem
                  css={css`
                    @media (max-width: 730px) {
                      & {
                        grid-column: 1;
                        padding-bottom: 12px;
                      }
                    }
                  `}
                >
                  <Button
                    colorScheme="teal"
                    leftIcon={<AddIcon />}
                    onClick={() => {
                      if (!isSessionLoading) {
                        if (session) {
                          setIsTopicModalOpen(true);
                        } else {
                          setIsLogin(isLogin + 1);
                        }
                      }
                    }}
                    m={1}
                  >
                    Ajouter un sujet de discussion
                  </Button>
                </GridItem>
              </Grid>
            </GridHeader>

            <GridItem light={{ bg: "orange.100" }} dark={{ bg: "gray.500" }}>
              <TopicsList
                org={org}
                query={orgQuery}
                isCreator={isCreator}
                isFollowed={isFollowed}
                isSubscribed={isSubscribed}
                onLoginClick={() => setIsLogin(isLogin + 1)}
              />
            </GridItem>
          </GridItem>

          <GridItem
            css={css`
              @media (max-width: 730px) {
                & {
                  grid-column: 1;
                }
              }
            `}
          >
            {Array.isArray(org.orgEvents) && org.orgEvents.length > 0 ? (
              <EventsList
                eventHeader={
                  <OrgEventHeader
                    org={org}
                    isCreator={isCreator}
                    isLogin={isLogin}
                    setIsLogin={setIsLogin}
                  />
                }
                events={org.orgEvents}
                eventBg={eventBg}
              />
            ) : (
              <GridHeader borderTopRadius="lg" alignItems="center">
                {
                  <OrgEventHeader
                    org={org}
                    isCreator={isCreator}
                    isLogin={isLogin}
                    setIsLogin={setIsLogin}
                  />
                }
              </GridHeader>
            )}
          </GridItem>
        </Grid>
      )}

      {isConfig && (
        <OrgConfigPanel
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
