import { BoxProps, Button, Box, Flex, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { TopicMessageForm } from "features/forms/TopicMessageForm";
import { useScroll } from "hooks/useScroll";
import { getCategoryLabel, IEntity, isEvent, isOrg } from "models/Entity";
import { ITopic, isEdit } from "models/Topic";
import { Session } from "utils/auth";
import * as dateUtils from "utils/date";
import { ServerError } from "utils/errors";
import { normalize } from "utils/string";
import { AppQuery, AppQueryWithData } from "utils/types";
import { TopicMessagesList } from "./TopicMessagesList";
import {
  useAddSubscriptionMutation,
  useDeleteSubscriptionMutation
} from "features/api/subscriptionsApi";
import {
  useEditTopicMutation,
  useDeleteTopicMutation
} from "features/api/topicsApi";
import { ISubscription } from "models/Subscription";
import { TopicModalState } from "./TopicsList";
import {
  TopicsListItemHeaderDetails,
  TopicsListItemHeaderTable
} from "./TopicsListItemHeader";
import { TopicsListItemHeaderButtons } from "./TopicsListItemHeaderButtons";

interface TopicsListItemProps {
  isMobile: boolean;
  session: Session | null;
  currentTopicName?: string;
  isCreator: boolean;
  isSubbedToTopic: boolean;
  isCurrent: boolean;
  isTopicCreator: boolean;
  isDark: boolean;
  query: AppQueryWithData<IEntity>;
  subQuery: AppQuery<ISubscription>;
  //isLoading: boolean;
  //setIsLoading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  selectedCategories?: string[];
  setSelectedCategories: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >;
  topic: ITopic;
  topicIndex: number;
  // notifyModalState: NotifModalState<ITopic>;
  // setNotifyModalState: React.Dispatch<
  //   React.SetStateAction<NotifModalState<ITopic>>
  // >;
  topicModalState: TopicModalState;
  setTopicModalState: React.Dispatch<React.SetStateAction<TopicModalState>>;
  // onClick: (topic: ITopic, isCurrent: boolean) => void;
  // onDeleteClick: (topic: ITopic, isCurrent: boolean) => void;
  // onEditClick: (topic: ITopic) => void;
  // onNotifClick: (topic: ITopic) => void;
  // onSubscribeClick: (topic: ITopic, isSubbedToTopic: boolean) => void;
}

export const TopicsListItem = ({
  isMobile,
  session,
  currentTopicName,
  isCreator,
  isCurrent,
  isDark,
  isSubbedToTopic,
  isTopicCreator,
  query,
  subQuery,
  //isLoading,
  //setIsLoading,
  selectedCategories,
  setSelectedCategories,
  topic,
  topicIndex,
  //notifyModalState,
  //setNotifyModalState,
  topicModalState,
  setTopicModalState,
  // onClick,
  // onDeleteClick,
  // onEditClick,
  // onNotifClick,
  // onSubscribeClick,
  ...props
}: Omit<BoxProps, "onClick"> & TopicsListItemProps) => {
  const router = useRouter();
  const toast = useToast({ position: "top" });
  const [executeScroll, elementToScrollRef] = useScroll<HTMLDivElement>();
  const [addSubscription] = useAddSubscriptionMutation();
  const [deleteSubscription] = useDeleteSubscriptionMutation();
  const [editTopic, editTopicMutation] = useEditTopicMutation();
  const [deleteTopic] = useDeleteTopicMutation();

  //#region entity
  const entity = query.data;
  const isE = isEvent(entity);
  const isO = isOrg(entity);
  const baseUrl = `/${
    isE
      ? entity.eventUrl
      : isO
      ? topic.event
        ? topic.event.eventUrl
        : entity.orgUrl
      : entity._id
  }/discussions`;
  const topicCategories = isE
    ? entity.eventTopicCategories
    : isO
    ? entity.orgTopicCategories
    : [];
  //#endregion

  //#region topic
  const hasCategorySelected = !!selectedCategories?.find(
    (category) => category === topic.topicCategory
  );
  const { timeAgo, fullDate } = dateUtils.timeAgo(topic.createdAt, true);
  const topicCategoryLabel =
    typeof topic.topicCategory === "string"
      ? getCategoryLabel(topicCategories, topic.topicCategory)
      : "";
  const topicCreatedByUserName =
    typeof topic.createdBy === "object"
      ? topic.createdBy.userName || topic.createdBy.email?.replace(/@.+/, "")
      : "";
  // const s =
  //   !topic.topicNotifications.length || topic.topicNotifications.length > 1
  //     ? "s"
  //     : "";
  //#endregion

  //#region local
  const [isAnswering, setIsAnswering] = useState(false);
  const [isEdit, setIsEdit] = useState<isEdit>({});
  const isEditing = Object.keys(isEdit).reduce(
    (acc, key) => (isEdit[key] && isEdit[key].isOpen ? ++acc : acc),
    0
  );
  const [isHover, setIsHover] = useState(false);
  const [_isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const isLoading = _isLoading[topic._id];
  //#endregion

  //#region handlers
  const onClick = async () => {
    if (!isCurrent) {
      //const url = `${baseUrl}/${normalize(topic.topicName)}`;
      let url = baseUrl;
      url += isO && topic.event ? "" : `/${normalize(topic.topicName)}`;

      await router.push(url, url, { shallow: true });
      executeScroll();
    } else {
      const url = baseUrl;
      await router.push(url, url, { shallow: true });
    }
  };
  const onDeleteClick = async () => {
    try {
      setIsLoading({
        [topic._id]: true
      });
      const deletedTopic = await deleteTopic(topic._id).unwrap();
      toast({
        title: `${deletedTopic.topicName} a été supprimé !`,
        status: "success"
      });
      router.push(baseUrl, baseUrl, { shallow: true });
    } catch (error: ServerError | any) {
      toast({
        title:
          error.data.message ||
          `La discussion ${topic.topicName} n'a pas pu être supprimée`,
        status: "error"
      });
    } finally {
      setIsLoading({
        [topic._id]: false
      });
    }
  };
  const onEditClick = () => {
    setTopicModalState({
      ...topicModalState,
      isOpen: true,
      topic
    });
  };
  // const onNotifClick = () => {
  //   setNotifyModalState({
  //     ...notifyModalState,
  //     entity: topic
  //   });
  // };
  const onSubscribeClick = async () => {
    if (!subQuery.data || !isSubbedToTopic) {
      try {
        setIsLoading({
          [topic._id]: true
        });
        await addSubscription({
          topics: [
            {
              topic: topic,
              emailNotif: true,
              pushNotif: true
            }
          ],
          user: session?.user.userId
        });
        toast({
          title: `Vous êtes abonné à la discussion ${topic.topicName}`,
          status: "success"
        });
      } catch (error) {
        console.error(error);
        toast({
          title: `Vous n'avez pas pu être abonné à la discussion ${topic.topicName}`,
          status: "error"
        });
      } finally {
        setIsLoading({
          [topic._id]: false
        });
      }
    } else if (isSubbedToTopic) {
      const unsubscribe = confirm(
        `Êtes vous sûr de vouloir vous désabonner de la discussion : ${topic.topicName} ?`
      );

      if (unsubscribe) {
        try {
          setIsLoading({
            [topic._id]: true
          });
          await deleteSubscription({
            subscriptionId: subQuery.data._id,
            topicId: topic._id
          });
          toast({
            title: `Vous êtes désabonné de ${topic.topicName}`,
            status: "success"
          });
        } catch (error) {
          console.error(error);
          toast({
            title: `Vous n'avez pas pu être désabonné à la discussion ${topic.topicName}`,
            status: "error"
          });
        } finally {
          setIsLoading({
            [topic._id]: false
          });
        }
      }
    }
  };
  //#endregion

  useEffect(() => {
    if (isCurrent) {
      executeScroll();
    }
  }, []);

  return (
    <Box ref={elementToScrollRef} {...props}>
      {/*Header */}
      <Flex
        alignItems={isMobile ? "flex-start" : "center"}
        flexDir={isMobile ? "column" : "row"}
        borderTopRadius="xl"
        borderBottomRadius={!isCurrent ? "lg" : undefined}
        bg={
          topicIndex % 2 === 0
            ? isDark
              ? "gray.600"
              : "orange.200"
            : isDark
            ? "gray.500"
            : "orange.100"
        }
        cursor="pointer"
        py={1}
        _hover={{ bg: isDark ? "#314356" : "orange.300" }}
        onClick={onClick}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <Flex
          flexDirection="column"
          flexGrow={1}
          //px={2}
          ml={2}
        >
          {/* Table */}
          <TopicsListItemHeaderTable
            query={query}
            topic={topic}
            isCurrent={isCurrent}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            isDark={isDark}
          />

          {/* Details */}
          <TopicsListItemHeaderDetails
            query={query}
            topic={topic}
            isDark={isDark}
          />
        </Flex>

        <TopicsListItemHeaderButtons
          query={query}
          subQuery={subQuery}
          topic={topic}
          executeScroll={executeScroll}
          isCreator={isCreator}
          isCurrent={isCurrent}
          isSubbedToTopic={isSubbedToTopic}
          isTopicCreator={isTopicCreator}
          topicModalState={topicModalState}
          setTopicModalState={setTopicModalState}
        />
      </Flex>

      {isCurrent && (
        <Box bg={isDark ? "#314356" : "orange.50"}>
          {/*
          <GridItem px={3} py={2} data-cy="topic-subscribers">
            <TopicsListItemSubscribers
              topic={topic}
              isSubbedToTopic={isSubbedToTopic}
            />
          </GridItem>
          */}

          <TopicMessagesList
            isEdit={isEdit}
            query={query}
            setIsEdit={setIsEdit}
            topic={topic}
            px={3}
            pb={3}
          />

          {!isEditing && (
            <>
              <Box
                borderBottomRadius="xl"
                p={3}
                pt={0}
                {...(isAnswering
                  ? {}
                  : {
                      display: "flex",
                      justifyContent: "flex-end"
                    })}
              >
                {!isAnswering && (
                  <>
                    {session ? (
                      <Button
                        colorScheme="teal"
                        onClick={() => {
                          setIsAnswering(true);
                        }}
                      >
                        Ajouter un message
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => {
                          router.push("/login", "/login", { shallow: true });
                        }}
                      >
                        Se connecter pour ajouter un message
                      </Button>
                    )}
                  </>
                )}

                {isAnswering && (
                  <TopicMessageForm
                    //formats={formats.filter((f) => f !== "size")}
                    isDisabled={topic.topicMessagesDisabled}
                    isLoading={isLoading}
                    query={query}
                    setIsLoading={(bool) => {
                      setIsLoading({ [topic._id]: bool });
                    }}
                    topic={topic}
                    onSubmit={() => {
                      setIsAnswering(false);
                    }}
                  />
                )}
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

TopicsListItem.whyDidYouRender = false;
