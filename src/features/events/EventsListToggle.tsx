import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, SpaceProps } from "@chakra-ui/react";
import React from "react";
import { css } from "twin.macro";
import { Link } from "features/common";
import { IEvent } from "models/Event";

export const EventsListToggle = ({
  previousEvents,
  showPreviousEvents,
  setShowPreviousEvents,
  currentEvents,
  nextEvents,
  showNextEvents,
  setShowNextEvents,
  ...props
}: SpaceProps & {
  previousEvents: IEvent<Date>[];
  showPreviousEvents: boolean;
  setShowPreviousEvents: (show: boolean) => void;
  currentEvents: IEvent<Date>[];
  nextEvents: IEvent<Date>[];
  showNextEvents: boolean;
  setShowNextEvents: (show: boolean) => void;
}) => {
  if (!previousEvents.length && !currentEvents.length && !nextEvents.length)
    return null;

  return (
    <Flex flexWrap="wrap" mt={-3} {...props}>
      <Box flexGrow={1} mt={3}>
        {!showNextEvents && (
          <>
            {!showPreviousEvents && previousEvents.length > 0 && (
              <Button
                colorScheme="pink"
                fontSize="smaller"
                height="auto"
                py={2}
                leftIcon={<ArrowBackIcon />}
                whiteSpace="normal"
                onClick={() => {
                  setShowPreviousEvents(true);
                }}
              >
                Voir les événéments passés
              </Button>
            )}

            {showPreviousEvents && (
              <Button
                colorScheme="pink"
                fontSize="smaller"
                height="auto"
                py={2}
                rightIcon={<ArrowForwardIcon />}
                whiteSpace="normal"
                onClick={() => {
                  setShowPreviousEvents(false);
                }}
              >
                Revenir aux événements des 7 prochains jours
              </Button>
            )}
          </>
        )}
      </Box>

      <Box mt={3}>
        {!showPreviousEvents && (
          <>
            {!showNextEvents && nextEvents.length > 0 && (
              <Button
                colorScheme="pink"
                fontSize="smaller"
                height="auto"
                py={2}
                leftIcon={showNextEvents ? <ArrowBackIcon /> : undefined}
                rightIcon={!showNextEvents ? <ArrowForwardIcon /> : undefined}
                whiteSpace="normal"
                onClick={() => {
                  setShowNextEvents(!showNextEvents);
                }}
              >
                Voir les événéments suivants
              </Button>
            )}

            {showNextEvents && (
              <Button
                colorScheme="pink"
                fontSize="smaller"
                height="auto"
                py={2}
                leftIcon={showNextEvents ? <ArrowBackIcon /> : undefined}
                rightIcon={!showNextEvents ? <ArrowForwardIcon /> : undefined}
                whiteSpace="normal"
                onClick={() => {
                  setShowNextEvents(!showNextEvents);
                }}
              >
                Revenir aux événements des 7 prochains jours
              </Button>
            )}
          </>
        )}
      </Box>
    </Flex>
  );
};
