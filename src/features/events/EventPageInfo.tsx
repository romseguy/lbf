import { SmallAddIcon } from "@chakra-ui/icons";
import { IconButton, Text, Tooltip } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import React from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { EntityInfo } from "features/common";
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
        <Tooltip
          placement="right"
          label={`Ajouter des coordonnées à l'événement`}
        >
          <IconButton
            aria-label={`Ajouter des coordonnées à l'événement`}
            alignSelf="flex-start"
            colorScheme="teal"
            icon={
              <>
                <SmallAddIcon />
                <FaMapMarkedAlt />
              </>
            }
            pr={1}
            onClick={() => setIsEdit(true)}
          />
        </Tooltip>
      ) : (
        <Text fontStyle="italic">Aucunes coordonnées.</Text>
      )}
    </>
  );
};
