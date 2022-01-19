import { AtSignIcon, Icon } from "@chakra-ui/icons";
import { Heading, Box, VStack, Flex } from "@chakra-ui/react";
import React from "react";
import {
  GridItem,
  Grid,
  GridHeader,
  EntityButton,
  Link
} from "features/common";
import { IEvent } from "models/Event";
import { hasItems } from "utils/array";

export const EventPageOrgs = ({ event }: { event: IEvent }) => {
  return (
    <GridItem
      light={{ bg: "orange.100" }}
      dark={{ bg: "gray.600" }}
      borderTopRadius="lg"
    >
      <Grid templateRows="auto 1fr">
        <GridHeader borderTopRadius="lg" alignItems="center">
          <Heading size="sm" py={3}>
            Organisateurs
          </Heading>
        </GridHeader>

        <GridItem light={{ bg: "orange.100" }} dark={{ bg: "gray.600" }}>
          <Box p={5}>
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
          </Box>
        </GridItem>
      </Grid>
    </GridItem>
  );
};
