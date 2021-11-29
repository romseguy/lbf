import {
  EditIcon,
  EmailIcon,
  ExternalLinkIcon,
  LinkIcon,
  SpinnerIcon
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Link,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
  Tooltip,
  useToast
} from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import {
  FaBellSlash,
  FaBell,
  FaFolder,
  FaFolderOpen,
  FaShare,
  FaReply
} from "react-icons/fa";
import { DeleteButton, Grid, GridItem, formats } from "features/common";
import { TopicMessageForm } from "features/forms/TopicMessageForm";
import { ModalState } from "features/modals/EntityNotifModal";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { ITopic } from "models/Topic";
import * as dateUtils from "utils/date";
import { TopicMessagesList } from "./TopicMessagesList";
import { TopicsListItemVisibility } from "./TopicsListItemVisibility";
import { TopicsListItemSubscribers } from "./TopicsListItemSubscribers";
import { TopicsListItemShare } from "./TopicsListItemShare";
import { useScroll } from "hooks/useScroll";

export const TopicsListItem = ({
  session,
  event,
  org,
  query,
  currentTopicName,
  isSubscribed,
  topic,
  topicIndex,
  isSubbedToTopic,
  isCurrent,
  isTopicCreator,
  isDark,
  isLoading,
  selectedCategories,
  setSelectedCategories,
  onClick,
  onEditClick,
  onDeleteClick,
  onSendClick,
  onSubscribeClick,
  onLoginClick
}: {
  session: Session | null;
  event?: IEvent;
  org?: IOrg;
  query: any;
  currentTopicName?: string;
  isSubscribed: boolean;
  topic: ITopic;
  topicIndex: number;
  isSubbedToTopic: boolean;
  isCurrent: boolean;
  isTopicCreator: boolean;
  isDark: boolean;
  isLoading: boolean;
  selectedCategories?: string[];
  setSelectedCategories: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >;
  onClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onSendClick: () => void;
  onSubscribeClick: () => void;
  onLoginClick: () => void;
}) => {
  const hasCategorySelected = !!selectedCategories?.find(
    (category) => category === topic.topicCategory
  );
  const { timeAgo, fullDate } = dateUtils.timeAgo(topic.createdAt, true);
  const topicCreatedByUserName =
    typeof topic.createdBy === "object"
      ? topic.createdBy.userName || topic.createdBy.email?.replace(/@.+/, "")
      : "";

  const [executeScroll, elementToScrollRef] = useScroll<HTMLDivElement>();
  useEffect(() => {
    if (!query.isLoading && currentTopicName === topic.topicName) {
      executeScroll();
    }
  }, [query.isLoading]);

  return (
    <Box mb={5} ref={elementToScrollRef}>
      <Link as="div" variant="no-underline" onClick={onClick} data-cy="topic">
        <Flex
          //flexDirection="column"
          flexWrap="wrap"
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
          _hover={{ bg: isDark ? "#314356" : "blue.100" }}
        >
          <Flex flexDirection="column" flexGrow={1} px={3} py={1}>
            <Flex>
              {isCurrent ? (
                <Icon
                  as={FaFolderOpen}
                  boxSize={6}
                  color={isDark ? "teal.200" : "teal"}
                  mr={2}
                />
              ) : (
                <Icon
                  as={FaFolder}
                  boxSize={6}
                  color={isDark ? "teal.200" : "teal"}
                  mr={2}
                />
              )}

              {topic.topicCategory && (
                <Tooltip
                  label={
                    !hasCategorySelected
                      ? `Afficher les discussions de la catégorie ${topic.topicCategory}`
                      : ""
                  }
                  hasArrow
                >
                  <Button
                    colorScheme={hasCategorySelected ? "pink" : undefined}
                    fontSize="small"
                    fontWeight="normal"
                    height="auto"
                    mr={2}
                    p={1}
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
                    {topic.topicCategory}
                  </Button>
                </Tooltip>
              )}

              <Link variant="no-underline" fontWeight="bold">
                {topic.topicName}
              </Link>
            </Flex>

            <Flex
              flexWrap="wrap"
              fontSize="smaller"
              color={isDark ? "white" : "purple"}
              ml={8}
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
                label={`Discussion ajoutée le ${fullDate}`}
              >
                <Text
                  cursor="default"
                  _hover={{
                    color: isDark ? "white" : "white"
                  }}
                >
                  {timeAgo}
                </Text>
              </Tooltip>

              <Box as="span" aria-hidden mx={1}>
                ·
              </Box>

              <TopicsListItemVisibility event={event} org={org} topic={topic} />

              <Box as="span" aria-hidden mx={1}>
                ·
              </Box>

              <TopicsListItemShare aria-label="Partager" topic={topic} />

              {topic.topicNotified && isTopicCreator && (
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
                      onSendClick();
                    }}
                  >
                    {topic.topicNotified.length} personnes invitées
                  </Link>
                </>
              )}
            </Flex>
          </Flex>

          <Flex alignItems="center" mb={-1} ml={2}>
            {isLoading && <Spinner mr={3} mt={1} mb={2} />}

            {!isLoading && session && isTopicCreator && (
              <>
                <Tooltip placement="bottom" label="Envoyer des invitations">
                  <IconButton
                    aria-label="Envoyer des invitations"
                    icon={<EmailIcon />}
                    variant="outline"
                    colorScheme="blue"
                    mr={3}
                    mt={1}
                    mb={2}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSendClick();
                    }}
                  />
                </Tooltip>

                <Tooltip placement="bottom" label="Modifier la discussion">
                  <IconButton
                    aria-label="Modifier la discussion"
                    icon={<EditIcon />}
                    variant="outline"
                    colorScheme="green"
                    mr={3}
                    mt={1}
                    mb={2}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClick();
                    }}
                  />
                </Tooltip>

                <DeleteButton
                  isIconOnly
                  // tooltip props
                  placement="bottom"
                  // other props
                  header={
                    <>
                      Êtes vous sûr de vouloir supprimer la discussion
                      <Text display="inline" color="red" fontWeight="bold">
                        {` ${topic.topicName}`}
                      </Text>{" "}
                      ?
                    </>
                  }
                  isSmall={false}
                  variant="outline"
                  mr={3}
                  mt={1}
                  mb={2}
                  onClick={onDeleteClick}
                  data-cy="delete-topic"
                />
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
                      mt={1}
                      mb={2}
                      onClick={async (e) => {
                        e.stopPropagation();
                        onSubscribeClick();
                      }}
                      data-cy={
                        isSubbedToTopic
                          ? "topic-unsubscribe"
                          : "topic-subscribe"
                      }
                    />
                  </Tooltip>
                )}

                <Tooltip label="Répondre">
                  <IconButton
                    aria-label="Répondre"
                    icon={<FaReply />}
                    colorScheme="green"
                    mr={2}
                    mt={1}
                    mb={2}
                  />
                </Tooltip>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Link>

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

          <GridItem light={{ bg: "orange.50" }} dark={{ bg: "gray.700" }}>
            <TopicMessagesList query={query} topic={topic} pt={3} px={3} />
          </GridItem>

          <GridItem
            light={{ bg: "orange.50" }}
            dark={{ bg: "gray.700" }}
            pb={3}
            borderBottomRadius="xl"
          >
            <TopicMessageForm
              event={event}
              org={org}
              topic={topic}
              formats={formats.filter((f) => f !== "size")}
              isDisabled={topic.topicMessagesDisabled}
              onLoginClick={onLoginClick}
              onSubmit={() => query.refetch()}
            />
          </GridItem>
        </>
      )}
    </Box>
  );
};
