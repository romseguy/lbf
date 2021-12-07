import { EditIcon, AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Heading,
  Tooltip,
  IconButton,
  Box,
  Text
} from "@chakra-ui/react";
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
          Description de l'événement
        </Heading>
        {event.eventDescription && isCreator && (
          <Tooltip placement="bottom" label="Modifier la description">
            <IconButton
              aria-label="Modifier la description"
              icon={<EditIcon />}
              bg="transparent"
              _hover={{ color: "green" }}
              onClick={() => setIsEdit(true)}
            />
          </Tooltip>
        )}
      </GridHeader>

      <GridItem>
        <Box className="ql-editor" p={5}>
          {event.eventDescription && event.eventDescription.length > 0 ? (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(event.eventDescription)
              }}
            />
          ) : isCreator ? (
            <Button
              colorScheme="teal"
              leftIcon={<AddIcon />}
              onClick={() => setIsEdit(true)}
            >
              Ajouter
            </Button>
          ) : (
            <Text fontStyle="italic">Aucune description.</Text>
          )}
        </Box>
      </GridItem>
    </GridItem>
  );
};
