import { ViewIcon, ViewOffIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  Link,
  Spinner,
  Tag,
  Text,
  Tooltip
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaBellSlash, FaBell } from "react-icons/fa";
import { DeleteButton, Grid, GridItem, formats } from "features/common";
import { TopicMessageForm } from "features/forms/TopicMessageForm";
import { ModalState } from "features/modals/NotifyModal";
import {
  getSubscription,
  getSubscriptions
} from "features/subscriptions/subscriptionsApi";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { ISubscription } from "models/Subscription";
import { ITopic } from "models/Topic";
import { useAppDispatch } from "store";
import * as dateUtils from "utils/date";
import { TopicMessagesList } from "./TopicMessagesList";
import { TopicsListItemVisibility } from "./TopicsListItemVisibility";
import { QueryActionCreatorResult } from "@reduxjs/toolkit/dist/query/core/buildInitiate";
import api from "utils/api";
import { TopicsListItemSubscribers } from "./TopicsListItemSubscribers";

export const TopicsListItem = ({
  event,
  org,
  query,
  isSubscribed,
  topic,
  topicIndex,
  isSubbedToTopic,
  isCurrent,
  isCreator,
  isDark,
  isLoading,
  notifyModalState,
  setNotifyModalState,
  onClick,
  onEditClick,
  onDeleteClick,
  onSubscribeClick,
  onLoginClick
}: {
  event?: IEvent;
  org?: IOrg;
  query: any;
  isSubscribed: boolean;
  topic: ITopic;
  topicIndex: number;
  isSubbedToTopic: boolean;
  isCurrent: boolean;
  isCreator: boolean;
  isDark: boolean;
  isLoading: boolean;
  notifyModalState: ModalState<ITopic>;
  setNotifyModalState: React.Dispatch<React.SetStateAction<ModalState<ITopic>>>;
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
        <Link variant="no-underline" onClick={onClick} data-cy="topic">
          <Grid
            templateColumns="auto 1fr auto"
            borderTopRadius="xl"
            //borderBottomRadius="xl"
            // borderTopRadius={topicIndex === 0 ? "lg" : undefined}
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
                <ViewIcon boxSize={6} />
              ) : (
                <ViewOffIcon boxSize={6} />
              )}
            </GridItem>

            <GridItem py={3}>
              <Box lineHeight="1" data-cy="topicHeader">
                <Text fontWeight="bold">{topic.topicName}</Text>
                <Box
                  display="inline"
                  fontSize="smaller"
                  color={isDark ? "white" : "gray.600"}
                >
                  {topicCreatedByUserName}
                  <span aria-hidden> · </span>
                  <Tooltip placement="bottom" label={fullDate}>
                    <span>{timeAgo}</span>
                  </Tooltip>
                  <span aria-hidden> · </span>
                  <TopicsListItemVisibility
                    topicVisibility={topic.topicVisibility}
                  />
                  {Array.isArray(topic.topicNotified) &&
                    isCreator &&
                    (isCreator || isSubscribed) && (
                      <>
                        <span aria-hidden> · </span>
                        <Link
                          onClick={(e) => {
                            e.stopPropagation();
                            setNotifyModalState({
                              ...notifyModalState,
                              entity: topic
                            });
                          }}
                        >
                          {topic.topicNotified.length} abonnés notifiés
                        </Link>
                      </>
                    )}
                </Box>
              </Box>
            </GridItem>

            <GridItem display="flex" alignItems="center">
              {isLoading ? (
                <Spinner mr={3} boxSize={4} />
              ) : (
                <>
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
              )}
            </GridItem>
          </Grid>
        </Link>
        {isCurrent && (
          <>
            <GridItem light={{ bg: "orange.50" }} dark={{ bg: "gray.700" }}>
              <TopicMessagesList query={query} topic={topic} pt={3} px={3} />
            </GridItem>

            <GridItem
              bg={isDark ? "gray.600" : "gray.200"}
              borderRadius="lg"
              p={3}
            >
              <TopicsListItemSubscribers
                topic={topic}
                isSubbedToTopic={isSubbedToTopic}
              />
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
