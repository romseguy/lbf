import {
  Table,
  Tbody,
  Tr,
  Td,
  Tag,
  Text,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import React from "react";
import { Column, AppHeading } from "features/common";
import { IEntity, isEvent, isTopic } from "models/Entity";
import { EEventInviteStatus, EventInviteStatuses } from "models/Event";
import { IEventNotification, ITopicNotification } from "models/INotification";
import { hasItems } from "utils/array";
import { timeAgo } from "utils/date";

export const EntityNotified = ({ entity }: { entity?: IEntity }) => {
  const isE = isEvent(entity);
  const isT = isTopic(entity);
  const notifications = isE
    ? entity.eventNotifications
    : isT
    ? entity.topicNotifications
    : [];

  return (
    <>
      {!hasItems(notifications) ? (
        <Alert status="info">
          <AlertIcon />
          <Text>Aucune invitations envoyées.</Text>
        </Alert>
      ) : (
        <Column overflowX="auto">
          <Table>
            <Tbody>
              {isE
                ? (notifications as IEventNotification[]).map(
                    ({ _id, email, status, createdAt }) => (
                      <Tr key={_id}>
                        <Td pl={0}>{email}</Td>
                        <Td>
                          <Tag
                            colorScheme={
                              status === EEventInviteStatus.PENDING
                                ? "blue"
                                : status === EEventInviteStatus.OK
                                ? "green"
                                : "red"
                            }
                            textAlign="center"
                          >
                            {EventInviteStatuses[status]}
                          </Tag>
                        </Td>
                        <Td>
                          {createdAt && (
                            <Tag colorScheme="green" textAlign="center">
                              Invitation envoyée le{" "}
                              {timeAgo(createdAt, true).fullDate}
                            </Tag>
                          )}
                        </Td>
                      </Tr>
                    )
                  )
                : isT
                ? (notifications as ITopicNotification[]).map(
                    ({ email: e, createdAt }) => (
                      <Tr key={e}>
                        <Td px={0}>{e}</Td>
                        <Td px={0}>
                          {createdAt && (
                            <Tag colorScheme="green" textAlign="center">
                              Invitation envoyée le{" "}
                              {timeAgo(createdAt, true).fullDate}
                            </Tag>
                          )}
                        </Td>
                      </Tr>
                    )
                  )
                : null}
            </Tbody>
          </Table>
        </Column>
      )}
    </>
  );
};
