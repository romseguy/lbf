import { ChatIcon } from "@chakra-ui/icons";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  IconButton,
  Select,
  Box,
  BoxProps,
  Text,
  VStack,
  useColorMode
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { EntityButton } from "features/common";
import { useGetTopicsQuery } from "features/forum/topicsApi";
import { useGetSubscriptionQuery } from "features/subscriptions/subscriptionsApi";
import { selectSubscriptionRefetch } from "features/subscriptions/subscriptionSlice";
import { selectUserEmail } from "features/users/userSlice";
import { hasItems } from "utils/array";
import { timeAgo } from "utils/date";

let cachedRefetchSubscription = false;

export const TopicPopover = ({
  boxSize,
  session,
  ...props
}: BoxProps & {
  session: Session;
}) => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const storedUserEmail = useSelector(selectUserEmail);
  const [email, setEmail] = useState(storedUserEmail || session.user.email);

  //#region topics
  const myTopicsQuery = useGetTopicsQuery(
    {
      createdBy: session.user.userId,
      populate: "org event"
    },
    {
      selectFromResult: (query) => ({
        ...query,
        data:
          [...(query.data || [])].sort((a, b) => {
            if (a.createdAt && b.createdAt) {
              if (a.createdAt < b.createdAt) return 1;
              else if (a.createdAt > b.createdAt) return -1;
            }
            return 0;
          }) || []
      })
    }
  );

  const topicsQuery = useGetTopicsQuery(
    { populate: "org event" },
    {
      selectFromResult: (query) => ({
        ...query,
        answeredTopics:
          query.data?.filter((topic) => {
            if (topic.org === null || topic.event === null) return false;

            return !!topic.topicMessages.find((topicMessage) => {
              const createdBy =
                typeof topicMessage.createdBy === "object"
                  ? topicMessage.createdBy._id
                  : topicMessage.createdBy;
              return createdBy === session.user.userId;
            });
          }) || []
      })
    }
  );
  const { answeredTopics } = topicsQuery;
  //#endregion

  //#region my sub
  const subQuery = useGetSubscriptionQuery(
    {
      email,
      populate: "topics.topic.org topics.topic.event"
    },
    {
      selectFromResult: (query) => ({
        ...query,
        followedTopics: query.data?.topics.map((topics) => topics.topic) || []
      })
    }
  );
  const { followedTopics } = subQuery;
  //#endregion

  //#region local state
  const [isOpen, setIsOpen] = useState(false);
  const [showTopics, setShowTopics] = useState<
    "showTopicsAdded" | "showTopicsFollowed" | "showTopicsAnswered"
  >("showTopicsAdded");
  //#endregion

  const refetchSubscription = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    if (refetchSubscription !== cachedRefetchSubscription) {
      console.log("refetching subscription");
      subQuery.refetch();
    }
  }, [refetchSubscription]);

  useEffect(() => {
    const newEmail = storedUserEmail || session.user.email;

    if (newEmail !== email) {
      setEmail(newEmail);
      console.log("refetching subscription because of new email", newEmail);
      subQuery.refetch();
    }
  }, [storedUserEmail, session]);

  return (
    <Box {...props}>
      <Popover
        isLazy
        isOpen={isOpen}
        offset={[-140, 0]}
        onClose={() => setIsOpen(false)}
      >
        <PopoverTrigger>
          <IconButton
            aria-label="Discussions"
            bg="transparent"
            _hover={{ bg: "transparent" }}
            icon={
              <ChatIcon
                boxSize={boxSize}
                _hover={{ color: isDark ? "lightgreen" : "white" }}
              />
            }
            minWidth={0}
            onClick={() => {
              if (!isOpen) {
                myTopicsQuery.refetch();
                topicsQuery.refetch();
                subQuery.refetch();
              }
              setIsOpen(!isOpen);
            }}
            data-cy="topicPopover"
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverBody>
            <Select
              fontSize="sm"
              height="auto"
              lineHeight={2}
              mb={2}
              defaultValue={showTopics}
              onChange={(e) =>
                setShowTopics(
                  e.target.value as "showTopicsAdded" | "showTopicsFollowed"
                )
              }
            >
              <option value="showTopicsAdded">
                Les discussions que j'ai ajouté
              </option>
              <option value="showTopicsFollowed">
                Les discussions où je suis abonné
              </option>
              <option value="showTopicsAnswered">
                Les discussions où je participe
              </option>
            </Select>

            {showTopics === "showTopicsAdded" &&
              (Array.isArray(myTopicsQuery.data) &&
              myTopicsQuery.data.length > 0 ? (
                <VStack
                  aria-hidden
                  overflow="auto"
                  height="250px"
                  spacing={2}
                  pr={1}
                >
                  {myTopicsQuery.data.map((topic, index) => {
                    if (topic.org === null || topic.event === null) return null;
                    return (
                      <Box
                        key={topic._id}
                        alignSelf={index % 2 === 0 ? "flex-start" : "flex-end"}
                        borderColor={isDark ? "gray.600" : "gray.300"}
                        borderRadius="lg"
                        borderStyle="solid"
                        borderWidth="1px"
                        p={1}
                        // bg={
                        //   isDark ? (index % 2 === 0 ? "" : "gray.800") : "white"
                        // }
                      >
                        <Box
                          display="flex"
                          justifyContent={
                            index % 2 === 0 ? "flex-start" : "flex-end"
                          }
                        >
                          <EntityButton
                            topic={topic}
                            org={topic.org}
                            event={topic.event}
                            p={1}
                          />
                        </Box>

                        {(topic.event || topic.org) && (
                          <>
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent={
                                index % 2 === 0 ? "flex-start" : "flex-end"
                              }
                              mt={1}
                            >
                              <Text fontSize="smaller" mx={1}>
                                dans
                              </Text>
                              <EntityButton
                                event={topic.event}
                                org={topic.org}
                                p={1}
                              />
                            </Box>
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent={
                                index % 2 === 0 ? "flex-start" : "flex-end"
                              }
                              mt={1}
                            >
                              <Text fontSize="0.7em" fontStyle="italic" mx={1}>
                                il y a {timeAgo(topic.createdAt).timeAgo}
                              </Text>
                            </Box>
                          </>
                        )}
                      </Box>
                    );
                  })}
                </VStack>
              ) : (
                <Text fontSize="smaller">
                  Vous n'avez ajouté aucune discussions.
                </Text>
              ))}

            {showTopics === "showTopicsFollowed" &&
              (hasItems(followedTopics) ? (
                <VStack
                  alignItems="flex-start"
                  overflowX="auto"
                  height="250px"
                  spacing={2}
                  pr={1}
                >
                  {followedTopics.map((topic, index) => (
                    <Box
                      key={`followed-${topic._id}`}
                      alignSelf={index % 2 === 0 ? "flex-start" : "flex-end"}
                      borderColor={isDark ? "gray.600" : "gray.300"}
                      borderRadius="lg"
                      borderStyle="solid"
                      borderWidth="1px"
                      p={1}
                    >
                      <Box
                        display="flex"
                        justifyContent={
                          index % 2 === 0 ? "flex-start" : "flex-end"
                        }
                      >
                        <EntityButton topic={topic} p={1} />
                      </Box>
                      {(topic.event || topic.org) && (
                        <Box display="flex" alignItems="center" mt={1}>
                          <Text fontSize="smaller" mx={1}>
                            dans
                          </Text>
                          <EntityButton
                            event={topic.event}
                            org={topic.org}
                            p={1}
                          />
                        </Box>
                      )}
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Text fontSize="smaller">
                  Vous n'êtes abonné à aucune discussions.
                </Text>
              ))}

            {showTopics === "showTopicsAnswered" &&
              (hasItems(answeredTopics) ? (
                <VStack
                  alignItems="flex-start"
                  overflowX="auto"
                  height="250px"
                  spacing={2}
                  pr={1}
                >
                  {answeredTopics.map((topic, index) => (
                    <Box
                      key={`answered-${topic._id}`}
                      alignSelf={index % 2 === 0 ? "flex-start" : "flex-end"}
                      borderColor={isDark ? "gray.600" : "gray.300"}
                      borderRadius="lg"
                      borderStyle="solid"
                      borderWidth="1px"
                      p={1}
                    >
                      <Box
                        display="flex"
                        justifyContent={
                          index % 2 === 0 ? "flex-start" : "flex-end"
                        }
                      >
                        <EntityButton topic={topic} p={1} />
                      </Box>
                      {(topic.event || topic.org) && (
                        <Box display="flex" alignItems="center" mt={1}>
                          <Text fontSize="smaller" mx={1}>
                            dans
                          </Text>
                          <EntityButton
                            event={topic.event}
                            org={topic.org}
                            p={1}
                          />
                        </Box>
                      )}
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Text fontSize="smaller">
                  Vous n'êtes abonné à aucune discussions.
                </Text>
              ))}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};
