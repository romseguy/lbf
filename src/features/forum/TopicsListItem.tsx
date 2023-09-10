import {
  ChevronRightIcon,
  ChevronUpIcon,
  EditIcon,
  EmailIcon
} from "@chakra-ui/icons";
import {
  Badge,
  Box,
  BoxProps,
  Button,
  Flex,
  Icon,
  IconButton,
  Link,
  Spinner,
  Table,
  Tbody,
  Tr,
  Td,
  Text,
  Tooltip
} from "@chakra-ui/react";
import React, { forwardRef, useState } from "react";
import { FaBellSlash, FaBell, FaFolder, FaFolderOpen } from "react-icons/fa";
import { css } from "twin.macro";
import { DeleteButton, GridItem } from "features/common";
import { TopicMessageForm } from "features/forms/TopicMessageForm";
import { getCategoryLabel, IEntity, isEvent, isOrg } from "models/Entity";
import { isEdit, ITopic } from "models/Topic";
import { Session } from "utils/auth";
import * as dateUtils from "utils/date";
import { AppQueryWithData } from "utils/types";
import { TopicMessagesList } from "./TopicMessagesList";
import { TopicsListItemShare } from "./TopicsListItemShare";
import { TopicsListItemSubscribers } from "./TopicsListItemSubscribers";
import { TopicsListItemVisibility } from "./TopicsListItemVisibility";

interface TopicsListItemProps extends Omit<BoxProps, "onClick"> {
  isMobile: boolean;
  session: Session | null;
  currentTopicName?: string;
  isCreator: boolean;
  isSubbedToTopic: boolean;
  isCurrent: boolean;
  isTopicCreator: boolean;
  isDark: boolean;
  isLoading: boolean;
  query: AppQueryWithData<IEntity>;
  setIsLoading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  selectedCategories?: string[];
  setSelectedCategories: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >;
  topic: ITopic;
  topicIndex: number;
  onClick: (topic: ITopic, isCurrent: boolean) => void;
  onDeleteClick: (topic: ITopic, isCurrent: boolean) => void;
  onEditClick: (topic: ITopic) => void;
  onNotifClick: (topic: ITopic) => void;
  onSubscribeClick: (topic: ITopic, isSubbedToTopic: boolean) => void;
}

export const TopicsListItem = forwardRef(
  (
    {
      isMobile,
      session,
      currentTopicName,
      isCreator,
      isCurrent,
      isDark,
      isLoading,
      isSubbedToTopic,
      isTopicCreator,
      query,
      setIsLoading,
      selectedCategories,
      setSelectedCategories,
      topic,
      topicIndex,
      onClick,
      onDeleteClick,
      onEditClick,
      onNotifClick,
      onSubscribeClick,
      ...props
    }: TopicsListItemProps,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    //#region entity
    const entity = query.data;
    const isE = isEvent(entity);
    const isO = isOrg(entity);
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
    const s =
      !topic.topicNotifications.length || topic.topicNotifications.length > 1
        ? "s"
        : "";
    //#endregion

    //#region local
    const [isEdit, setIsEdit] = useState<isEdit>({});
    const isEditing = Object.keys(isEdit).reduce(
      (acc, key) => (isEdit[key] && isEdit[key].isOpen ? ++acc : acc),
      0
    );
    const [isHover, setIsHover] = useState(false);
    //#endregion

    // useEffect(() => {
    //   if (ref && isCurrent && !isLoading) {
    //     //@ts-expect-error
    //     ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    //   }
    // }, [ref, isCurrent, isLoading]);

    return (
      <Box ref={ref} {...props}>
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
          onClick={() => onClick(topic, isCurrent)}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <Flex
            flexDirection="column"
            flexGrow={1}
            //px={2}
            ml={2}
          >
            {/* Header */}
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
            >
              <Tbody>
                <Tr>
                  <Td>
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

                    <Text fontWeight="bold">{topic.topicName}</Text>
                  </Td>
                </Tr>
              </Tbody>
            </Table>

            {/* SubHeader */}
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

              <Tooltip
                placement="bottom"
                label={`Discussion créée le ${fullDate}`}
              >
                <Text
                  cursor="default"
                  // _hover={{
                  //   color: isDark ? "white" : "white"
                  // }}
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
                color={isDark ? "white" : "purple"}
              />

              <Box as="span" aria-hidden mx={1}>
                ·
              </Box>

              <TopicsListItemShare
                aria-label="Partager la discussion"
                topic={topic}
                color={isDark ? "white" : "purple"}
              />

              {isCreator && (
                <>
                  <Box as="span" aria-hidden mx={1}>
                    ·
                  </Box>
                  {/* <Link
                      _hover={{
                        color: isDark ? "white" : "white",
                        textDecoration: "underline"
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNotifClick(topic);
                      }}
                    > */}
                  <Box cursor="default">
                    {topic.topicNotifications.length} membre{s} invité{s}
                  </Box>
                  {/* </Link> */}
                </>
              )}
            </Flex>
          </Flex>

          <Flex
            alignItems="center"
            // pt={3}
            // pb={2}
            ml={2}
          >
            {isLoading && <Spinner mr={3} mt={1} mb={2} />}

            {!isLoading && session && (
              <>
                {isCreator && (
                  <Tooltip
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
                        onNotifClick(topic);
                      }}
                    />
                  </Tooltip>
                )}

                {isTopicCreator && (
                  <>
                    <Tooltip placement="bottom" label="Modifier la discussion">
                      <IconButton
                        aria-label="Modifier la discussion"
                        icon={<EditIcon />}
                        colorScheme="green"
                        variant="outline"
                        mr={3}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditClick(topic);
                        }}
                      />
                    </Tooltip>

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
                      onClick={() => {
                        onDeleteClick(topic, isCurrent);
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
                        onSubscribeClick(topic, isSubbedToTopic);
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
                  <Icon
                    as={isCurrent ? ChevronUpIcon : ChevronRightIcon}
                    boxSize={10}
                    color={isDark || isHover ? "white" : "purple"}
                    _hover={{ color: "white" }}
                  />
                </Tooltip>
              </Flex>
            )}
          </Flex>
        </Flex>

        {isCurrent && (
          <>
            <GridItem
              bg={isDark ? "#314356" : "blue.100"}
              px={3}
              py={2}
              data-cy="topic-subscribers"
            >
              <TopicsListItemSubscribers
                topic={topic}
                isSubbedToTopic={isSubbedToTopic}
              />
            </GridItem>

            <TopicMessagesList
              bg={isDark ? "gray.700" : "orange.50"}
              isEdit={isEdit}
              query={query}
              setIsEdit={setIsEdit}
              topic={topic}
              p={3}
              pb={1}
            />

            {!isEditing && (
              <GridItem
                light={{ bg: "orange.50" }}
                dark={{ bg: "gray.700" }}
                borderBottomRadius="xl"
              >
                <Box p={3}>
                  <TopicMessageForm
                    query={query}
                    isLoading={isLoading}
                    setIsLoading={(bool) => {
                      setIsLoading({ [topic._id]: bool });
                    }}
                    topic={topic}
                    //formats={formats.filter((f) => f !== "size")}
                    isDisabled={topic.topicMessagesDisabled}
                  />
                </Box>
              </GridItem>
            )}
          </>
        )}
      </Box>
    );
  }
);
