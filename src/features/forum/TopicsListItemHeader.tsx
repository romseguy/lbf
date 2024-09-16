import { CalendarIcon, ChatIcon } from "@chakra-ui/icons";
import {
  Badge,
  Icon,
  Link,
  Tooltip,
  Box,
  Flex,
  Text,
  FlexProps,
  HStack,
  StackProps,
  useColorMode,
  VStack
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
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";

interface TopicsListItemHeader {
  isCurrent: boolean;
  query: AppQueryWithData<IEntity>;
  selectedCategories?: string[];
  setSelectedCategories: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >;
  topic: ITopic;
}

export const TopicsListItemHeader = ({
  isCurrent,
  query,
  selectedCategories,
  setSelectedCategories,
  topic,
  ...props
}: StackProps & TopicsListItemHeader) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);

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

  const elements = (
    <>
      <HStack>
        <Tooltip label={`${topic.topicMessages.length} message(s)`}>
          <Box pos="relative" mt={isMobile ? 0 : 2}>
            <Icon
              as={isCurrent ? FaFolderOpen : FaFolder}
              boxSize={7}
              color={isDark ? "teal.200" : "teal"}
            />

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

        {isO && isEventTopic ? <CalendarIcon /> : <Icon as={ChatIcon} />}

        <Text whiteSpace={!isMobile ? "nowrap" : undefined}>
          Discussion{isEventTopic && "s de l'événement"} :{" "}
        </Text>
      </HStack>

      <Text fontWeight="bold">{event ? event.eventName : topic.topicName}</Text>
    </>
  );

  if (isMobile)
    return (
      <VStack alignItems="flex-start" spacing={0} {...props}>
        {elements}
      </VStack>
    );
  return <HStack {...props}>{elements}</HStack>;
};

interface TopicsListItemHeaderDetailsProps {
  query: AppQueryWithData<IEntity>;
  topic: ITopic;
}

export const TopicsListItemHeaderDetails = ({
  query,
  topic,
  ...props
}: Omit<FlexProps, "onClick"> & TopicsListItemHeaderDetailsProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);

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

  const firstMessage = topic.topicMessages[0]
    ? topic.topicMessages[0].message
        .replace("<p>", "")
        .replace("</p>", "")
        .replace("<br/>", "")
        .replace("&nbsp;", "")
        .substring(0, 20)
    : "";
  //#endregion

  return (
    <VStack>
      <Box>
        <Text
          fontSize="smaller"
          fontStyle="italic"
          dangerouslySetInnerHTML={{
            __html: !firstMessage ? "" : firstMessage + "..."
          }}
        />
      </Box>

      <Box>
        <HStack>
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
        </HStack>
      </Box>
    </VStack>
  );
};

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

{
  /*
  (
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

          <Td >
            {isO && isEventTopic ? (
              <CalendarIcon mr={1} mt={-1} />
            ) : (
              <Icon as={ChatIcon} mr={1} mt={0} />
            )}
            <Text>Discussions {isEventTopic && "de l'événement"} : </Text>
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

            <Text fontWeight="bold">
              {event ? event.eventName : topic.topicName}
            </Text>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  )
    */
}

{
  /*
      <Flex
        alignItems="center"
        flexWrap="wrap"
        fontSize="smaller"
        color={isDark ? "white" : "purple"}
        ml={isMobile ? 0 : 10}
      >
      </Flex>
  */
}
