import { ViewIcon, ViewOffIcon, EditIcon, EmailIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Link,
  Spinner,
  Text,
  Tooltip
} from "@chakra-ui/react";
import { Session } from "next-auth";
import React from "react";
import { FaBellSlash, FaBell } from "react-icons/fa";
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

export const TopicsListItem = ({
  session,
  event,
  org,
  query,
  isSubscribed,
  topic,
  topicIndex,
  isSubbedToTopic,
  isCurrent,
  isTopicCreator,
  isDark,
  isLoading,
  notifyModalState,
  setNotifyModalState,
  selectedCategories,
  setSelectedCategories,
  onClick,
  onEditClick,
  onDeleteClick,
  onSubscribeClick,
  onLoginClick
}: {
  session: Session | null;
  event?: IEvent;
  org?: IOrg;
  query: any;
  isSubscribed: boolean;
  topic: ITopic;
  topicIndex: number;
  isSubbedToTopic: boolean;
  isCurrent: boolean;
  isTopicCreator: boolean;
  isDark: boolean;
  isLoading: boolean;
  notifyModalState: ModalState<ITopic>;
  setNotifyModalState: React.Dispatch<React.SetStateAction<ModalState<ITopic>>>;
  selectedCategories?: string[];
  setSelectedCategories: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >;
  onClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onSubscribeClick: () => void;
  onLoginClick: () => void;
}) => {
  const { timeAgo, fullDate } = dateUtils.timeAgo(topic.createdAt, true);
  const topicCreatedByUserName =
    typeof topic.createdBy === "object"
      ? topic.createdBy.userName || topic.createdBy.email?.replace(/@.+/, "")
      : "";

  return (
    <Box key={topic._id} mb={5}>
      <GridItem>
        <Link as="div" variant="no-underline" onClick={onClick} data-cy="topic">
          <Grid
            templateColumns="auto 1fr auto"
            borderTopRadius="xl"
            borderBottomRadius={!isCurrent ? "lg" : undefined}
            light={{
              bg: topicIndex % 2 === 0 ? "orange.200" : "orange.100",
              _hover: { bg: "orange.300" }
            }}
            dark={{
              bg: topicIndex % 2 === 0 ? "gray.600" : "gray.500",
              _hover: { bg: "gray.400" }
            }}
          >
            <GridItem display="flex" alignItems="center" p={3}>
              {isCurrent ? (
                <ViewOffIcon boxSize={6} />
              ) : (
                <ViewIcon boxSize={6} />
              )}
            </GridItem>

            <GridItem lineHeight={1} py={3} data-cy="topicHeader">
              <Flex flexDirection="column">
                <Flex alignItems="center">
                  {topic.topicCategory && (
                    <Tooltip
                      label={`Afficher les discussions de la catégorie ${topic.topicCategory}`}
                      hasArrow
                    >
                      <Button
                        colorScheme={
                          selectedCategories?.find(
                            (category) => category === topic.topicCategory
                          )
                            ? "pink"
                            : undefined
                        }
                        fontSize="small"
                        fontWeight="normal"
                        height="auto"
                        mr={2}
                        p={1}
                        onClick={(e) => {
                          e.stopPropagation();

                          if (
                            selectedCategories?.find(
                              (category) => category === topic.topicCategory
                            )
                          )
                            setSelectedCategories(
                              selectedCategories.filter(
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

                  <Link fontWeight="bold">{topic.topicName}</Link>
                </Flex>

                <Flex
                  alignItems="center"
                  flexWrap="wrap"
                  fontSize="smaller"
                  color={isDark ? "white" : "purple"}
                  mt={1}
                >
                  <Link href={`/${topicCreatedByUserName}`}>
                    {topicCreatedByUserName}
                  </Link>

                  <span aria-hidden>·</span>

                  <Tooltip placement="bottom" label={fullDate}>
                    <Text mx={1}>{timeAgo}</Text>
                  </Tooltip>

                  <span aria-hidden>·</span>

                  <TopicsListItemVisibility
                    event={event}
                    org={org}
                    topicVisibility={topic.topicVisibility}
                    ml={1}
                  />

                  {topic.topicNotified && isTopicCreator && (
                    <>
                      <span aria-hidden>·</span>

                      <Link
                        as="span"
                        ml={1}
                        onClick={(e) => {
                          e.stopPropagation();
                          setNotifyModalState({
                            ...notifyModalState,
                            entity: topic
                          });
                        }}
                      >
                        {topic.topicNotified.length} personnes invitées
                      </Link>
                    </>
                  )}
                </Flex>
              </Flex>
            </GridItem>

            <GridItem display="flex" alignItems="center">
              {isLoading ? (
                <Spinner mr={3} boxSize={4} />
              ) : session ? (
                <>
                  {isTopicCreator && (
                    <>
                      {topic.topicVisibility && isTopicCreator && (
                        <>
                          <Tooltip
                            placement="bottom"
                            label="Envoyer des invitations"
                          >
                            <IconButton
                              aria-label="Envoyer des invitations"
                              icon={<EmailIcon />}
                              bg="transparent"
                              height="auto"
                              minWidth={0}
                              _hover={{ color: "green" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setNotifyModalState({
                                  ...notifyModalState,
                                  entity: topic
                                });
                              }}
                            />
                          </Tooltip>

                          <Box aria-hidden mx={1}>
                            ·{" "}
                          </Box>
                        </>
                      )}

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
                            onEditClick();
                          }}
                        />
                      </Tooltip>

                      <Box aria-hidden mx={1}>
                        ·{" "}
                      </Box>

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
                            Êtes vous sûr de vouloir supprimer la discussion
                            <Text
                              display="inline"
                              color="red"
                              fontWeight="bold"
                            >
                              {` ${topic.topicName}`}
                            </Text>{" "}
                            ?
                          </>
                        }
                        onClick={onDeleteClick}
                        data-cy="deleteTopic"
                      />

                      <Box aria-hidden mx={1}>
                        ·
                      </Box>
                    </>
                  )}

                  <Tooltip
                    label={
                      isSubbedToTopic
                        ? "Vous recevez une notification lorsque quelqu'un répond à cette discussion."
                        : "Recevoir un e-mail et une notification lorsque quelqu'un répond à cette discussion."
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
                        icon={isSubbedToTopic ? <FaBellSlash /> : <FaBell />}
                        bg="transparent"
                        height="auto"
                        minWidth={0}
                        mr={3}
                        _hover={{
                          color: isDark ? "lightgreen" : "white"
                        }}
                        onClick={async (e) => {
                          e.stopPropagation();
                          onSubscribeClick();
                        }}
                        data-cy={
                          isSubbedToTopic
                            ? "topicUnsubscribe"
                            : "topicSubscribe"
                        }
                      />
                    </span>
                  </Tooltip>
                </>
              ) : null}
            </GridItem>
          </Grid>
        </Link>
        {isCurrent && (
          <>
            <GridItem bg={isDark ? "gray.600" : "gray.200"} px={3} py={2}>
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
                onLoginClick={onLoginClick}
                onSubmit={() => query.refetch()}
              />
            </GridItem>
          </>
        )}
      </GridItem>
    </Box>
  );
};
