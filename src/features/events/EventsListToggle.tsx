import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { Link } from "features/common";
import { IEvent } from "models/Event";

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
              <Link
                fontSize="smaller"
                variant="underline"
                onClick={() => {
                  // currentDate = null;
                  // currentDateP = null;
                  setShowPreviousEvents(true);
                }}
              >
                Voir les événéments précédents
              </Link>
            )}

            {showPreviousEvents &&
              (currentEvents.length > 0 || nextEvents.length > 0) && (
                <Link
                  fontSize="smaller"
                  variant="underline"
                  onClick={() => {
                    // currentDate = null;
                    // currentDateP = null;
                    setShowPreviousEvents(false);
                  }}
                >
                  Revenir aux événements de cette semaine
                </Link>
              )}
          </>
        )}
      </Box>

      <Box>
        {!showPreviousEvents && (
          <>
            {nextEvents.length > 0 && (
              <Link
                fontSize="smaller"
                variant="underline"
                onClick={() => {
                  // currentDate = null;
                  // currentDateP = null;
                  setShowNextEvents(!showNextEvents);
                }}
              >
                {showNextEvents
                  ? "Revenir aux événements de cette semaine"
                  : "Voir les événéments suivants"}
              </Link>
            )}
          </>
        )}
      </Box>
    </Flex>
  );
};
