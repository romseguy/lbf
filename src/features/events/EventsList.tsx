import React, { useMemo, useState } from "react";
import {
  Box,
  Icon,
  Text,
  Grid,
  Heading,
  Tooltip,
  Flex
} from "@chakra-ui/react";
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
  getDayOfYear,
  getDay
} from "date-fns";
import { IEvent, Visibility } from "models/Event";
import { fr } from "date-fns/locale";
import { EmailIcon, LockIcon, UpDownIcon } from "@chakra-ui/icons";
import { css } from "twin.macro";
import { DescriptionModal } from "features/modals/DescriptionModal";
import DOMPurify from "isomorphic-dompurify";
import { FaGlobeEurope } from "react-icons/fa";

const EventVisibility = ({ eventVisibility }: { eventVisibility?: string }) =>
  eventVisibility === Visibility.SUBSCRIBERS ? (
    <Tooltip label="Événement réservé aux adhérents">
      <LockIcon boxSize={4} />
    </Tooltip>
  ) : // : topicVisibility === Visibility.FOLLOWERS ? (
  //   <Tooltip label="Événement réservé aux abonnés">
  //     <EmailIcon boxSize={4} />
  //   </Tooltip>
  // )
  eventVisibility === Visibility.PUBLIC ? (
    <Tooltip label="Événement visible par tous">
      <span>
        <Icon as={FaGlobeEurope} boxSize={4} />
      </span>
    </Tooltip>
  ) : null;

type EventsProps = {
  events: IEvent[];
  eventHeader?: any;
  isCreator?: boolean;
  isSubscribed?: boolean;
};

export const EventsList = (props: EventsProps) => {
  let currentDate: Date | undefined;
  let addGridHeader = true;

  const [isDescriptionOpen, setIsDescriptionOpen] = useState<{
    [key: string]: boolean;
  }>({});

  const addRepeatedEvents = (events: IEvent[]) => {
    let array: IEvent[] = [];

    events.forEach((event) => {
      if (
        props.isCreator ||
        event.eventVisibility === Visibility.PUBLIC ||
        (event.eventVisibility === Visibility.SUBSCRIBERS && props.isSubscribed)
      ) {
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
      }
    });

    return array;
  };

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
                  {getDay(minDate) !== getDay(maxDate) &&
                    format(maxDate, `EEEE`, { locale: fr })}{" "}
                  {format(
                    maxDate,
                    `H'h'${getMinutes(maxDate) !== 0 ? "mm" : ""}`,
                    { locale: fr }
                  )}
                </Text>
              </Box>
            </GridItem>
            <GridItem
              light={{ bg: "white" }}
              dark={{ bg: "dark" }}
              alignItems="center"
            >
              <Flex pt={2} pl={3} alignItems="center">
                <Link
                  className="rainbow-text"
                  css={css`
                    letter-spacing: 0.1em;
                  `}
                  size="larger"
                  href={`/${encodeURIComponent(event.eventUrl)}`}
                >
                  {event.eventName}
                </Link>
                <EventVisibility eventVisibility={event.eventVisibility} />
              </Flex>
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
                <Text fontSize="smaller" py={2}>
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
                href={`/${event.eventUrl}`}
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
