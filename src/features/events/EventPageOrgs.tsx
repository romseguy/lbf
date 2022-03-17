import { VStack, Flex } from "@chakra-ui/react";
import React from "react";
import { EntityButton } from "features/common";
import { IEvent } from "models/Event";
import { hasItems } from "utils/array";
import { AppQueryWithData } from "utils/types";

export const EventPageOrgs = ({
  eventQuery
}: {
  eventQuery: AppQueryWithData<IEvent>;
}) => {
  const event = eventQuery.data;

  return (
    <>
      {hasItems(event.eventOrgs) ? (
        <VStack alignItems="flex-start" spacing={2}>
          {event.eventOrgs.map((eventOrg) => (
            <EntityButton key={eventOrg._id} org={eventOrg} p={1} />
          ))}
        </VStack>
      ) : typeof event.createdBy === "object" ? (
        <Flex alignItems="center">
          <EntityButton user={event.createdBy} />
        </Flex>
      ) : (
        "Aucun organisateurs."
      )}
    </>
  );
};
