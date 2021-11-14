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
      {!(event?.eventNotified || topic?.topicNotified) ||
      (Array.isArray(event?.eventNotified) && !event?.eventNotified.length) ||
      (Array.isArray(topic?.topicNotified) && !topic?.topicNotified.length) ? (
        <Alert status="info">
          <AlertIcon />
          <Text>Aucune invitation envoyée.</Text>
        </Alert>
      ) : (
        <>
          {session.user.isAdmin && (
            <Button
              onClick={async () => {
                if (event)
                  await mutation({
                    eventUrl: event.eventUrl,
                    payload: { eventNotified: [] }
                  }).unwrap();
                else if (topic)
                  await mutation({
                    topicId: topic._id,
                    payload: { topicNotified: [] }
                  }).unwrap();

                query.refetch();
              }}
            >
              RAZ
            </Button>
          )}

          <Table>
            <Tbody>
              {(event?.eventNotified || topic?.topicNotified || []).map(
                ({ email: e, status = StatusTypes.PENDING }) => {
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
                }
              )}
            </Tbody>
          </Table>
        </>
      )}
    </Box>
  );
};
