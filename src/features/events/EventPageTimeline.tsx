import { Grid, Heading, Box } from "@chakra-ui/layout";
import React from "react";
import { GridHeader, GridItem } from "features/common";
import { IEvent } from "models/Event";
import { EventTimeline } from "./EventTimeline";

export const EventPageTimeline = ({ event }: { event: IEvent }) => {
  return (
    <GridItem
      light={{ bg: "orange.100" }}
      dark={{ bg: "gray.600" }}
      borderTopRadius="lg"
    >
      <Grid templateRows="auto 1fr">
        <GridHeader borderTopRadius="lg" alignItems="center">
          <Heading size="sm" py={3}>
            Quand ?
          </Heading>
        </GridHeader>

        <GridItem light={{ bg: "orange.100" }} dark={{ bg: "gray.600" }}>
          <Box ml={3} pt={3}>
            <EventTimeline event={event} />
          </Box>
        </GridItem>
      </Grid>
    </GridItem>
  );
};
