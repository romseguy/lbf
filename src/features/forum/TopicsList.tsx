import type { IEvent } from "models/Event";
import type { IOrg } from "models/Org";
import type { ISubscription } from "models/Subscription";
import type { ITopic } from "models/Topic";
import { Visibility } from "models/Topic";
import React, { useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  EmailIcon,
  LockIcon,
  ViewIcon
} from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";
import { GridProps, Spinner, Tooltip, useColorMode } from "@chakra-ui/react";
import { Grid, GridItem, IconFooter, Spacer } from "features/common";
import { TopicMessageForm } from "features/forms/TopicMessageForm";
import { TopicMessagesList } from "./TopicMessagesList";

export const TopicsList = ({
  event,
  org,
  query,
  isCreator,
  isFollowed,
  isSubscribed,
  onLoginClick,
  ...props
}: GridProps & {
  event?: IEvent;
  org?: IOrg;
  query: any;
  isCreator?: boolean;
  isFollowed?: boolean;
  isSubscribed?: boolean;
  onLoginClick: () => void;
}) => {
  const [topic, setTopic] = useState<ITopic | null>(null);

  let entity: IEvent | IOrg | undefined = org || event;
  let entityTopics: ITopic[] = org?.orgTopics || event?.eventTopics || [];

  if (event) {
    entity = event;
    entityTopics = event.eventTopics;
  }

  const topicsCount = Array.isArray(entityTopics) ? entityTopics.length : 0;

  return (
    <Grid {...props}>
      <GridItem>
        {entity && topicsCount > 0 ? (
          <>
            {/* <Spacer borderWidth={1} /> */}
            {entityTopics
              .filter((entityTopic) => {
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

                return (
                  <Box key={entityTopic._id}>
                    <Grid
                      templateColumns="auto 1fr auto"
                      cursor="pointer"
                      light={{
                        borderTopRadius: topicIndex === 0 ? "lg" : undefined,
                        borderBottomRadius:
                          topicIndex === topicsCount - 1 ? "lg" : undefined,
                        bg: topicIndex % 2 === 0 ? "orange.100" : "orange.300",
                        _hover: { textDecoration: "underline" }
                      }}
                      dark={{
                        borderTopRadius: topicIndex === 0 ? "lg" : undefined,
                        borderBottomRadius:
                          topicIndex === topicsCount - 1 ? "lg" : undefined,
                        bg: topicIndex % 2 === 0 ? "gray.500" : "gray.600",
                        _hover: { textDecoration: "underline" }
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
                        {entityTopic.topicName}
                        {/* </Box> */}
                      </GridItem>
                      <GridItem>
                        <Box pr={3}>
                          {entityTopic.topicVisibility ===
                          Visibility.SUBSCRIBERS ? (
                            <Tooltip label="Discussion réservée aux adhérents">
                              <LockIcon boxSize={4} />
                            </Tooltip>
                          ) : entityTopic.topicVisibility ===
                            Visibility.FOLLOWERS ? (
                            <Tooltip label="Discussion réservée aux abonnés">
                              <EmailIcon boxSize={4} />
                            </Tooltip>
                          ) : entityTopic.topicVisibility ===
                            Visibility.PUBLIC ? (
                            <Tooltip label="Discussion visible par tous">
                              <ViewIcon boxSize={4} />
                            </Tooltip>
                          ) : null}
                        </Box>
                      </GridItem>
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
                            onLoginClick={onLoginClick}
                            topic={entityTopic}
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

            <IconFooter />
          </>
        ) : query.isLoading ? (
          <Spinner m={3} />
        ) : null}
      </GridItem>
    </Grid>
  );
};
