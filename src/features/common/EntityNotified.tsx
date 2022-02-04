import {
  Box,
  Button,
  Table,
  Tbody,
  Tr,
  Td,
  Tag,
  Text,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { Session } from "next-auth";
import React from "react";
import { IEvent } from "models/Event";
import { StatusTypes, StatusTypesV } from "models/Project";
import { ITopic } from "models/Topic";

export const EntityNotified = ({
  event,
  topic,
  query,
  mutation,
  session
}: {
  event?: IEvent<string | Date>;
  topic?: ITopic;
  query: any;
  mutation: any;
  session: Session;
}) => {
  return (
    <Box
      light={{ bg: "orange.100" }}
      dark={{ bg: "gray.500" }}
      overflowX="auto"
    >
      {!(event?.eventNotifications || topic?.topicNotifications) ||
      (Array.isArray(event?.eventNotifications) &&
        !event?.eventNotifications.length) ||
      (Array.isArray(topic?.topicNotifications) &&
        !topic?.topicNotifications.length) ? (
        <Alert status="info">
          <AlertIcon />
          <Text>Aucune invitations envoyées</Text>
        </Alert>
      ) : (
        <>
          {session.user.isAdmin && (
            <Button
              onClick={async () => {
                if (event)
                  await mutation({
                    eventUrl: event.eventUrl,
                    payload: { eventNotifications: [] }
                  }).unwrap();
                else if (topic)
                  await mutation({
                    topicId: topic._id,
                    payload: { topic: { topicNotifications: [] } }
                  }).unwrap();

                query.refetch();
              }}
            >
              RAZ
            </Button>
          )}

          <Table>
            <Tbody>
              {(
                event?.eventNotifications ||
                topic?.topicNotifications ||
                []
              ).map(({ email: e, status = StatusTypes.PENDING }) => {
                return (
                  <Tr key={e}>
                    <Td>{e}</Td>
                    <Td>
                      <Tag
                        variant="solid"
                        colorScheme={
                          status === StatusTypes.PENDING
                            ? "blue"
                            : status === StatusTypes.OK
                            ? "green"
                            : "red"
                        }
                      >
                        {StatusTypesV[status]}
                      </Tag>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </>
      )}
    </Box>
  );
};
