import type { IEvent } from "models/Event";
import type { IOrg } from "models/Org";
import type { ISubscription } from "models/Subscription";
import type { ITopic } from "models/Topic";
import { Visibility } from "models/Topic";
import React, { useEffect, useState } from "react";
import {
  BellIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EmailIcon,
  LockIcon,
  ViewIcon
} from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";
import {
  GridProps,
  Icon,
  Spinner,
  Text,
  Tooltip,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { Grid, GridItem, IconFooter, Link, Spacer } from "features/common";
import { TopicMessageForm } from "features/forms/TopicMessageForm";
import { TopicMessagesList } from "./TopicMessagesList";
import { AddIcon } from "@chakra-ui/icons";
import { Button } from "features/common";
import { TopicModal } from "features/modals/TopicModal";
import { useSession } from "hooks/useAuth";
import { FaBell, FaBellSlash, FaGlobeEurope } from "react-icons/fa";
import * as dateUtils from "utils/date";
import {
  useAddSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useGetSubscriptionQuery
} from "features/subscriptions/subscriptionsApi";
import { useSelector } from "react-redux";
import { selectSubscriptionRefetch } from "features/subscriptions/subscriptionSlice";

// https://github.com/chakra-ui/chakra-ui/issues/2869
const TopicVisibility = ({ topicVisibility }: { topicVisibility?: string }) =>
  topicVisibility === Visibility.SUBSCRIBERS ? (
    <Tooltip label="Discussion réservée aux adhérents">
      <LockIcon boxSize={4} />
    </Tooltip>
  ) : topicVisibility === Visibility.FOLLOWERS ? (
    <Tooltip label="Discussion réservée aux abonnés">
      <EmailIcon boxSize={4} />
    </Tooltip>
  ) : topicVisibility === Visibility.PUBLIC ? (
    <Tooltip label="Discussion visible par tous">
      <span>
        <Icon as={FaGlobeEurope} boxSize={4} />
      </span>
    </Tooltip>
  ) : null;

export const TopicsList = ({
  event,
  org,
  query,
  isCreator,
  isFollowed,
  isSubscribed,
  isLogin,
  setIsLogin,
  ...props
}: GridProps & {
  event?: IEvent;
  org?: IOrg;
  query: any;
  isCreator?: boolean;
  isFollowed?: boolean;
  isSubscribed?: boolean;
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { data: session, loading: isSessionLoading } = useSession();

  const subQuery = useGetSubscriptionQuery(session?.user.userId);
  const subscriptionRefetch = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    console.log("refetching subscription");
    subQuery.refetch();
  }, [subscriptionRefetch]);
  const [deleteSubscription, deleteSubscriptionMutation] =
    useDeleteSubscriptionMutation();
  const [addSubscription, addSubscriptionMutation] =
    useAddSubscriptionMutation();

  let entity: IEvent | IOrg | undefined = org || event;
  const entityName: string = org?.orgName || event?.eventName || "";
  let entityTopics: ITopic[] = org?.orgTopics || event?.eventTopics || [];

  const topicsCount = Array.isArray(entityTopics) ? entityTopics.length : 0;

  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [topic, setTopic] = useState<ITopic | null>(null);
  const toast = useToast({ position: "top" });

  return (
    <>
      <Button
        colorScheme="teal"
        leftIcon={<AddIcon />}
        onClick={() => {
          if (!isSessionLoading) {
            if (session) {
              //setTopic(null);
              setIsTopicModalOpen(true);
            } else {
              setIsLogin(isLogin + 1);
            }
          }
        }}
        mb={5}
      >
        Ajouter une discussion
      </Button>

      {isTopicModalOpen && entity && (
        <TopicModal
          org={org}
          event={event}
          isCreator={isCreator}
          isFollowed={isFollowed}
          isSubscribed={isSubscribed}
          onCancel={() => setIsTopicModalOpen(false)}
          onSubmit={async (topicName) => {
            query.refetch();
            subQuery.refetch();
            setIsTopicModalOpen(false);
          }}
          onClose={() => setIsTopicModalOpen(false)}
        />
      )}

      <Grid {...props}>
        <GridItem>
          {entity && topicsCount > 0 ? (
            <>
              {/* <Spacer borderWidth={1} /> */}
              {entityTopics
                .filter((entityTopic) => {
                  if (entityName === "aucourant") return true;

                  let allow = false;

                  if (entityTopic.topicVisibility === Visibility.PUBLIC) {
                    allow = true;
                  } else {
                    if (isCreator) {
                      allow = true;
                    }

                    if (
                      isSubscribed &&
                      entityTopic.topicVisibility === Visibility.SUBSCRIBERS
                    ) {
                      allow = true;
                    }

                    if (
                      isFollowed &&
                      entityTopic.topicVisibility === Visibility.FOLLOWERS
                    ) {
                      allow = true;
                    }
                  }

                  //console.log(entityTopic.topicVisibility, allow);
                  return allow;
                })
                .map((entityTopic, topicIndex) => {
                  const isCurrent =
                    topic && entityTopic.topicName === topic.topicName;
                  const { timeAgo, fullDate } = dateUtils.timeAgo(
                    entityTopic.createdAt,
                    true
                  );
                  const entityTopicCreatedByUsername =
                    typeof entityTopic.createdBy === "object"
                      ? entityTopic.createdBy.userName
                      : "";

                  let isSubbedToTopic = false;

                  if (subQuery.data) {
                    isSubbedToTopic = !!subQuery.data.topics.find(
                      ({ topic }) => topic._id === entityTopic._id
                    );
                  }

                  return (
                    <Box key={entityTopic._id}>
                      <Grid
                        templateColumns="auto 1fr auto"
                        cursor="pointer"
                        light={{
                          borderTopRadius: topicIndex === 0 ? "lg" : undefined,
                          borderBottomRadius:
                            topicIndex === topicsCount - 1 && !isCurrent
                              ? "lg"
                              : undefined,
                          bg:
                            topicIndex % 2 === 0 ? "orange.300" : "orange.100",
                          _hover: { bg: "red" }
                        }}
                        dark={{
                          borderTopRadius: topicIndex === 0 ? "lg" : undefined,
                          borderBottomRadius:
                            topicIndex === topicsCount - 1 && !isCurrent
                              ? "lg"
                              : undefined,
                          bg: topicIndex % 2 === 0 ? "gray.600" : "gray.500",
                          _hover: { bg: "gray.400" }
                        }}
                        onClick={() => setTopic(isCurrent ? null : entityTopic)}
                      >
                        <GridItem p={3}>
                          {topic && isCurrent ? (
                            <ChevronDownIcon boxSize={6} />
                          ) : (
                            <ChevronRightIcon boxSize={6} />
                          )}
                        </GridItem>
                        <GridItem py={3}>
                          {/* <Box
                        px={3}
                        _hover={{
                          bg: isDark ? "gray.800" : "orange.200"
                        }}
                      > */}
                          <Box lineHeight="1">
                            <Text fontWeight="bold">
                              {entityTopic.topicName}
                            </Text>
                            <Box
                              display="inline"
                              fontSize="smaller"
                              color={isDark ? "white" : "gray.600"}
                            >
                              <Link
                                href={`/${encodeURIComponent(
                                  entityTopicCreatedByUsername
                                )}`}
                              >
                                {entityTopicCreatedByUsername}
                              </Link>
                              <span aria-hidden="true"> · </span>
                              <Tooltip placement="bottom" label={fullDate}>
                                {timeAgo}
                              </Tooltip>
                              <span aria-hidden="true"> · </span>
                              <TopicVisibility
                                topicVisibility={entityTopic.topicVisibility}
                              />
                            </Box>
                          </Box>
                          {/* </Box> */}
                        </GridItem>
                        {session && (
                          <GridItem>
                            <Box pr={3} pt={3}>
                              {subQuery.isLoading ||
                              addSubscriptionMutation.isLoading ||
                              deleteSubscriptionMutation.isLoading ? (
                                <Spinner boxSize={4} />
                              ) : (
                                <Tooltip
                                  label={
                                    isSubbedToTopic
                                      ? "Vous recevez un e-mail lorsque quelqu'un répond à cette discussion. Cliquez ici pour désactiver ces notifications."
                                      : "Recevoir un e-mail lorsque quelqu'un répond à cette discussion."
                                  }
                                  placement="left"
                                >
                                  <span>
                                    <Icon
                                      as={
                                        isSubbedToTopic ? FaBellSlash : FaBell
                                      }
                                      onClick={async (e) => {
                                        e.stopPropagation();

                                        if (!subQuery.data) {
                                          console.log("user got no sub");
                                          await addSubscription({
                                            payload: {
                                              topics: [{ topic: entityTopic }]
                                            },
                                            user: session.user.userId
                                            // email:
                                          });
                                          toast({
                                            title: `Vous avez été abonné à ${entityTopic.topicName}`,
                                            status: "success",
                                            isClosable: true
                                          });
                                        } else if (isSubbedToTopic) {
                                          const unsubscribe = confirm(
                                            `Êtes vous sûr(e) de vouloir vous désabonner de la discussion : ${entityTopic.topicName} ?`
                                          );

                                          if (unsubscribe) {
                                            await deleteSubscription({
                                              subscriptionId: subQuery.data._id,
                                              topicId: entityTopic._id
                                            });

                                            toast({
                                              title: `Vous avez été désabonné de ${entityTopic.topicName}`,
                                              status: "success",
                                              isClosable: true
                                            });
                                          }
                                        } else {
                                          console.log("user got no topic sub");
                                          await addSubscription({
                                            payload: {
                                              topics: [{ topic: entityTopic }]
                                            },
                                            user: session.user?.userId
                                            // email:
                                          });
                                          toast({
                                            title: `Vous avez été abonné à ${entityTopic.topicName}`,
                                            status: "success",
                                            isClosable: true
                                          });
                                        }

                                        subQuery.refetch();
                                      }}
                                      _hover={{
                                        color: isDark ? "lightgreen" : "white"
                                      }}
                                    />
                                  </span>
                                </Tooltip>
                              )}
                            </Box>
                          </GridItem>
                        )}
                      </Grid>

                      {/* <Spacer borderWidth={1} /> */}

                      {isCurrent && (
                        <>
                          <GridItem
                            light={{ bg: "orange.100" }}
                            dark={{ bg: "gray.700" }}
                          >
                            <TopicMessagesList
                              topicMessages={entityTopic.topicMessages}
                            />
                          </GridItem>

                          <GridItem
                            light={{ bg: "white" }}
                            dark={{ bg: "gray.700" }}
                            pb={3}
                          >
                            {/* <Text p={3}>Écrivez une réponse ci-dessous :</Text> */}
                            <TopicMessageForm
                              event={event}
                              org={org}
                              topic={entityTopic}
                              onLoginClick={() => setIsLogin(isLogin + 1)}
                              onSubmit={() => query.refetch()}
                            />
                            {/* {topicIndex !== topicsCount - 1 && (
                            <Spacer mt={3} borderWidth={1} />
                          )} */}
                          </GridItem>
                        </>
                      )}
                    </Box>
                  );
                })}
            </>
          ) : query.isLoading ? (
            <Spinner m={3} />
          ) : null}
        </GridItem>
      </Grid>
    </>
  );
};
