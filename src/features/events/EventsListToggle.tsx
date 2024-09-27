import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, SpaceProps } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import React from "react";
import { css } from "twin.macro";
import { Link } from "features/common";
import { IEvent } from "models/Event";

export const EventsListToggle = ({
  previousEvents,
  showPreviousEvents,
  setShowPreviousEvents,
  currentEvents,
  ...props
}: SpaceProps & {
  previousEvents: IEvent<Date>[];
  showPreviousEvents: boolean;
  setShowPreviousEvents: (show: boolean) => void;
  currentEvents: IEvent<Date>[];
}) => {
  if (!previousEvents.length && !currentEvents.length) return null;

  return (
    <Flex flexWrap="wrap" mt={-3} {...props}>
      <Box flexGrow={1} mt={3}>
        {!showPreviousEvents && previousEvents.length > 0 && (
          <Button
            aria-label="Voir les événéments passés"
            colorScheme="pink"
            leftIcon={<ArrowBackIcon />}
            height="auto"
            fontSize="smaller"
            whiteSpace="normal"
            py={2}
            onClick={() => {
              setShowPreviousEvents(true);
            }}
          >
            Voir les événéments passés
          </Button>
        )}

        {showPreviousEvents && (
          <Button
            aria-label="Retour"
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
            Retour
          </Button>
        )}
      </Box>

      {/* <Box mt={3}>
        {!showPreviousEvents && (
          <Button
            aria-label="Revenir aux événements des 7 prochains jours"
            colorScheme="pink"
            fontSize="smaller"
            height="auto"
            py={2}
            rightIcon={<ArrowForwardIcon />}
            whiteSpace="normal"
            onClick={() => {
              //setShowNextEvents(!showNextEvents);
            }}
          >
            Retour
          </Button>
        )}
      </Box> */}
    </Flex>
  );
};
