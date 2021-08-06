import React, { useMemo, useState } from "react";
import { Box, Icon, Text, Grid, Heading } from "@chakra-ui/react";
import { Link, GridHeader, GridItem, Spacer } from "features/common";
import {
  compareAsc,
  format,
  addDays,
  addHours,
  addWeeks,
  intervalToDuration,
  parseISO,
  formatISO,
  getMinutes,
  getDayOfYear
} from "date-fns";
import type { IEvent } from "models/Event";
import { fr } from "date-fns/locale";
import { UpDownIcon } from "@chakra-ui/icons";
import { css } from "twin.macro";
import { DescriptionModal } from "features/modals/DescriptionModal";
import DOMPurify from "isomorphic-dompurify";

const addRepeatedEvents = (events: IEvent[]) => {
  let array: IEvent[] = [];

  events.forEach((event) => {
    array.push(event);

    if (event.repeat) {
      const start = parseISO(event.eventMinDate);
      const end = parseISO(event.eventMaxDate);

      const { days = 0, hours = 0 } = intervalToDuration({
        start,
        end
      });

      for (let i = 1; i <= event.repeat; i++) {
        const eventMinDate = addWeeks(start, i);
        const eventMaxDate = addDays(addHours(eventMinDate, hours), days);
        array.push({
          ...event,
          eventMinDate: formatISO(eventMinDate),
          eventMaxDate: formatISO(eventMaxDate),
          repeat: event.repeat + i
        });
      }
    }
  });

  return array;
};

type EventsProps = {
  events: IEvent[];
  eventHeader?: any;
};

export const EventsList = (props: EventsProps) => {
  let currentDate: Date | undefined;
  let addGridHeader = true;

  const [isDescriptionOpen, setIsDescriptionOpen] = useState<{
    [key: string]: boolean;
  }>({});

  const events = useMemo(() => {
    const repeatedEvents = addRepeatedEvents(props.events).sort((a, b) =>
      compareAsc(parseISO(a.eventMinDate), parseISO(b.eventMinDate))
    );

    return repeatedEvents.map((event, index) => {
      const minDate = parseISO(event.eventMinDate);
      const maxDate = parseISO(event.eventMaxDate);

      const isCurrentDateOneDayBeforeMinDate = currentDate
        ? getDayOfYear(currentDate) < getDayOfYear(minDate)
        : true;

      if (isCurrentDateOneDayBeforeMinDate) {
        addGridHeader = true;
        currentDate = minDate;
      } else {
        addGridHeader = false;
      }

      return (
        <div key={`${event._id}${event.repeat}`}>
          <Grid
            templateRows="auto auto 4fr"
            templateColumns="1fr 6fr minmax(75px, 1fr)"
          >
            {addGridHeader ? (
              props.eventHeader ? (
                props.eventHeader
              ) : (
                <GridHeader
                  colSpan={3}
                  borderTopRadius={index === 0 ? "lg" : undefined}
                >
                  <Heading size="sm" py={3}>
                    {format(minDate, "cccc d MMMM", { locale: fr })}
                  </Heading>
                </GridHeader>
              )
            ) : (
              <GridItem colSpan={3}>
                <Spacer borderWidth={1} />
              </GridItem>
            )}
            <GridItem
              rowSpan={2}
              light={{ bg: "orange.100" }}
              dark={{ bg: "gray.500" }}
            >
              <Box pt={2} pl={2} pr={2}>
                <Text pb={1}>
                  {format(
                    minDate,
                    `H'h'${getMinutes(minDate) !== 0 ? "mm" : ""}`,
                    { locale: fr }
                  )}
                </Text>
                <Icon as={UpDownIcon} />
                <Text pt={2}>
                  {format(
                    maxDate,
                    `H'h'${getMinutes(maxDate) !== 0 ? "mm" : ""}`,
                    { locale: fr }
                  )}
                </Text>
              </Box>
            </GridItem>
            <GridItem light={{ bg: "white" }} dark={{ bg: "dark" }}>
              <Box pt={2} pl={3}>
                <Link
                  className="rainbow-text"
                  css={css`
                    letter-spacing: 0.1em;
                  `}
                  size="larger"
                  href={`/${encodeURIComponent(event.eventName)}`}
                >
                  {event.eventName}
                </Link>
              </Box>
            </GridItem>
            <GridItem
              rowSpan={2}
              light={{ bg: "orange.100" }}
              dark={{ bg: "gray.500" }}
            >
              <Text pt={2} pl={2}>
                {event.eventCity || "À définir"}
              </Text>
            </GridItem>
            <GridItem
              p={0}
              m={0}
              pl={3}
              light={{ bg: "white" }}
              dark={{ bg: "dark" }}
            >
              {event.eventDescription && event.eventDescription.length > 0 ? (
                <Link
                  variant="underline"
                  onClick={() =>
                    setIsDescriptionOpen({
                      ...isDescriptionOpen,
                      [event.eventName]: true
                    })
                  }
                >
                  Voir l'affiche de l'événement
                </Link>
              ) : (
                <Text fontSize="smaller" pl={3} py={2}>
                  Aucune affiche disponible.
                </Text>
              )}
            </GridItem>
          </Grid>

          <DescriptionModal
            defaultIsOpen={false}
            isOpen={isDescriptionOpen[event.eventName]}
            onClose={() => {
              setIsDescriptionOpen({
                ...isDescriptionOpen,
                [event.eventName]: false
              });
            }}
            header={
              <Link
                href={`/${encodeURIComponent(event.eventName)}`}
                css={css`
                  letter-spacing: 0.1em;
                `}
                size="larger"
                className="rainbow-text"
              >
                {event.eventName}
              </Link>
            }
          >
            {event.eventDescription &&
            event.eventDescription.length > 0 &&
            event.eventDescription !== "<p><br></p>" ? (
              <div className="ql-editor">
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(event.eventDescription)
                  }}
                />
              </div>
            ) : (
              <Text fontStyle="italic">Aucune description.</Text>
            )}
          </DescriptionModal>
        </div>
      );
    });
  }, [props.events, isDescriptionOpen]);

  return <div>{events}</div>;
};
