import { ChevronRightIcon, ChevronUpIcon, EditIcon } from "@chakra-ui/icons";
import {
  BoxProps,
  IconButton,
  Tooltip,
  Flex,
  Spinner,
  Text,
  useToast,
  useColorMode
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaBellSlash, FaBell } from "react-icons/fa";
import {
  DeleteButton,
  EditIconButton,
  PushPinIcon,
  PushPinSlashIcon
} from "features/common";
import { IEntity, isEvent, isOrg } from "models/Entity";
import { ITopic } from "models/Topic";
import { ServerError } from "utils/errors";
import { normalize } from "utils/string";
import { AppQuery, AppQueryWithData } from "utils/types";
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
import { useSession } from "hooks/useSession";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";

interface TopicsListItemHeaderButtonsProps {
  executeScroll: () => void;
  isSubbedToTopic: boolean;
  isCreator: boolean;
  isCurrent: boolean;
  isTopicCreator: boolean;
  query: AppQueryWithData<IEntity>;
  subQuery: AppQuery<ISubscription>;
  topic: ITopic;
  topicModalState: TopicModalState;
  setTopicModalState: React.Dispatch<React.SetStateAction<TopicModalState>>;
}

export const TopicsListItemHeaderButtons = ({
  executeScroll,
  isCreator,
  isCurrent,
  isSubbedToTopic,
  isTopicCreator,
  query,
  subQuery,
  topic,
  topicModalState,
  setTopicModalState,
  ...props
}: Omit<BoxProps, "onClick"> & TopicsListItemHeaderButtonsProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const { data: session } = useSession();
  const toast = useToast({ position: "top" });
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
  //#endregion

  //#region local
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

  return (
    <Flex
      alignItems="center"
      // pt={3}
      // pb={2}
      ml={2}
      {...(isMobile ? { pb: 1, pt: 3 } : {})}
    >
      {isLoading && <Spinner mr={3} mt={1} mb={2} />}

      {!isLoading && session && (
        <>
          {isCreator && (
            <>
              {/* <Tooltip
                    placement="bottom"
                    label="Envoyer des invitations à la discussion"
                  >
                    <IconButton
                      aria-label="Envoyer des invitations à la discussion"
                      icon={<EmailIcon />}
                      variant="outline"
                      colorScheme="blue"
                      mr={3}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNotifClick();
                      }}
                    />
                  </Tooltip> */}

              <Tooltip placement="bottom" label="Épingler la discussion">
                <IconButton
                  aria-label="Épingler la discussion"
                  icon={topic.isPinned ? <PushPinSlashIcon /> : <PushPinIcon />}
                  variant="outline"
                  colorScheme="teal"
                  mr={3}
                  onClick={async (e) => {
                    e.stopPropagation();
                    setIsLoading({
                      [topic._id]: true
                    });
                    try {
                      await editTopic({
                        payload: { topic: { isPinned: !topic.isPinned } },
                        topicId: topic._id
                      }).unwrap();
                      query.refetch();
                    } catch (error: ServerError | any) {
                      toast({
                        title:
                          error.data.message ||
                          `La discussion ${topic.topicName} n'a pas pu être épinglée`,
                        status: "error"
                      });
                    } finally {
                      setIsLoading({
                        [topic._id]: false
                      });
                    }
                  }}
                />
              </Tooltip>
            </>
          )}

          {isTopicCreator && (
            <>
              <EditIconButton
                label="Modifier la discussion"
                colorScheme="green"
                mr={3}
                onClick={(e) => {
                  e.stopPropagation();
                  onEditClick();
                }}
              />

              <DeleteButton
                header={
                  <>
                    Êtes vous sûr de vouloir supprimer la discussion
                    <Text display="inline" color="red" fontWeight="bold">
                      {` ${topic.topicName}`}
                    </Text>{" "}
                    ?
                  </>
                }
                isIconOnly
                isSmall={false}
                label="Supprimer la discussion"
                mr={3}
                placement="bottom"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick();
                }}
                data-cy="topic-list-item-delete"
              />
            </>
          )}
        </>
      )}

      {!isLoading && (
        <Flex>
          {session && (
            <Tooltip
              label={
                isSubbedToTopic
                  ? "Se désabonner de la discussion"
                  : "S'abonner à la discussion"
              }
            >
              <IconButton
                aria-label={
                  isSubbedToTopic
                    ? "Se désabonner de la discussion"
                    : "S'abonner à la discussion"
                }
                icon={isSubbedToTopic ? <FaBellSlash /> : <FaBell />}
                variant="outline"
                colorScheme="blue"
                mr={3}
                onClick={async (e) => {
                  e.stopPropagation();
                  onSubscribeClick();
                }}
                data-cy={
                  isSubbedToTopic
                    ? "topic-list-item-unsubscribe"
                    : "topic-list-item-subscribe"
                }
              />
            </Tooltip>
          )}

          <Tooltip
            placement="left"
            label={`${isCurrent ? "Fermer" : "Ouvrir"} la discussion`}
          >
            <IconButton
              aria-label={`${isCurrent ? "Fermer" : "Ouvrir"} la discussion`}
              icon={
                isCurrent ? (
                  <ChevronUpIcon boxSize={9} />
                ) : (
                  <ChevronRightIcon boxSize={9} />
                )
              }
              bg="transparent"
              height="auto"
              minWidth={0}
              _hover={{
                background: "transparent",
                color: isDark ? "teal.100" : "white"
              }}
              onClick={onClick}
            />
          </Tooltip>
        </Flex>
      )}
    </Flex>
  );
};
