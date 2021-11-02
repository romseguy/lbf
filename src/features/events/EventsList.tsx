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
  AlertIcon,
  Tag
} from "@chakra-ui/react";
import {
  addHours,
  addWeeks,
  compareAsc,
  compareDesc,
  format,
  intervalToDuration,
  isBefore,
  parseISO,
  getDay,
  getDayOfYear,
  setDay,
  getHours,
  getMinutes,
  setHours,
  setMinutes
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
import { Category, IEvent, Visibility } from "models/Event";
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
import { EventCategory } from "./EventCategory";
import { EventsListCategories } from "./EventsListCategories";

export const EventsList = ({
  eventsQuery,
  org,
  orgQuery,
  isCreator,
  isSubscribed,
  isLogin,
  setIsLogin,
  ...props
}: {
  events: IEvent[];
  eventsQuery?: any;
  org?: IOrg;
  orgQuery?: any;
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
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const selectedCategoriesCount = selectedCategories
    ? selectedCategories.length
    : 0;
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
    editOrg,
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
        event.eventCategory &&
        selectedCategories.length > 0 &&
        !selectedCategories.includes(event.eventCategory)
      )
        continue;

      if (!event.eventCategory && selectedCategories.length > 0) continue;

      if (
        isCreator ||
        event.eventVisibility === Visibility.PUBLIC ||
        (event.eventVisibility === Visibility.SUBSCRIBERS &&
          (isSubscribed || isCreator))
      ) {
        const start = parseISO(event.eventMinDate);
        const end = parseISO(event.eventMaxDate);

        if (isBefore(start, today)) {
          previousEvents.push({
            ...event,
            eventMinDate: start,
            eventMaxDate: end
          });

          if (event.repeat === 99) {
            const eventMinDate = setMinutes(
              setHours(setDay(today, getDay(start)), getHours(start)),
              getMinutes(start)
            );
            const eventMaxDate = setMinutes(
              setHours(setDay(today, getDay(end)), getHours(end)),
              getMinutes(end)
            );

            currentEvents.push({
              ...event,
              eventMinDate,
              eventMaxDate
            });

            if (event.otherDays) {
              for (const otherDay of event.otherDays) {
                const start = otherDay.startDate
                  ? setMinutes(
                      setHours(
                        setDay(today, getDay(parseISO(otherDay.startDate))),
                        getHours(parseISO(otherDay.startDate))
                      ),
                      getMinutes(parseISO(otherDay.startDate))
                    )
                  : setDay(eventMinDate, otherDay.dayNumber + 1);
                const end = otherDay.endTime
                  ? setMinutes(
                      setHours(
                        setDay(today, getDay(parseISO(otherDay.endTime))),
                        getHours(parseISO(otherDay.endTime))
                      ),
                      getMinutes(parseISO(otherDay.endTime))
                    )
                  : setDay(eventMaxDate, otherDay.dayNumber + 1);

                currentEvents.push({
                  ...event,
                  eventMinDate: start,
                  eventMaxDate: end
                });
              }
            }
          }
        } else {
          if (isBefore(start, addWeeks(today, 1))) {
            currentEvents.push({
              ...event,
              eventMinDate: start,
              eventMaxDate: end
            });
          } else {
            nextEvents.push({
              ...event,
              eventMinDate: start,
              eventMaxDate: end
            });
          }
        }

        if (event.otherDays) {
          for (const otherDay of event.otherDays) {
            const eventMinDate = otherDay.startDate
              ? parseISO(otherDay.startDate)
              : setDay(start, otherDay.dayNumber + 1);
            const eventMaxDate = otherDay.endTime
              ? parseISO(otherDay.endTime)
              : setDay(end, otherDay.dayNumber + 1);

            if (isBefore(eventMinDate, today)) {
              previousEvents.push({
                ...event,
                eventMinDate,
                eventMaxDate,
                repeat: otherDay.dayNumber + 1
              });
            } else {
              if (isBefore(eventMinDate, addWeeks(today, 1))) {
                currentEvents.push({
                  ...event,
                  eventMinDate,
                  eventMaxDate,
                  repeat: otherDay.dayNumber + 1
                });
              } else {
                nextEvents.push({
                  ...event,
                  eventMinDate,
                  eventMaxDate,
                  repeat: otherDay.dayNumber + 1
                });
              }
            }
          }
        }

        if (event.repeat) {
          if (event.repeat === 99) {
            const eventMinDate = setMinutes(
              setHours(
                setDay(addWeeks(today, 1), getDay(start)),
                getHours(start)
              ),
              getMinutes(start)
            );
            const eventMaxDate = setMinutes(
              setHours(setDay(addWeeks(today, 1), getDay(end)), getHours(end)),
              getMinutes(end)
            );
            nextEvents.push({
              ...event,
              eventMinDate,
              eventMaxDate
            });

            if (event.otherDays) {
              for (const otherDay of event.otherDays) {
                const startDate = otherDay.startDate
                  ? parseISO(otherDay.startDate)
                  : setDay(start, otherDay.dayNumber + 1);
                const endDate = otherDay.endTime
                  ? parseISO(otherDay.endTime)
                  : setDay(end, otherDay.dayNumber + 1);

                const eventMinDate = setMinutes(
                  setHours(
                    setDay(addWeeks(today, 1), getDay(startDate)),
                    getHours(startDate)
                  ),
                  getMinutes(startDate)
                );
                const eventMaxDate = setMinutes(
                  setHours(
                    setDay(addWeeks(today, 1), getDay(endDate)),
                    getHours(endDate)
                  ),
                  getMinutes(endDate)
                );

                nextEvents.push({
                  ...event,
                  eventMinDate,
                  eventMaxDate
                });
              }
            }
          } else {
            for (let i = 1; i <= event.repeat; i++) {
              if (i % event.repeat !== 0) continue;
              const eventMinDate = addWeeks(start, i);
              const eventMaxDate = addWeeks(end, i);

              if (isBefore(today, eventMinDate)) {
                previousEvents.push({
                  ...event,
                  eventMinDate,
                  eventMaxDate
                });
              } else {
                if (isBefore(addWeeks(today, 1), eventMinDate)) {
                  currentEvents.push({
                    ...event,
                    eventMinDate,
                    eventMaxDate
                  });
                } else {
                  nextEvents.push({
                    ...event,
                    eventMinDate,
                    eventMaxDate
                  });
                }
              }

              if (event.otherDays) {
                for (const otherDay of event.otherDays) {
                  const start = otherDay.startDate
                    ? addWeeks(parseISO(otherDay.startDate), i)
                    : setDay(eventMinDate, otherDay.dayNumber + 1);
                  const end = otherDay.endTime
                    ? addWeeks(parseISO(otherDay.endTime), i)
                    : setDay(eventMaxDate, otherDay.dayNumber + 1);

                  if (isBefore(today, eventMinDate)) {
                    previousEvents.push({
                      ...event,
                      eventMinDate: start,
                      eventMaxDate: end,
                      repeat: otherDay.dayNumber + 1
                    });
                  } else {
                    if (isBefore(addWeeks(today, 1), eventMinDate)) {
                      currentEvents.push({
                        ...event,
                        eventMinDate: start,
                        eventMaxDate: end,
                        repeat: otherDay.dayNumber + 1
                      });
                    } else {
                      nextEvents.push({
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
      }
    }

    return { previousEvents, currentEvents, nextEvents };
  };

  const events = useMemo(() => {
    let currentDateP: Date | null = null;
    let currentDate: Date | null = null;
    let currentDateN: Date | null = null;
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
          mb={5}
        />

        {(previousEvents.length > 0 ||
          currentEvents.length > 0 ||
          nextEvents.length > 0) && (
          <EventsListCategories
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            mb={5}
          />
        )}

        {showPreviousEvents && (
          <Box>
            {previousEvents
              .sort((a, b) => compareAsc(a.eventMinDate, b.eventMinDate))
              .map((event, index) => {
                const minDate = event.eventMinDate;
                const addGridHeader =
                  !currentDateP ||
                  getDayOfYear(currentDateP) < getDayOfYear(minDate);
                currentDateP = minDate;

                return (
                  <Grid
                    key={"event-" + index}
                    templateRows="auto auto 4fr auto"
                    templateColumns="1fr 6fr minmax(75px, 1fr)"
                  >
                    <>
                      {addGridHeader ? (
                        <GridHeader
                          colSpan={3}
                          borderTopRadius={index === 0 ? "lg" : undefined}
                        >
                          <Heading size="sm" py={3}>
                            {format(minDate, "cccc d MMMM", { locale: fr })}
                          </Heading>
                        </GridHeader>
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
                  const minDate = event.eventMinDate;
                  const addGridHeader =
                    !currentDate ||
                    getDayOfYear(currentDate) < getDayOfYear(minDate);
                  currentDate = minDate;

                  return (
                    <Grid
                      key={"event-" + index}
                      templateRows="auto auto 4fr auto"
                      templateColumns="1fr 6fr minmax(75px, 1fr)"
                    >
                      <>
                        {addGridHeader ? (
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
                Aucun événement{" "}
                {Array.isArray(selectedCategories) &&
                selectedCategoriesCount === 1 ? (
                  <>
                    de la catégorie
                    <EventCategory
                      selectedCategory={selectedCategories[0]}
                      mx={1}
                    />
                  </>
                ) : selectedCategoriesCount > 1 ? (
                  <>
                    dans les catégories
                    {selectedCategories.map((catNumber, index) => (
                      <EventCategory
                        selectedCategory={selectedCategories[index]}
                        mx={1}
                      />
                    ))}
                  </>
                ) : (
                  ""
                )}{" "}
                prévu
                {previousEvents.length > 0 || nextEvents.length > 0
                  ? " cette semaine."
                  : "."}
              </Alert>
            )}
          </>
        )}

        {showNextEvents && (
          <Box>
            {nextEvents
              .sort((a, b) => compareAsc(a.eventMinDate, b.eventMinDate))
              .map((event, index) => {
                const minDate = event.eventMinDate;
                const addGridHeader =
                  !currentDateN ||
                  getDayOfYear(currentDateN) < getDayOfYear(minDate);
                currentDateN = minDate;

                return (
                  <Grid
                    key={"event-" + index}
                    templateRows="auto auto 4fr auto"
                    templateColumns="1fr 6fr minmax(75px, 1fr)"
                  >
                    <>
                      {addGridHeader ? (
                        <GridHeader
                          colSpan={3}
                          borderTopRadius={index === 0 ? "lg" : undefined}
                        >
                          <Heading size="sm" py={3}>
                            {format(
                              event.repeat
                                ? addWeeks(
                                    minDate,
                                    event.repeat === 99 ? 1 : event.repeat
                                  )
                                : minDate,
                              "cccc d MMMM",
                              { locale: fr }
                            )}
                          </Heading>
                        </GridHeader>
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

        {((showPreviousEvents && previousEvents.length > 0) ||
          showNextEvents ||
          currentEvents.length > 0) && (
          <EventsListToggle
            previousEvents={previousEvents}
            showPreviousEvents={showPreviousEvents}
            setShowPreviousEvents={setShowPreviousEvents}
            currentEvents={currentEvents}
            nextEvents={nextEvents}
            showNextEvents={showNextEvents}
            setShowNextEvents={setShowNextEvents}
            mt={3}
          />
        )}
      </>
    );
  }, [
    props.events,
    session,
    isLoading,
    showPreviousEvents,
    showNextEvents,
    selectedCategories
  ]);

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
              initialEventOrgs={[org]}
              session={session}
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
