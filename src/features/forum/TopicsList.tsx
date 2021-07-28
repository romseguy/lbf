import type { IEvent } from "models/Event";
import type { IOrg } from "models/Org";
import type { ITopic } from "models/Topic";
import React, { useState } from "react";
import parse from "html-react-parser";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Grid, Heading, Text } from "@chakra-ui/layout";
import { GridProps, Spinner, Tooltip, useColorMode } from "@chakra-ui/react";
import { GridHeader, GridItem, Link, Spacer } from "features/common";
import { TopicMessageForm } from "features/forms/TopicMessageForm";
import { intervalToDuration, format, formatDuration, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export const TopicsList = ({
  event,
  org,
  query,
  onLoginClick,
  ...props
}: GridProps & {
  event?: IEvent;
  org?: IOrg;
  query: any;
  onLoginClick: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
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
      {/* <GridHeader>
          <Heading size="lg" p={3}>
            Sujets de discussion
          </Heading>
        </GridHeader> */}
      <GridItem>
        {entity && topicsCount > 0 ? (
          <>
            <Spacer borderWidth={1} />
            {entityTopics.map((entityTopic, topicIndex) => {
              const isCurrent =
                topic && entityTopic.topicName === topic.topicName;
              return (
                <Box key={entityTopic._id}>
                  <GridHeader
                    fontWeight="bold"
                    pl={0}
                    // light={{ bg: "orange.200" }}
                    // dark={{ bg: "gray.500" }}
                  >
                    <Grid
                      templateColumns="auto 1fr"
                      alignItems="center"
                      cursor="pointer"
                      onClick={() => setTopic(isCurrent ? null : entityTopic)}
                    >
                      <GridItem
                        light={{ bg: "white" }}
                        dark={{ bg: "green.600" }}
                      >
                        <Box p={5}>
                          {topic && isCurrent ? (
                            <ChevronDownIcon />
                          ) : (
                            <ChevronRightIcon />
                          )}
                        </Box>
                      </GridItem>
                      <GridItem>
                        <Box
                          p={5}
                          _hover={{
                            bg: isDark ? "gray.800" : "orange.200"
                          }}
                        >
                          <Link
                            variant="underline"
                            onClick={() =>
                              setTopic(isCurrent ? null : entityTopic)
                            }
                          >
                            {entityTopic.topicName}
                          </Link>
                        </Box>
                      </GridItem>
                    </Grid>
                  </GridHeader>

                  <Spacer borderWidth={1} />

                  {isCurrent && (
                    <>
                      <GridItem
                        light={{ bg: "orange.100" }}
                        dark={{ bg: "gray.700" }}
                      >
                        {entityTopic.topicMessages.map(
                          ({ _id, message, createdBy, createdAt }, index) => {
                            const end = createdAt
                              ? parseISO(createdAt)
                              : new Date();
                            const fullDate = format(
                              end,
                              "eeee dd MMMM yyyy à H'h'mm",
                              { locale: fr }
                            );
                            const duration = intervalToDuration({
                              start: new Date(),
                              end
                            });
                            const formatted = formatDuration(duration, {
                              format: [
                                "years",
                                "months",
                                "weeks",
                                "days",
                                "hours",
                                "minutes"
                              ],
                              locale: fr
                            });
                            const timeAgo =
                              formatted === "" ? "1 minute" : formatted;

                            return (
                              <Box key={_id}>
                                <Text ml={1} pt={3}>
                                  <Link
                                    href={`/${encodeURIComponent(
                                      createdBy.userName
                                    )}`}
                                    variant="underline"
                                  >
                                    {createdBy.userName}
                                  </Link>{" "}
                                  a {index === 0 ? "écrit" : "répondu"} :
                                </Text>
                                <Box className="ql-editor" p={0} pt={1} pl={1}>
                                  {parse(message)}
                                </Box>
                                <Box textAlign="right" fontStyle="italic">
                                  <Tooltip
                                    placement="left"
                                    hasArrow
                                    label={fullDate}
                                    p={3}
                                  >
                                    <span>il y a {timeAgo}</span>
                                  </Tooltip>
                                </Box>
                                {index !==
                                  entityTopic.topicMessages.length - 1 && (
                                  <Spacer borderWidth={1} />
                                )}
                              </Box>
                            );
                          }
                        )}
                      </GridItem>
                      <GridItem
                        light={{ bg: "white" }}
                        dark={{ bg: "gray.800" }}
                      >
                        {/* <Text p={3}>Écrivez une réponse ci-dessous :</Text> */}
                        <TopicMessageForm
                          event={event}
                          org={org}
                          onLoginClick={onLoginClick}
                          topic={entityTopic}
                          onSubmit={() => query.refetch()}
                        />
                        {topicIndex !== topicsCount - 1 && (
                          <Spacer mt={3} borderWidth={1} />
                        )}
                      </GridItem>
                    </>
                  )}
                </Box>
              );
            })}
          </>
        ) : query.isLoading ? (
          <Spinner />
        ) : null}
      </GridItem>
    </Grid>
  );
};
