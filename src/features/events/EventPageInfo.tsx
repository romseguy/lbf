import { EditIcon, AddIcon } from "@chakra-ui/icons";
import { Grid, Heading, Box } from "@chakra-ui/layout";
import { Tooltip, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { GridHeader, GridItem, EntityInfo, Button } from "features/common";
import { IEvent } from "models/Event";
import { hasItems } from "utils/array";

export const EventPageInfo = ({
  event,
  isCreator,
  setIsEdit
}: {
  event: IEvent;
  isCreator: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const hasInfo =
    hasItems(event.eventAddress) ||
    hasItems(event.eventEmail) ||
    hasItems(event.eventPhone) ||
    hasItems(event.eventWeb);

  return (
    <GridItem
      light={{ bg: "orange.100" }}
      dark={{ bg: "gray.600" }}
      borderTopRadius="lg"
    >
      <Grid templateRows="auto 1fr">
        <GridHeader display="flex" alignItems="center" borderTopRadius="lg">
          <Heading size="sm" py={3}>
            Coordonnées
          </Heading>
          {hasInfo && isCreator && (
            <Tooltip placement="bottom" label="Modifier les coordonnées">
              <IconButton
                aria-label="Modifier les coordonnées"
                icon={<EditIcon />}
                bg="transparent"
                _hover={{ color: "green" }}
                onClick={() => setIsEdit(true)}
              />
            </Tooltip>
          )}
        </GridHeader>

        <GridItem light={{ bg: "orange.100" }} dark={{ bg: "gray.600" }}>
          <Box p={5}>
            {hasInfo ? (
              <EntityInfo event={event} />
            ) : isCreator ? (
              <Button
                colorScheme="teal"
                leftIcon={<AddIcon />}
                onClick={() => setIsEdit(true)}
              >
                Ajouter
              </Button>
            ) : (
              <Text fontStyle="italic">Aucunes coordonnées.</Text>
            )}
          </Box>
        </GridItem>
      </Grid>
    </GridItem>
  );
};
