import { AddIcon, EditIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  GridProps,
  IconButton,
  Spinner,
  Text,
  Tooltip,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaBell, FaBellSlash } from "react-icons/fa";
import { useSession } from "hooks/useAuth";
import {
  Button,
  DeleteButton,
  formats,
  Grid,
  GridItem,
  Link
} from "features/common";
import { TopicMessageForm } from "features/forms/TopicMessageForm";
import { ModalState, NotifyModal } from "features/modals/NotifyModal";
import { TopicModal } from "features/modals/TopicModal";
import {
  useAddSubscriptionMutation,
  useDeleteSubscriptionMutation
} from "features/subscriptions/subscriptionsApi";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { ITopic, Visibility } from "models/Topic";
import * as dateUtils from "utils/date";
import { TopicMessagesList } from "./TopicMessagesList";
import { useDeleteTopicMutation, usePostTopicNotifMutation } from "./topicsApi";
import { TopicsListItemVisibility } from "./TopicsListItemVisibility";

export const TopicsList = ({
  event,
  org,
  query,
  subQuery,
  isLogin,
  setIsLogin,
  ...props
}: GridProps & {
  event?: IEvent;
  org?: IOrg;
  query: any;
  subQuery: any;
  isCreator?: boolean;
  isFollowed?: boolean;
  isSubscribed?: boolean;
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { data: session, loading: isSessionLoading } = useSession();
  const toast = useToast({ position: "top" });

  //#region subscription
  const [deleteSubscription, deleteSubscriptionMutation] =
    useDeleteSubscriptionMutation();
  const [addSubscription, addSubscriptionMutation] =
    useAddSubscriptionMutation();
  //#endregion

  //#region topic
  const postTopicNotifMutation = usePostTopicNotifMutation();
  const [deleteTopic, deleteTopicMutation] = useDeleteTopicMutation();
  //#endregion

  //#region local state
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [topicModalState, setTopicModalState] = useState<{
    isOpen: boolean;
    entity: ITopic | null;
  }>({
    isOpen: false,
    entity: null
  });
  const [notifyModalState, setNotifyModalState] = useState<ModalState<ITopic>>({
    entity: null
  });
  const [currentTopic, setCurrentTopic] = useState<ITopic | null>(null);
  const entityName = org ? org.orgName : event?.eventName;
  let topics: ITopic[] = org ? org.orgTopics : event ? event.eventTopics : [];
  //#endregion

  return (
    <>
      <Button
        colorScheme="teal"
        leftIcon={<AddIcon />}
        mb={5}
        onClick={() => {
          if (!isSessionLoading) {
            if (session) {
              //setCurrentTopic(null);
              setTopicModalState({ ...topicModalState, isOpen: true });
            } else {
              setIsLogin(isLogin + 1);
            }
          }
        }}
        data-cy="addTopicForm"
      >
        Ajouter une discussion
      </Button>

      {topicModalState.isOpen && (
        <TopicModal
          topic={topicModalState.entity}
          org={org}
          event={event}
          isCreator={props.isCreator}
          isFollowed={props.isFollowed}
          isSubscribed={props.isSubscribed}
          onCancel={() =>
            setTopicModalState({
              ...topicModalState,
              isOpen: false,
              entity: null
            })
          }
          onSubmit={async (topic) => {
            query.refetch();
            subQuery.refetch();
            setTopicModalState({
              ...topicModalState,
              isOpen: false,
              entity: null
            });
            setCurrentTopic(topic ? topic : null);
          }}
          onClose={() =>
            setTopicModalState({
              ...topicModalState,
              isOpen: false,
              entity: null
            })
          }
        />
      )}

      <NotifyModal
        event={event}
        org={org}
        query={query}
        mutation={postTopicNotifMutation}
        setModalState={setNotifyModalState}
        modalState={notifyModalState}
      />

      <Grid data-cy="topicList">
        {query.isLoading ? (
          <Spinner />
        ) : (
          topics
            .filter((topic) => {
              if (entityName === "aucourant") return true;

              let allow = false;

              if (topic.topicVisibility === Visibility.PUBLIC) {
                allow = true;
              } else {
                if (props.isCreator) {
                  allow = true;
                }

                if (
                  props.isSubscribed &&
                  topic.topicVisibility === Visibility.SUBSCRIBERS
                ) {
                  allow = true;
                }

                if (
                  props.isFollowed &&
                  topic.topicVisibility === Visibility.FOLLOWERS
                ) {
                  allow = true;
                }
              }

              //console.log(topic.topicVisibility, allow);
              return allow;
            })
            .map((topic, topicIndex) => {
              const isCurrent = currentTopic && topic._id === currentTopic._id;
              const { timeAgo, fullDate } = dateUtils.timeAgo(
                topic.createdAt,
                true
              );
              const topicCreatedBy =
                typeof topic.createdBy === "object"
                  ? topic.createdBy._id
                  : topic.createdBy;
              const topicCreatedByUserName =
                typeof topic.createdBy === "object"
                  ? topic.createdBy.userName ||
                    topic.createdBy.email?.replace(/@.+/, "")
                  : "";
              const isCreator =
                session?.user.isAdmin ||
                topicCreatedBy === session?.user.userId;

              let isSubbedToTopic = false;

              if (subQuery.data) {
                isSubbedToTopic = !!subQuery.data.topics.find(
                  ({ topic: t }: { topic: ITopic }) => t._id === topic._id
                );
              }

              return (
                <Box key={topic._id} mb={5}>
                  <GridItem>
                    <Link
                      variant="no-underline"
                      onClick={() => setCurrentTopic(isCurrent ? null : topic)}
                      data-cy="topic"
                    >
                      <Grid
                        templateColumns="auto 1fr auto"
                        borderTopRadius="xl"
                        //borderBottomRadius="xl"
                        // borderTopRadius={topicIndex === 0 ? "lg" : undefined}
                        borderBottomRadius={!isCurrent ? "lg" : undefined}
                        light={{
                          bg:
                            topicIndex % 2 === 0 ? "orange.200" : "orange.100",
                          _hover: { bg: "orange.300" }
                        }}
                        dark={{
                          bg: topicIndex % 2 === 0 ? "gray.600" : "gray.500",
                          _hover: { bg: "gray.400" }
                        }}
                      >
                        <GridItem display="flex" alignItems="center" p={3}>
                          {currentTopic && isCurrent ? (
                            <ViewIcon boxSize={6} />
                          ) : (
                            <ViewOffIcon boxSize={6} />
                          )}
                        </GridItem>

                        <GridItem py={3}>
                          <Box lineHeight="1" data-cy="topicHeader">
                            <Text fontWeight="bold">{topic.topicName}</Text>
                            <Box
                              display="inline"
                              fontSize="smaller"
                              color={isDark ? "white" : "gray.600"}
                            >
                              {topicCreatedByUserName}
                              <span aria-hidden> · </span>
                              <Tooltip placement="bottom" label={fullDate}>
                                <span>{timeAgo}</span>
                              </Tooltip>
                              <span aria-hidden> · </span>
                              <TopicsListItemVisibility
                                topicVisibility={topic.topicVisibility}
                              />
                              {Array.isArray(topic.topicNotified) &&
                                isCreator &&
                                (props.isCreator || props.isSubscribed) && (
                                  <>
                                    <span aria-hidden> · </span>
                                    <Link
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setNotifyModalState({
                                          ...notifyModalState,
                                          entity: topic
                                        });
                                      }}
                                    >
                                      {topic.topicNotified.length} abonnés
                                      notifiés
                                    </Link>
                                  </>
                                )}
                            </Box>
                          </Box>
                        </GridItem>

                        {session && (
                          <GridItem display="flex" alignItems="center">
                            {isCreator && (
                              <>
                                <Tooltip
                                  placement="bottom"
                                  label="Modifier la discussion"
                                >
                                  <IconButton
                                    aria-label="Modifier la discussion"
                                    icon={<EditIcon />}
                                    bg="transparent"
                                    height="auto"
                                    minWidth={0}
                                    _hover={{ color: "green" }}
                                    onClick={(e) => {
                                      e.stopPropagation();

                                      setTopicModalState({
                                        ...topicModalState,
                                        isOpen: true,
                                        entity: topic
                                      });
                                    }}
                                  />
                                </Tooltip>

                                <Box aria-hidden mx={1}>
                                  ·{" "}
                                </Box>
                                <DeleteButton
                                  isIconOnly
                                  isLoading={
                                    isLoading[topic._id!] &&
                                    deleteTopicMutation.isLoading
                                  }
                                  placement="bottom"
                                  bg="transparent"
                                  height="auto"
                                  minWidth={0}
                                  _hover={{ color: "red" }}
                                  // isDisabled={isDeleteButtonDisabled}
                                  header={
                                    <>
                                      Êtes vous sûr de vouloir supprimer la
                                      discussion
                                      <Text
                                        display="inline"
                                        color="red"
                                        fontWeight="bold"
                                      >
                                        {` ${topic.topicName}`}
                                      </Text>{" "}
                                      ?
                                    </>
                                  }
                                  body={
                                    <>
                                      {/* <label htmlFor="topicName">
                                          Saisissez le nom de la discussion pour
                                          confimer sa suppression :
                                        </label>
                                        <Input
                                          id="topicName"
                                          autoComplete="off"
                                          onChange={(e) =>
                                            setIsDeleteButtonDisabled(
                                              e.target.value !==
                                                topic.topicName
                                            )
                                          }
                                        /> */}
                                    </>
                                  }
                                  onClick={async () => {
                                    setIsLoading({
                                      [topic._id!]: true
                                    });

                                    try {
                                      let deletedTopic: ITopic | null = null;

                                      if (topic._id) {
                                        deletedTopic = await deleteTopic(
                                          topic._id
                                        ).unwrap();
                                      }

                                      if (deletedTopic) {
                                        subQuery.refetch();
                                        query.refetch();

                                        toast({
                                          title: `${deletedTopic.topicName} a bien été supprimé !`,
                                          status: "success",
                                          isClosable: true
                                        });
                                      }
                                    } catch (error: any) {
                                      toast({
                                        title: error.data
                                          ? error.data.message
                                          : error.message,
                                        status: "error",
                                        isClosable: true
                                      });
                                    } finally {
                                      setIsLoading({
                                        [topic._id!]: false
                                      });
                                    }
                                  }}
                                  data-cy="deleteTopic"
                                />

                                <Box aria-hidden mx={1}>
                                  ·
                                </Box>
                              </>
                            )}

                            <Tooltip
                              label={
                                isSubbedToTopic
                                  ? "Vous recevez un e-mail lorsque quelqu'un répond à cette discussion. Cliquez ici pour désactiver ces notifications."
                                  : "Recevoir un e-mail et une notification lorsque quelqu'un répond à cette discussion."
                              }
                              placement="left"
                            >
                              <span>
                                <IconButton
                                  aria-label={
                                    isSubbedToTopic
                                      ? "Se désabonner de la discussion"
                                      : "S'abonner à la discussion"
                                  }
                                  icon={
                                    isSubbedToTopic ? (
                                      <FaBellSlash />
                                    ) : (
                                      <FaBell />
                                    )
                                  }
                                  isLoading={
                                    isLoading[topic._id!] &&
                                    (addSubscriptionMutation.isLoading ||
                                      deleteSubscriptionMutation.isLoading)
                                  }
                                  bg="transparent"
                                  height="auto"
                                  minWidth={0}
                                  mr={3}
                                  _hover={{
                                    color: isDark ? "lightgreen" : "white"
                                  }}
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    setIsLoading({
                                      [topic._id!]: true
                                    });

                                    if (!subQuery.data || !isSubbedToTopic) {
                                      await addSubscription({
                                        payload: {
                                          topics: [
                                            {
                                              topic: topic,
                                              emailNotif: true,
                                              pushNotif: true
                                            }
                                          ]
                                        },
                                        user: session?.user.userId
                                      });

                                      toast({
                                        title: `Vous avez été abonné à la discussion ${topic.topicName}`,
                                        status: "success",
                                        isClosable: true
                                      });
                                    } else if (isSubbedToTopic) {
                                      const unsubscribe = confirm(
                                        `Êtes vous sûr de vouloir vous désabonner de la discussion : ${topic.topicName} ?`
                                      );

                                      if (unsubscribe) {
                                        await deleteSubscription({
                                          subscriptionId: subQuery.data._id,
                                          topicId: topic._id
                                        });

                                        toast({
                                          title: `Vous avez été désabonné de ${topic.topicName}`,
                                          status: "success",
                                          isClosable: true
                                        });
                                      }
                                    }

                                    subQuery.refetch();
                                    setIsLoading({
                                      [topic._id!]: false
                                    });
                                  }}
                                  data-cy={
                                    isSubbedToTopic
                                      ? "topicUnsubscribe"
                                      : "topicSubscribe"
                                  }
                                />
                              </span>
                            </Tooltip>
                          </GridItem>
                        )}
                      </Grid>
                    </Link>
                    {isCurrent && (
                      <>
                        <GridItem
                          light={{ bg: "orange.50" }}
                          dark={{ bg: "gray.700" }}
                        >
                          <TopicMessagesList query={query} topic={topic} />
                        </GridItem>

                        <GridItem
                          light={{ bg: "orange.50" }}
                          dark={{ bg: "gray.700" }}
                          pb={3}
                          borderBottomRadius="xl"
                        >
                          {/* <Text p={3}>Écrivez une réponse ci-dessous :</Text> */}
                          <TopicMessageForm
                            event={event}
                            org={org}
                            topic={topic}
                            formats={formats.filter((f) => f !== "size")}
                            onLoginClick={() => setIsLogin(isLogin + 1)}
                            onSubmit={() => query.refetch()}
                          />
                          {/* {topicIndex !== topicsCount - 1 && (
                            <Spacer mt={3} borderWidth={1} />
                          )} */}
                        </GridItem>
                      </>
                    )}
                  </GridItem>
                </Box>
              );
            })
        )}
      </Grid>
    </>
  );
};
