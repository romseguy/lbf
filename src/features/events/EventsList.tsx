import {
  AddIcon,
  CheckCircleIcon,
  DeleteIcon,
  EmailIcon,
  UpDownIcon,
  WarningIcon
} from "@chakra-ui/icons";
import {
  Box,
  Icon,
  Text,
  Grid,
  Heading,
  Tooltip,
  Flex,
  useToast,
  IconButton,
  Tag,
  Button,
  useColorMode
} from "@chakra-ui/react";
import {
  compareAsc,
  format,
  addHours,
  addWeeks,
  intervalToDuration,
  parseISO,
  formatISO,
  getMinutes,
  getDayOfYear,
  getDay,
  setDay,
  compareDesc,
  setHours
} from "date-fns";
import { fr } from "date-fns/locale";
import DOMPurify from "isomorphic-dompurify";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { FaGlobeEurope, FaRetweet } from "react-icons/fa";
import { IoIosPeople, IoIosPerson, IoMdPerson } from "react-icons/io";
import { css } from "twin.macro";
import { Link, GridHeader, GridItem, Spacer } from "features/common";
import { DescriptionModal } from "features/modals/DescriptionModal";
import { EventModal } from "features/modals/EventModal";
import { ForwardModal } from "features/modals/ForwardModal";
import { useSession } from "hooks/useAuth";
import { Category, IEvent, Visibility } from "models/Event";
import { IOrg, orgTypeFull } from "models/Org";
import { SubscriptionTypes } from "models/Subscription";
import { useDeleteEventMutation, useEditEventMutation } from "./eventsApi";
import { EventsListItem } from "./EventsListItem";

const ToggleEvents = ({
  previousEvents,
  showPreviousEvents,
  setShowPreviousEvents,
  nextEvents,
  showNextEvents,
  setShowNextEvents
}: {
  previousEvents: IEvent<Date>[];
  showPreviousEvents: boolean;
  setShowPreviousEvents: (show: boolean) => void;
  nextEvents: IEvent<Date>[];
  showNextEvents: boolean;
  setShowNextEvents: (show: boolean) => void;
}) => {
  return (
    <Flex justifyContent="space-between">
      <Box>
        {!showNextEvents && (
          <>
            {previousEvents.length > 0 && (
              <Link
                fontSize="smaller"
                variant="underline"
                onClick={() => {
                  // currentDate = null;
                  // currentDateP = null;
                  setShowPreviousEvents(!showPreviousEvents);
                }}
              >
                {showPreviousEvents
                  ? "Revenir aux événements de cette semaine"
                  : "Voir les événéments précédents"}
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

export const EventsList = ({
  org,
  orgQuery,
  isCreator,
  isSubscribed,
  isLogin,
  setIsLogin,
  ...props
}: {
  events: IEvent[];
  org?: IOrg;
  orgQuery?: any;
  eventHeader?: any;
  isCreator?: boolean;
  isSubscribed?: boolean;
  isLogin?: number;
  setIsLogin?: (isLogin: number) => void;
}) => {
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();
  const toast = useToast({ position: "top" });
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const today = setHours(new Date(), 0);

  const [deleteEvent, deleteQuery] = useDeleteEventMutation();
  const [editEvent, editEventMutation] = useEditEventMutation();

  //#region local state
  const [isLoading, setIsLoading] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventToShow, setEventToShow] = useState<IEvent | null>(null);
  const [eventToForward, setEventToForward] = useState<IEvent | null>(null);
  const [showPreviousEvents, setShowPreviousEvents] = useState(false);
  const [showNextEvents, setShowNextEvents] = useState(false);
  //#endregion

  //#region org
  const orgFollowersCount = org?.orgSubscriptions
    .map(
      (subscription) =>
        subscription.orgs.filter((orgSubscription) => {
          return (
            orgSubscription.orgId === org?._id &&
            orgSubscription.type === SubscriptionTypes.FOLLOWER
          );
        }).length
    )
    .reduce((a, b) => a + b, 0);
  //#endregion

  const eventsListItemProps = {
    deleteEvent,
    editEvent,
    eventHeader: props.eventHeader,
    isCreator,
    isDark,
    isLoading,
    setIsLoading,
    org,
    orgQuery,
    orgFollowersCount,
    session,
    eventToForward,
    setEventToForward,
    eventToShow,
    setEventToShow,
    toast
  };

  const getEvents = (events: IEvent[]) => {
    let previousEvents: IEvent<Date>[] = [];
    let currentEvents: IEvent<Date>[] = [];
    let nextEvents: IEvent<Date>[] = [];

    for (const event of events) {
      if (
        isCreator ||
        event.eventVisibility === Visibility.PUBLIC ||
        (event.eventVisibility === Visibility.SUBSCRIBERS && isSubscribed)
      ) {
        const start = parseISO(event.eventMinDate);
        const end = parseISO(event.eventMaxDate);
        const { hours = 0 } = intervalToDuration({
          start,
          end
        });

        if (compareDesc(today, start) !== -1) {
          // event starts 1 week after today
          if (compareDesc(addWeeks(today, 1), start) !== -1)
            nextEvents.push({
              ...event,
              eventMinDate: start,
              eventMaxDate: end
            });
          // event starts today or after
          else
            currentEvents.push({
              ...event,
              eventMinDate: start,
              eventMaxDate: end
            });
        } else
          previousEvents.push({
            ...event,
            eventMinDate: start,
            eventMaxDate: end
          });

        if (event.otherDays) {
          for (const otherDay of event.otherDays) {
            const eventMinDate = otherDay.startDate
              ? parseISO(otherDay.startDate)
              : setDay(start, otherDay.dayNumber + 1);
            const eventMaxDate = otherDay.startDate
              ? addHours(parseISO(otherDay.startDate), hours)
              : setDay(end, otherDay.dayNumber + 1);

            if (compareDesc(today, eventMinDate) !== -1) {
              // event starts 1 week after today
              if (compareDesc(addWeeks(today, 1), start) !== -1)
                nextEvents.push({
                  ...event,
                  eventMinDate,
                  eventMaxDate
                });
              // event starts today or after
              else
                currentEvents.push({
                  ...event,
                  eventMinDate,
                  eventMaxDate
                });
            } else
              previousEvents.push({
                ...event,
                eventMinDate,
                eventMaxDate
              });
          }
        }

        if (event.repeat) {
          const repeatCount = event.repeat > 4 ? 4 : event.repeat;

          for (let i = 1; i <= repeatCount; i++) {
            const eventMinDate = addWeeks(start, i);
            const eventMaxDate = addWeeks(end, i);

            if (compareDesc(addWeeks(today, 1), eventMinDate) !== -1) {
              // repeated event starts 1 week after today
              nextEvents.push({
                ...event,
                eventMinDate,
                eventMaxDate,
                repeat: repeatCount + i
              });
            } else
              currentEvents.push({
                ...event,
                eventMinDate,
                eventMaxDate,
                repeat: repeatCount + i
              });

            if (event.otherDays) {
              for (const otherDay of event.otherDays) {
                const start = otherDay.startDate
                  ? addWeeks(parseISO(otherDay.startDate), i)
                  : setDay(eventMinDate, otherDay.dayNumber + 1);
                const end = otherDay.startDate
                  ? addWeeks(addHours(parseISO(otherDay.startDate), hours), i)
                  : setDay(eventMaxDate, otherDay.dayNumber + 1);

                if (compareDesc(addWeeks(today, 1), start) !== -1) {
                  nextEvents.push({
                    ...event,
                    eventMinDate: start,
                    eventMaxDate: end
                  });
                } else
                  currentEvents.push({
                    ...event,
                    eventMinDate: start,
                    eventMaxDate: end
                  });
              }
            }
          }
        }
      }
    }

    return { previousEvents, currentEvents, nextEvents };
  };

  const events = useMemo(() => {
    let currentDateP: Date | null = null;
    let currentDate: Date | null = null;
    const { previousEvents, currentEvents, nextEvents } = getEvents(
      props.events
    );

    return (
      <>
        <ToggleEvents
          previousEvents={previousEvents}
          showPreviousEvents={showPreviousEvents}
          setShowPreviousEvents={setShowPreviousEvents}
          nextEvents={nextEvents}
          showNextEvents={showNextEvents}
          setShowNextEvents={setShowNextEvents}
        />

        {showPreviousEvents && (
          <Box>
            {previousEvents
              .sort((a, b) => compareAsc(a.eventMinDate, b.eventMinDate))
              .map((event, index) => {
                let addGridHeader = false;
                const minDate = event.eventMinDate;
                const iscurrentDatePOneDayBeforeMinDate = currentDateP
                  ? getDayOfYear(currentDateP) < getDayOfYear(minDate)
                  : true;

                if (iscurrentDatePOneDayBeforeMinDate) {
                  addGridHeader = true;
                  currentDateP = minDate;
                } else {
                  addGridHeader = false;
                }

                return (
                  <Grid
                    key={"event-" + index}
                    templateRows="auto auto 4fr auto"
                    templateColumns="1fr 6fr minmax(75px, 1fr)"
                  >
                    <>
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

                      <EventsListItem
                        {...eventsListItemProps}
                        event={event}
                        index={index}
                        length={previousEvents.length}
                      />
                    </>
                  </Grid>
                );
              })}
          </Box>
        )}

        {!showPreviousEvents &&
          !showNextEvents &&
          currentEvents
            .sort((a, b) => compareAsc(a.eventMinDate, b.eventMinDate))
            .map((event, index) => {
              let addGridHeader = false;
              const minDate = event.eventMinDate;

              const isCurrentDateOneDayBeforeMinDate = currentDate
                ? getDayOfYear(currentDate) < getDayOfYear(minDate)
                : true;

              if (isCurrentDateOneDayBeforeMinDate) {
                addGridHeader = true;
                currentDate = minDate;
                // console.log("currentDate set to", currentDate);
              } else {
                addGridHeader = false;
              }

              return (
                <Grid
                  key={"event-" + index}
                  templateRows="auto auto 4fr auto"
                  templateColumns="1fr 6fr minmax(75px, 1fr)"
                >
                  <>
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
                    <EventsListItem
                      {...eventsListItemProps}
                      event={event}
                      index={index}
                      length={currentEvents.length}
                    />
                  </>
                </Grid>
              );
            })}

        {showNextEvents && (
          <Box>
            {nextEvents
              .sort((a, b) => compareAsc(a.eventMinDate, b.eventMinDate))
              .map((event, index) => {
                let addGridHeader = false;
                const minDate = event.eventMinDate;
                const iscurrentDatePOneDayBeforeMinDate = currentDateP
                  ? getDayOfYear(currentDateP) < getDayOfYear(minDate)
                  : true;

                if (iscurrentDatePOneDayBeforeMinDate) {
                  addGridHeader = true;
                  currentDateP = minDate;
                } else {
                  addGridHeader = false;
                }

                return (
                  <Grid
                    key={"event-" + index}
                    templateRows="auto auto 4fr auto"
                    templateColumns="1fr 6fr minmax(75px, 1fr)"
                  >
                    <>
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

                      <EventsListItem
                        {...eventsListItemProps}
                        event={event}
                        index={index}
                        length={nextEvents.length}
                      />
                    </>
                  </Grid>
                );
              })}
          </Box>
        )}

        <ToggleEvents
          previousEvents={previousEvents}
          showPreviousEvents={showPreviousEvents}
          setShowPreviousEvents={setShowPreviousEvents}
          nextEvents={nextEvents}
          showNextEvents={showNextEvents}
          setShowNextEvents={setShowNextEvents}
        />
      </>
    );
  }, [props.events, session, isLoading, showPreviousEvents, showNextEvents]);

  return (
    <div>
      {org && (
        <>
          <Button
            colorScheme="teal"
            leftIcon={<AddIcon />}
            mb={5}
            onClick={() => {
              if (!isSessionLoading) {
                if (session) {
                  if (org) {
                    if (isCreator || isSubscribed) setIsEventModalOpen(true);
                    else
                      toast({
                        status: "error",
                        title: `Vous devez être adhérent ${orgTypeFull(
                          org.orgType
                        )} pour ajouter un événement`
                      });
                  } else setIsEventModalOpen(true);
                } else if (setIsLogin && isLogin) {
                  setIsLogin(isLogin + 1);
                }
              }
            }}
            data-cy="addEvent"
          >
            Ajouter un événement
          </Button>

          {session && isEventModalOpen && (
            <EventModal
              session={session}
              initialEventOrgs={[org]}
              onCancel={() => setIsEventModalOpen(false)}
              onSubmit={async (eventUrl) => {
                await router.push(`/${eventUrl}`, `/${eventUrl}`, {
                  shallow: true
                });
              }}
              onClose={() => setIsEventModalOpen(false)}
            />
          )}
        </>
      )}

      {events}

      {eventToShow && (
        <DescriptionModal
          onClose={() => {
            setEventToShow(null);
          }}
          header={
            <Link
              href={`/${eventToShow.eventUrl}`}
              css={css`
                letter-spacing: 0.1em;
              `}
              size="larger"
              className="rainbow-text"
            >
              {eventToShow.eventName}
            </Link>
          }
        >
          {eventToShow.eventDescription &&
          eventToShow.eventDescription.length > 0 &&
          eventToShow.eventDescription !== "<p><br></p>" ? (
            <div className="ql-editor">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(eventToShow.eventDescription)
                }}
              />
            </div>
          ) : (
            <Text fontStyle="italic">Aucune description.</Text>
          )}
        </DescriptionModal>
      )}

      {eventToForward && (
        <ForwardModal
          event={eventToForward}
          onCancel={() => {
            setEventToForward(null);
          }}
          onClose={() => {
            setEventToForward(null);
          }}
          onSubmit={() => {
            setEventToForward(null);
          }}
        />
      )}
    </div>
  );
};
