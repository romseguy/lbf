import { AddIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  GridProps,
  Spinner,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useSession } from "hooks/useAuth";
import { Button, Grid } from "features/common";
import { ModalState, NotifyModal } from "features/modals/NotifyModal";
import { TopicModal } from "features/modals/TopicModal";
import {
  useAddSubscriptionMutation,
  useDeleteSubscriptionMutation
} from "features/subscriptions/subscriptionsApi";
import { IEvent } from "models/Event";
import { IOrg, IOrgList } from "models/Org";
import { ITopic, Visibility } from "models/Topic";
import { useDeleteTopicMutation, usePostTopicNotifMutation } from "./topicsApi";
import { TopicsListItem } from "./TopicsListItem";
import { hasItems } from "utils/array";
import { TopicsListOrgLists } from "./TopicsListOrgLists";
import { TopicsListCategories } from "./TopicsListCategories";

export const TopicsList = ({
  event,
  org,
  query,
  mutation,
  subQuery,
  isLogin,
  setIsLogin,
  ...props
}: GridProps & {
  event?: IEvent;
  org?: IOrg;
  query: any;
  mutation: any;
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>();
  const [selectedLists, setSelectedLists] = useState<IOrgList[]>();
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

  let counter = false;
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
          query={query}
          mutation={mutation}
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

      {session && (
        <NotifyModal
          event={event}
          org={org}
          query={query}
          mutation={postTopicNotifMutation}
          setModalState={setNotifyModalState}
          modalState={notifyModalState}
          session={session}
        />
      )}

      {org && org.orgTopicsCategories && (
        <TopicsListCategories
          org={org}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          mb={3}
        />
      )}

      {session &&
        org &&
        org.orgName !== "aucourant" &&
        (props.isSubscribed || props.isCreator) && (
          <TopicsListOrgLists
            org={org}
            selectedLists={selectedLists}
            setSelectedLists={setSelectedLists}
            mb={5}
          />
        )}

      <Grid data-cy="topicList">
        {query.isLoading ? (
          <Spinner />
        ) : !topics.length ? (
          <Alert status="info">
            <AlertIcon /> Aucune discussion.
          </Alert>
        ) : (
          topics
            .filter((topic) => {
              if (entityName === "aucourant") return true;

              if (hasItems(selectedCategories) || hasItems(selectedLists)) {
                let belongsToCategory = false;
                let belongsToList = false;

                if (
                  Array.isArray(selectedCategories) &&
                  selectedCategories.length > 0
                ) {
                  if (
                    topic.topicCategory &&
                    selectedCategories.find(
                      (selectedCategory) =>
                        selectedCategory === topic.topicCategory
                    )
                  )
                    belongsToCategory = true;
                }

                if (Array.isArray(selectedLists) && selectedLists.length > 0) {
                  if (
                    Array.isArray(topic.topicVisibility) &&
                    topic.topicVisibility.length > 0
                  ) {
                    let found = false;

                    for (let i = 0; i < topic.topicVisibility.length; i++)
                      for (let j = 0; j < selectedLists.length; j++)
                        if (
                          selectedLists[j].listName === topic.topicVisibility[i]
                        )
                          found = true;

                    if (found) belongsToList = true;
                  }
                }

                return belongsToCategory || belongsToList;
              }

              if (props.isCreator) return true;

              if (
                props.isSubscribed &&
                topic.topicVisibility?.includes("Adhérents")
              )
                return true;

              if (
                props.isFollowed &&
                topic.topicVisibility?.includes("Abonnés")
              )
                return true;

              return false;
            })
            .map((topic, topicIndex) => {
              const isCurrent = topic._id === currentTopic?._id;
              const topicCreatedBy =
                typeof topic.createdBy === "object"
                  ? topic.createdBy._id
                  : topic.createdBy;
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
                <TopicsListItem
                  key={topic._id}
                  session={session}
                  event={event}
                  org={org}
                  query={query}
                  isSubscribed={props.isSubscribed || false}
                  topic={topic}
                  topicIndex={topicIndex}
                  isSubbedToTopic={isSubbedToTopic}
                  isCurrent={isCurrent}
                  isCreator={isCreator}
                  isDark={isDark}
                  isLoading={isLoading[topic._id!] || query.isLoading}
                  notifyModalState={notifyModalState}
                  setNotifyModalState={setNotifyModalState}
                  onClick={() => setCurrentTopic(isCurrent ? null : topic)}
                  onEditClick={() =>
                    setTopicModalState({
                      ...topicModalState,
                      isOpen: true,
                      entity: topic
                    })
                  }
                  onDeleteClick={async () => {
                    setIsLoading({
                      [topic._id!]: true
                    });

                    try {
                      let deletedTopic: ITopic | null = null;

                      if (topic._id) {
                        deletedTopic = await deleteTopic(topic._id).unwrap();
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
                        title: error.data ? error.data.message : error.message,
                        status: "error",
                        isClosable: true
                      });
                    } finally {
                      setIsLoading({
                        [topic._id!]: false
                      });
                    }
                  }}
                  onSubscribeClick={async () => {
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
                        title: `Vous êtes abonné à la discussion ${topic.topicName}`,
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
                          title: `Vous êtes désabonné de ${topic.topicName}`,
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
                  onLoginClick={() => setIsLogin(isLogin + 1)}
                />
              );
            })
        )}
      </Grid>
    </>
  );
};
