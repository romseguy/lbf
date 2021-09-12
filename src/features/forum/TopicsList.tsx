import type { IEvent } from "models/Event";
import type { IOrg } from "models/Org";
import type { ITopic } from "models/Topic";
import { Visibility } from "models/Topic";
import React, { useEffect, useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  EditIcon,
  EmailIcon,
  LockIcon,
  ViewIcon,
  ViewOffIcon
} from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";
import {
  Flex,
  GridProps,
  Icon,
  IconButton,
  Input,
  Spinner,
  Text,
  Tooltip,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { DeleteButton, Grid, GridItem, Link } from "features/common";
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
import { useDeleteTopicMutation } from "./topicsApi";
import { IoMdPerson } from "react-icons/io";

// https://github.com/chakra-ui/chakra-ui/issues/2869
const TopicVisibility = ({ topicVisibility }: { topicVisibility?: string }) =>
  topicVisibility === Visibility.SUBSCRIBERS ? (
    <Tooltip label="Discussion réservée aux adhérents">
      <span>
        <Icon as={IoMdPerson} boxSize={4} />
      </span>
    </Tooltip>
  ) : topicVisibility === Visibility.FOLLOWERS ? (
    <Tooltip label="Discussion réservée aux abonnés">
      <EmailIcon boxSize={4} />
    </Tooltip>
  ) : topicVisibility === Visibility.PUBLIC ? (
    <Tooltip label="Discussion publique">
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
  const toast = useToast({ position: "top" });

  //#region subscription
  const subQuery = useGetSubscriptionQuery(session?.user.userId);
  const [deleteSubscription, deleteSubscriptionMutation] =
    useDeleteSubscriptionMutation();
  const [addSubscription, addSubscriptionMutation] =
    useAddSubscriptionMutation();
  //#endregion

  //#region topic
  const [deleteTopic, deleteTopicMutation] = useDeleteTopicMutation();
  //#endregion

  //#region local state
  const [topicModalState, setTopicModalState] = useState<{
    isOpen: boolean;
    topic?: ITopic;
  }>({ isOpen: false, topic: undefined });
  const [currentTopic, setCurrentTopic] = useState<ITopic | null>(null);
  // const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = useState(true);
  const entityName = org ? org.orgName : event?.eventName;
  let entityTopics: ITopic[] = org
    ? org.orgTopics
    : event
    ? event.eventTopics
    : [];
  const topicsCount = Array.isArray(entityTopics) ? entityTopics.length : 0;
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
          topic={topicModalState.topic}
          org={org}
          event={event}
          isCreator={isCreator}
          isFollowed={isFollowed}
          isSubscribed={isSubscribed}
          onCancel={() =>
            setTopicModalState({
              ...topicModalState,
              isOpen: false,
              topic: undefined
            })
          }
          onSubmit={async (topic) => {
            query.refetch();
            subQuery.refetch();
            setTopicModalState({
              ...topicModalState,
              isOpen: false,
              topic: undefined
            });
            setCurrentTopic(topic ? topic : null);
          }}
          onClose={() =>
            setTopicModalState({
              ...topicModalState,
              isOpen: false,
              topic: undefined
            })
          }
        />
      )}

      <Grid data-cy="topicList" {...props}>
        <GridItem>
          {topicsCount > 0 ? (
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
                    currentTopic && entityTopic._id === currentTopic._id;
                  const { timeAgo, fullDate } = dateUtils.timeAgo(
                    entityTopic.createdAt,
                    true
                  );
                  const entityTopicCreatedBy =
                    typeof entityTopic.createdBy === "object"
                      ? entityTopic.createdBy._id
                      : entityTopic.createdBy;
                  const entityTopicCreatedByUserName =
                    typeof entityTopic.createdBy === "object"
                      ? entityTopic.createdBy.userName
                      : "";
                  const isCreator =
                    session && entityTopicCreatedBy === session.user.userId;

                  let isSubbedToTopic = false;

                  if (subQuery.data) {
                    isSubbedToTopic = !!subQuery.data.topics.find(
                      ({ topic }) => topic._id === entityTopic._id
                    );
                  }

                  return (
                    <Box key={entityTopic._id} mb={5}>
                      <Link
                        variant="no-underline"
                        onClick={() =>
                          setCurrentTopic(isCurrent ? null : entityTopic)
                        }
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
                              topicIndex % 2 === 0
                                ? "orange.200"
                                : "orange.100",
                            _hover: { bg: "orange.300" }
                          }}
                          dark={{
                            bg: topicIndex % 2 === 0 ? "gray.600" : "gray.500",
                            _hover: { bg: "gray.400" }
                          }}
                        >
                          <GridItem p={3}>
                            {currentTopic && isCurrent ? (
                              <ViewIcon boxSize={6} />
                            ) : (
                              <ViewOffIcon boxSize={6} />
                            )}
                          </GridItem>
                          <GridItem py={3}>
                            {/* <Box
                        px={3}
                        _hover={{
                          bg: isDark ? "gray.800" : "orange.200"
                        }}
                      > */}
                            <Box lineHeight="1" data-cy="topicHeader">
                              <Text fontWeight="bold">
                                {entityTopic.topicName}
                              </Text>
                              <Box
                                display="inline"
                                fontSize="smaller"
                                color={isDark ? "white" : "gray.600"}
                              >
                                {entityTopicCreatedByUserName}
                                <span aria-hidden> · </span>
                                <Tooltip placement="bottom" label={fullDate}>
                                  <span>{timeAgo}</span>
                                </Tooltip>
                                <span aria-hidden> · </span>
                                <TopicVisibility
                                  topicVisibility={entityTopic.topicVisibility}
                                />
                              </Box>
                            </Box>
                            {/* </Box> */}
                          </GridItem>
                          {session && (
                            <GridItem>
                              <Box
                                pr={3}
                                pt={3}
                                //alignItems="center"
                              >
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
                                            topic: entityTopic
                                          });
                                        }}
                                      />
                                    </Tooltip>

                                    <>
                                      <span aria-hidden> · </span>
                                      {deleteTopicMutation.isLoading ? (
                                        <Spinner boxSize={4} />
                                      ) : (
                                        <DeleteButton
                                          isIconOnly
                                          placement="bottom"
                                          bg="transparent"
                                          height="auto"
                                          minWidth={0}
                                          _hover={{ color: "red" }}
                                          // isDisabled={isDeleteButtonDisabled}
                                          header={
                                            <>
                                              Êtes vous sûr de vouloir supprimer
                                              la discussion
                                              <Text
                                                display="inline"
                                                color="red"
                                                fontWeight="bold"
                                              >
                                                {` ${entityTopic.topicName}`}
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
                                                entityTopic.topicName
                                            )
                                          }
                                        /> */}
                                            </>
                                          }
                                          onClick={async () => {
                                            try {
                                              let deletedTopic;

                                              if (entityTopic._id) {
                                                deletedTopic =
                                                  await deleteTopic(
                                                    entityTopic._id
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
                                            } catch (error) {
                                              toast({
                                                title: error.data
                                                  ? error.data.message
                                                  : error.message,
                                                status: "error",
                                                isClosable: true
                                              });
                                            }
                                          }}
                                          data-cy="deleteTopic"
                                        />
                                      )}
                                      <span aria-hidden> · </span>
                                    </>
                                  </>
                                )}

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
                                        bg="transparent"
                                        height="auto"
                                        minWidth={0}
                                        _hover={{
                                          color: isDark ? "lightgreen" : "white"
                                        }}
                                        onClick={async (e) => {
                                          e.stopPropagation();

                                          if (
                                            subQuery.isLoading ||
                                            addSubscriptionMutation.isLoading ||
                                            deleteSubscriptionMutation.isLoading
                                          )
                                            return;

                                          if (!subQuery.data) {
                                            console.log("user got no sub");
                                            await addSubscription({
                                              payload: {
                                                topics: [{ topic: entityTopic }]
                                              },
                                              user: session?.user.userId
                                              // email:
                                            });
                                            toast({
                                              title: `Vous avez été abonné à la discussion ${entityTopic.topicName}`,
                                              status: "success",
                                              isClosable: true
                                            });
                                          } else if (isSubbedToTopic) {
                                            const unsubscribe = confirm(
                                              `Êtes vous sûr de vouloir vous désabonner de la discussion : ${entityTopic.topicName} ?`
                                            );

                                            if (unsubscribe) {
                                              await deleteSubscription({
                                                subscriptionId:
                                                  subQuery.data._id,
                                                topicId: entityTopic._id
                                              });

                                              toast({
                                                title: `Vous avez été désabonné de ${entityTopic.topicName}`,
                                                status: "success",
                                                isClosable: true
                                              });
                                            }
                                          } else {
                                            console.log(
                                              "user got no topic sub"
                                            );
                                            await addSubscription({
                                              payload: {
                                                topics: [{ topic: entityTopic }]
                                              },
                                              user: session?.user.userId
                                              // email:
                                            });
                                            toast({
                                              title: `Vous avez été abonné à la discussion ${entityTopic.topicName}`,
                                              status: "success",
                                              isClosable: true
                                            });
                                          }

                                          subQuery.refetch();
                                        }}
                                        data-cy={
                                          isSubbedToTopic
                                            ? "topicUnsubscribe"
                                            : "topicSubscribe"
                                        }
                                      />
                                    </span>
                                  </Tooltip>
                                )}
                              </Box>
                            </GridItem>
                          )}
                        </Grid>
                      </Link>
                      {isCurrent && (
                        <>
                          <GridItem
                            light={{ bg: "white" }}
                            dark={{ bg: "gray.700" }}
                          >
                            <TopicMessagesList
                              query={query}
                              topic={entityTopic}
                            />
                          </GridItem>

                          <GridItem
                            light={{ bg: "white" }}
                            dark={{ bg: "gray.700" }}
                            pb={3}
                            borderBottomRadius="xl"
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
