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
    <Flex flexDirection="row" flexWrap="wrap" mt={-3} {...props}>
      <Box flexGrow={1} mt={3}>
        {!showNextEvents && (
          <>
            {!showPreviousEvents && previousEvents.length > 0 && (
              <Button
                colorScheme="teal"
                fontSize="smaller"
                height={7}
                leftIcon={<ArrowBackIcon />}
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
                colorScheme="teal"
                fontSize="smaller"
                height={7}
                leftIcon={showNextEvents ? <ArrowBackIcon /> : undefined}
                rightIcon={!showNextEvents ? <ArrowForwardIcon /> : undefined}
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
                height={7}
                leftIcon={showNextEvents ? <ArrowBackIcon /> : undefined}
                rightIcon={!showNextEvents ? <ArrowForwardIcon /> : undefined}
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
