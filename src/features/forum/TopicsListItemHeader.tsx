import {
  Badge,
  Button,
  Icon,
  Link,
  Table,
  Tbody,
  Tr,
  Td,
  Tooltip,
  Box,
  Flex,
  Text,
  FlexProps,
  TableProps,
  HStack
} from "@chakra-ui/react";
import React from "react";
import { FaFolder, FaFolderOpen } from "react-icons/fa";
import { css } from "twin.macro";
import { getCategoryLabel, IEntity, isEvent, isOrg } from "models/Entity";
import { ITopic } from "models/Topic";
import * as dateUtils from "utils/date";
import { AppQueryWithData } from "utils/types";
import { TopicsListItemShare } from "./TopicsListItemShare";
import { TopicsListItemVisibility } from "./TopicsListItemVisibility";
import { CalendarIcon, ChatIcon } from "@chakra-ui/icons";

interface TopicsListItemHeaderTable {
  isCurrent: boolean;
  isDark: boolean;
  query: AppQueryWithData<IEntity>;
  selectedCategories?: string[];
  setSelectedCategories: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >;
  topic: ITopic;
}

export const TopicsListItemHeaderTable = ({
  isCurrent,
  isDark,
  query,
  selectedCategories,
  setSelectedCategories,
  topic,
  ...props
}: TableProps & TopicsListItemHeaderTable) => {
  //#region entity
  const entity = query.data;
  const isE = isEvent(entity);
  const isO = isOrg(entity);
  const event = isO
    ? entity.orgEvents.find(({ _id }) => _id === topic.topicName)
    : undefined;
  const isEventTopic = !!event;
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
  const topicCategoryLabel =
    typeof topic.topicCategory === "string"
      ? getCategoryLabel(topicCategories, topic.topicCategory)
      : "";
  //#endregion

  return (
    <Table
      css={css`
        td {
          border: none;
          padding: 0;
        }
        td:last-of-type {
          width: 100%;
        }
      `}
      {...props}
    >
      <Tbody>
        <Tr>
          <Td>
            <Tooltip label={`${topic.topicMessages.length} message(s)`}>
              <Box pos="relative">
                {isCurrent ? (
                  <Icon
                    as={FaFolderOpen}
                    //alignSelf="center"
                    boxSize={7}
                    color={isDark ? "teal.200" : "teal"}
                    mr={2}
                  />
                ) : (
                  <Icon
                    as={FaFolder}
                    boxSize={7}
                    color={isDark ? "teal.200" : "teal"}
                    mr={2}
                  />
                )}
                {topic.topicMessages.length > 0 && (
                  <Badge
                    bgColor={isDark ? "teal.600" : "teal.100"}
                    color={isDark ? "white" : "black"}
                    pos="absolute"
                    variant="solid"
                    left={1}
                  >
                    {topic.topicMessages.length}
                  </Badge>
                )}
              </Box>
            </Tooltip>
          </Td>

          <Td>
            {isO && isEventTopic ? (
              <CalendarIcon mr={1} mt={-1} />
            ) : (
              <Icon as={ChatIcon} mr={1} mt={0} />
            )}
          </Td>

          <Td>
            {topic.topicCategory && (
              <Tooltip
                label={
                  !hasCategorySelected
                    ? `Afficher les discussions de la catégorie ${topicCategoryLabel}`
                    : ""
                }
                hasArrow
              >
                <Button
                  //alignSelf="flex-start"
                  colorScheme={hasCategorySelected ? "pink" : "teal"}
                  fontSize="small"
                  fontWeight="normal"
                  height="auto"
                  mr={1}
                  py={1}
                  px={0}
                  onClick={(e) => {
                    e.stopPropagation();

                    if (hasCategorySelected)
                      setSelectedCategories(
                        selectedCategories!.filter(
                          (category) => category !== topic.topicCategory
                        )
                      );
                    else if (topic.topicCategory)
                      setSelectedCategories([
                        ...(selectedCategories || []),
                        topic.topicCategory
                      ]);
                  }}
                >
                  {topicCategoryLabel}
                </Button>
              </Tooltip>
            )}

            <HStack>
              <Text>Discussion {isEventTopic && "de l'événement"} : </Text>
              <Text fontWeight="bold">
                {event ? event.eventName : topic.topicName}
              </Text>
            </HStack>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
};

interface TopicsListItemHeaderDetailsProps {
  isDark: boolean;
  query: AppQueryWithData<IEntity>;
  topic: ITopic;
}

export const TopicsListItemHeaderDetails = ({
  isDark,
  query,
  topic,
  ...props
}: Omit<FlexProps, "onClick"> & TopicsListItemHeaderDetailsProps) => {
  //#region topic
  const { timeAgo, fullDate } = dateUtils.timeAgo(topic.createdAt, true);
  const topicCreatedByUserName =
    typeof topic.createdBy === "object"
      ? topic.createdBy.userName || topic.createdBy.email?.replace(/@.+/, "")
      : "";
  // const s =
  //   !topic.topicNotifications.length || topic.topicNotifications.length > 1
  //     ? "s"
  //     : "";
  //#endregion

  return (
    <Flex
      alignItems="center"
      flexWrap="wrap"
      fontSize="smaller"
      color={isDark ? "white" : "purple"}
      ml={10}
    >
      <Tooltip label="Aller à la page de l'utilisateur">
        <Link
          href={`/${topicCreatedByUserName}`}
          _hover={{
            color: isDark ? "white" : "white",
            textDecoration: "underline"
          }}
        >
          {topicCreatedByUserName}
        </Link>
      </Tooltip>

      <Box as="span" aria-hidden mx={1}>
        ·
      </Box>

      <Tooltip placement="bottom" label={`Discussion créée le ${fullDate}`}>
        <Text
          cursor="default"
          // _hover={{
          //   color: isDark ? "white" : "white"
          // }}
          onClick={(e) => e.stopPropagation()}
          suppressHydrationWarning
        >
          {timeAgo}
        </Text>
      </Tooltip>

      <Box as="span" aria-hidden mx={1}>
        ·
      </Box>

      <TopicsListItemVisibility
        query={query}
        topic={topic}
        //icon props
        color={isDark ? "white" : "purple"}
        cursor="default"
        css={css`
          vertical-align: middle;
        `}
        onClick={(e) => e.stopPropagation()}
      />

      <Box as="span" aria-hidden mx={1}>
        ·
      </Box>

      <TopicsListItemShare
        aria-label="Partager la discussion"
        topic={topic}
        color={isDark ? "white" : "purple"}
      />
    </Flex>
  );
};

export const TopicsListItemHeader = ({}: {}) => null;

{
  /*
  
            {isCreator && (
              <>
                <Box as="span" aria-hidden mx={1}>
                  ·
                </Box>
                <Link
                      _hover={{
                        color: isDark ? "white" : "white",
                        textDecoration: "underline"
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNotifClick(topic);
                      }}
                    >
                <Text cursor="default" onClick={(e) => e.stopPropagation()}>
                  {topic.topicNotifications.length} participant{s} invité{s}
                </Text>
                 </Link>
              </>
            )}
  */
}