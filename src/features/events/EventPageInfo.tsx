import { AddIcon } from "@chakra-ui/icons";
import { Text } from "@chakra-ui/react";
import React from "react";
import { EntityInfo, Button } from "features/common";
import { IEvent } from "models/Event";
import { hasItems } from "utils/array";
import { AppQueryWithData } from "utils/types";

export const EventPageInfo = ({
  eventQuery,
  isCreator,
  setIsEdit
}: {
  eventQuery: AppQueryWithData<IEvent>;
  isCreator: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const event = eventQuery.data;
  const hasInfo =
    hasItems(event.eventAddress) ||
    hasItems(event.eventEmail) ||
    hasItems(event.eventPhone) ||
    hasItems(event.eventWeb);

  return (
    <>
      {hasInfo ? (
        <EntityInfo event={event} />
      ) : isCreator ? (
        <Button
          alignSelf="flex-start"
          colorScheme="teal"
          leftIcon={<AddIcon />}
          onClick={() => setIsEdit(true)}
        >
          Ajouter
        </Button>
      ) : (
        <Text fontStyle="italic">Aucunes coordonnées.</Text>
      )}
    </>
  );
};
