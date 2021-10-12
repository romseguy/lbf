import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Text,
  Grid,
  Heading,
  useToast,
  Button,
  useColorMode,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import {
  compareAsc,
  format,
  addHours,
  addWeeks,
  intervalToDuration,
  parseISO,
  getDayOfYear,
  setDay,
  compareDesc,
  setHours
} from "date-fns";
import { fr } from "date-fns/locale";
import DOMPurify from "isomorphic-dompurify";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { css } from "twin.macro";
import { Link, GridHeader, GridItem, Spacer } from "features/common";
import { DescriptionModal } from "features/modals/DescriptionModal";
import { ModalState, NotifyModal } from "features/modals/NotifyModal";
import { EventModal } from "features/modals/EventModal";
import { ForwardModal } from "features/modals/ForwardModal";
import { refetchOrg } from "features/orgs/orgSlice";
import { useSession } from "hooks/useAuth";
import { IEvent, Visibility } from "models/Event";
import { IOrg, orgTypeFull } from "models/Org";
import { SubscriptionTypes } from "models/Subscription";
import { useAppDispatch } from "store";
import {
  useDeleteEventMutation,
  useEditEventMutation,
  usePostEventNotifMutation
} from "./eventsApi";
import { EventsListItem } from "./EventsListItem";
import { useEditOrgMutation } from "features/orgs/orgsApi";
import { EventsListToggle } from "./EventsListToggle";

export const EventsList = ({
  eventsQuery,
  org,
  orgQuery,
  isCreator,
  isSubscribed,
  isLogin,
  setIsLogin,
  selectedCategories,
  ...props
}: {
  events: IEvent[];
  eventsQuery?: any;
  org?: IOrg;
  orgQuery?: any;
  eventHeader?: any;
  isCreator?: boolean;
  isSubscribed?: boolean;
  isLogin?: number;
  setIsLogin?: (isLogin: number) => void;
  selectedCategories?: number[];
}) => {
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();
  const toast = useToast({ position: "top" });
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useAppDispatch();

  const today = setHours(new Date(), 0);

  const [deleteEvent, deleteQuery] = useDeleteEventMutation();
  const [editEvent, editEventMutation] = useEditEventMutation();
  const [editOrg, editOrgMutation] = useEditOrgMutation();
  const postEventNotifMutation = usePostEventNotifMutation();

  //#region local state
  const [isLoading, setIsLoading] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventToShow, setEventToShow] = useState<IEvent | null>(null);
  const [eventToForward, setEventToForward] = useState<IEvent | null>(null);
  const [notifyModalState, setNotifyModalState] = useState<
    ModalState<IEvent<string | Date>>
  >({
    entity: null
  });
  useEffect(() => {
    if (notifyModalState.entity) {
      const event = props.events.find(
        ({ _id }) => _id === notifyModalState.entity!._id
      );
      setNotifyModalState({ entity: event || null });
    }
  }, [props.events]);
  const [showPreviousEvents, setShowPreviousEvents] = useState(false);
  const [showNextEvents, setShowNextEvents] = useState(false);
  useEffect(() => {
    setShowPreviousEvents(false);
    setShowNextEvents(false);
  }, [selectedCategories]);
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
    editOrg,
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
    notifyModalState,
    setNotifyModalState,
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
        (event.eventVisibility === Visibility.SUBSCRIBERS &&
          (isSubscribed || isCreator))
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
                  eventMaxDate,
                  repeat: otherDay.dayNumber + 1
                });
              // event starts today or after
              else
                currentEvents.push({
                  ...event,
                  eventMinDate,
                  eventMaxDate,
                  repeat: otherDay.dayNumber + 1
                });
            } else
              previousEvents.push({
                ...event,
                eventMinDate,
                eventMaxDate,
                repeat: otherDay.dayNumber + 1
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
                eventMaxDate
              });
            } else if (compareDesc(today, eventMinDate) !== -1) {
              currentEvents.push({
                ...event,
                eventMinDate,
                eventMaxDate
              });
            } else {
              previousEvents.push({
                ...event,
                eventMinDate,
                eventMaxDate
              });
            }

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
                    eventMaxDate: end,
                    repeat: otherDay.dayNumber + 1
                  });
                } else if (compareDesc(today, start) !== -1) {
                  currentEvents.push({
                    ...event,
                    eventMinDate: start,
                    eventMaxDate: end,
                    repeat: otherDay.dayNumber + 1
                  });
                } else {
                  previousEvents.push({
                    ...event,
                    eventMinDate: start,
                    eventMaxDate: end,
                    repeat: otherDay.dayNumber + 1
                  });
                }
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
    let { previousEvents, currentEvents, nextEvents } = getEvents(props.events);

    return (
      <>
        <EventsListToggle
          previousEvents={previousEvents}
          showPreviousEvents={showPreviousEvents}
          setShowPreviousEvents={setShowPreviousEvents}
          currentEvents={currentEvents}
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

        {!showPreviousEvents && !showNextEvents && (
          <>
            {currentEvents.length > 0 ? (
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
                                {format(minDate, "cccc d MMMM", {
                                  locale: fr
                                })}
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
                })
            ) : (
              <Alert status="info">
                <AlertIcon />
                Aucun événement prévu cette semaine.
              </Alert>
            )}
          </>
        )}

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

        {(showPreviousEvents || showNextEvents || currentEvents.length > 0) && (
          <EventsListToggle
            previousEvents={previousEvents}
            showPreviousEvents={showPreviousEvents}
            setShowPreviousEvents={setShowPreviousEvents}
            currentEvents={currentEvents}
            nextEvents={nextEvents}
            showNextEvents={showNextEvents}
            setShowNextEvents={setShowNextEvents}
          />
        )}
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
                if (org) {
                  dispatch(refetchOrg());
                }
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

      <NotifyModal
        event={notifyModalState.entity || undefined}
        org={org}
        query={orgQuery}
        mutation={postEventNotifMutation}
        setModalState={setNotifyModalState}
        modalState={notifyModalState}
      />
    </div>
  );
};
