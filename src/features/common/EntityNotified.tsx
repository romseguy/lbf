import {
  Box,
  Table,
  Tbody,
  Tr,
  Td,
  Tag,
  Text,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import React from "react";
import { Column, Heading } from "features/common";
import { EEventInviteStatus, IEvent, EventInviteStatuses } from "models/Event";
import { ITopic } from "models/Topic";
import { timeAgo } from "utils/date";
import { hasItems } from "utils/array";

export const EntityNotified = ({
  event,
  topic
}: {
  event?: IEvent<string | Date>;
  topic?: ITopic;
}) => {
  return (
    <>
      <Heading mb={3}>Historique des invitations envoyées</Heading>

      {(event && !hasItems(event?.eventNotifications)) ||
      (topic && !hasItems(topic?.topicNotifications)) ? (
        <Alert status="info">
          <AlertIcon />
          <Text>Aucune invitations envoyées.</Text>
        </Alert>
      ) : (
        <Column overflowX="auto">
          <Table>
            <Tbody>
              {event
                ? event.eventNotifications.map(
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
                : topic
                ? topic.topicNotifications.map(({ email: e, createdAt }) => (
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
                  ))
                : null}
            </Tbody>
          </Table>
        </Column>
      )}
    </>
  );
};
