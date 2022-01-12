import { EditIcon, AddIcon } from "@chakra-ui/icons";
import { Button, Heading, Tooltip, IconButton, Text } from "@chakra-ui/react";
import DOMPurify from "dompurify";
import React from "react";
import { GridItem, GridHeader } from "features/common";
import { IEvent } from "models/Event";

export const EventPageDescription = ({
  event,
  isCreator,
  setIsEdit
}: {
  event: IEvent;
  isCreator: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <GridItem
      rowSpan={3}
      borderTopRadius="lg"
      light={{ bg: "orange.100" }}
      dark={{ bg: "gray.600" }}
    >
      <GridHeader display="flex" alignItems="center" borderTopRadius="lg">
        <Heading size="sm" py={3}>
          Présentation de l'événement
        </Heading>
        {event.eventDescription && isCreator && (
          <Tooltip placement="bottom" label="Modifier la présentation">
            <IconButton
              aria-label="Modifier la présentation"
              icon={<EditIcon />}
              bg="transparent"
              _hover={{ color: "green" }}
              onClick={() => setIsEdit(true)}
            />
          </Tooltip>
        )}
      </GridHeader>

      <GridItem p={5}>
        {event.eventDescription && event.eventDescription.length > 0 ? (
          <div className="rteditor">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(event.eventDescription, {
                  ADD_TAGS: ["iframe"]
                })
              }}
            />
          </div>
        ) : isCreator ? (
          <Button
            colorScheme="teal"
            leftIcon={<AddIcon />}
            onClick={() => setIsEdit(true)}
          >
            Ajouter
          </Button>
        ) : (
          <Text fontStyle="italic">Aucune présentation.</Text>
        )}
      </GridItem>
    </GridItem>
  );
};
