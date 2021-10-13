import { Box, Button, Flex } from "@chakra-ui/react";
import React from "react";
import { Link } from "features/common";
import { IEvent } from "models/Event";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

export const EventsListToggle = ({
  previousEvents,
  showPreviousEvents,
  setShowPreviousEvents,
  currentEvents,
  nextEvents,
  showNextEvents,
  setShowNextEvents
}: {
  previousEvents: IEvent<Date>[];
  showPreviousEvents: boolean;
  setShowPreviousEvents: (show: boolean) => void;
  currentEvents: IEvent<Date>[];
  nextEvents: IEvent<Date>[];
  showNextEvents: boolean;
  setShowNextEvents: (show: boolean) => void;
}) => {
  return (
    <Flex justifyContent="space-between">
      <Box>
        {!showNextEvents && (
          <>
            {!showPreviousEvents && previousEvents.length > 0 && (
              <Button
                colorScheme="pink"
                fontSize="smaller"
                height={7}
                leftIcon={<ArrowBackIcon />}
                mb={3}
                mt={2}
                onClick={() => {
                  setShowPreviousEvents(true);
                }}
              >
                Voir les événéments précédents
              </Button>
            )}

            {showPreviousEvents && (
              <Button
                colorScheme="pink"
                fontSize="smaller"
                height={7}
                rightIcon={<ArrowForwardIcon />}
                mb={3}
                mt={2}
                onClick={() => {
                  setShowPreviousEvents(false);
                }}
              >
                Revenir aux événements de cette semaine
              </Button>
            )}
          </>
        )}
      </Box>

      <Box>
        {!showPreviousEvents && (
          <>
            {nextEvents.length > 0 && (
              <Button
                colorScheme="pink"
                fontSize="smaller"
                height={7}
                leftIcon={showNextEvents ? <ArrowBackIcon /> : undefined}
                rightIcon={!showNextEvents ? <ArrowForwardIcon /> : undefined}
                mb={3}
                mt={2}
                onClick={() => {
                  setShowNextEvents(!showNextEvents);
                }}
              >
                {showNextEvents
                  ? "Revenir aux événements de cette semaine"
                  : "Voir les événéments suivants"}
              </Button>
            )}
          </>
        )}
      </Box>
    </Flex>
  );
};
