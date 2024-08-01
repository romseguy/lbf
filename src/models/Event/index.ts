import {
  parseISO,
  setDay,
  setMinutes,
  setHours,
  getHours,
  getMinutes,
  getDayOfYear,
  isBefore,
  addWeeks,
  setSeconds
} from "date-fns";
import { getEventCategories } from "models/Org";
import { LatLon } from "use-places-autocomplete";
import { getNthDayOfMonth, moveDateToCurrentWeek } from "utils/date";
import { getDistance } from "utils/maps";
import { IEvent, EEventInviteStatus, EEventVisibility } from "models/Event";
import { hasItems } from "utils/array";
import { CalendarIcon, ChatIcon } from "@chakra-ui/icons";
import { FaImages } from "react-icons/fa";
import { AppIcon } from "utils/types";

export * from "./IEvent";

export let defaultTabs: { [key: string]: { icon: AppIcon; url: string } } = {
  Présentation: { icon: CalendarIcon, url: "/" },
  Discussions: { icon: ChatIcon, url: "/discussions" },
  ["Galerie de l'événement"]: { icon: FaImages, url: "/galerie" }
};

//#region EventsList
export const getEvents = ({
  events,
  isCreator,
  origin,
  distance,
  selectedCategories
}: {
  events: IEvent[];
  isCreator?: boolean;
  origin?: LatLon;
  distance: number;
  selectedCategories: string[];
}) => {
  const today = setSeconds(setMinutes(setHours(new Date(), 0), 0), 0);
  let previousEvents: IEvent<Date>[] = [];
  let currentEvents: IEvent<Date>[] = [];
  let nextEvents: IEvent<Date>[] = [];

  for (let event of events) {
    if (
      typeof event.eventCategory === "string" &&
      hasItems(selectedCategories) &&
      !selectedCategories.includes(event.eventCategory)
    ) {
      continue;
    }

    if (isCreator || event.eventVisibility === EEventVisibility.PUBLIC) {
      if (distance > 0 && origin && event.eventLat && event.eventLng) {
        const d = getDistance(origin, {
          lat: event.eventLat,
          lng: event.eventLng
        });

        if (d / 1000 > distance) continue;

        const eventDistance = d > 1000 ? Math.round(d / 1000) + "km" : d + "m";

        event = {
          ...event,
          eventDistance
        };
      }

      const start = parseISO(event.eventMinDate);
      const end =
        typeof event.eventMaxDate === "string"
          ? parseISO(event.eventMaxDate)
          : event.eventMaxDate;

      if (!event.repeat) {
        let pushedMonthRepeat = false;

        if (event.otherDays) {
          for (const otherDay of event.otherDays) {
            const eventMinDate = otherDay.startDate
              ? parseISO(otherDay.startDate)
              : setDay(start, otherDay.dayNumber + 1);
            const eventMaxDate = otherDay.endTime
              ? parseISO(otherDay.endTime)
              : end
              ? setDay(end, otherDay.dayNumber + 1)
              : undefined;

            if (
              Array.isArray(otherDay.monthRepeat) &&
              otherDay.monthRepeat.length > 0
            ) {
              for (const monthRepeat of otherDay.monthRepeat) {
                const NthDayOfMonth = getNthDayOfMonth(
                  new Date(),
                  otherDay.dayNumber === 6 ? 0 : otherDay.dayNumber - 1,
                  monthRepeat + 1
                );

                const eventMinDate = setMinutes(
                  setHours(NthDayOfMonth, getHours(start)),
                  getMinutes(start)
                );
                const eventMaxDate = end;

                if (getDayOfYear(NthDayOfMonth) < getDayOfYear(today)) {
                  // console.log(
                  //   "previousEvents.monthRepeat.push",
                  //   event.eventName
                  // );
                  previousEvents.push({
                    ...event,
                    eventMinDate,
                    eventMaxDate
                  });
                } else {
                  if (isBefore(eventMinDate, addWeeks(today, 1))) {
                    pushedMonthRepeat = true;
                    // console.log(
                    //   "currentEvents.monthRepeat.push",
                    //   event.eventName
                    // );
                    currentEvents.push({
                      ...event,
                      eventMinDate,
                      eventMaxDate
                    });
                  } else {
                    // console.log(
                    //   "nextEvents.monthRepeat.push",
                    //   event.eventName
                    // );
                    nextEvents.push({
                      ...event,
                      eventMinDate,
                      eventMaxDate
                    });
                  }
                }
              }
            } else {
              if (isBefore(eventMinDate, today)) {
                // console.log("previousEvents.otherDay.push", event.eventName);
                previousEvents.push({
                  ...event,
                  eventMinDate,
                  eventMaxDate
                });
              } else {
                if (isBefore(eventMinDate, addWeeks(today, 1))) {
                  // console.log("currentEvents.otherDay.push", event.eventName);

                  currentEvents.push({
                    ...event,
                    eventMinDate,
                    eventMaxDate
                  });
                } else {
                  // console.log("nextEvents.otherDay.push", event.eventName);
                  nextEvents.push({
                    ...event,
                    eventMinDate,
                    eventMaxDate
                  });
                }
              }
            }
          }
        }

        if (isBefore(start, today)) {
          // console.log("previousEvents.push", event.eventName);
          previousEvents.push({
            ...event,
            eventMinDate: start,
            eventMaxDate: end
          });
        } else {
          if (!pushedMonthRepeat && isBefore(start, addWeeks(today, 1))) {
            // console.log("currentEvents.push", event.eventName, event);
            currentEvents.push({
              ...event,
              eventMinDate: start,
              eventMaxDate: end
            });
          } else {
            // console.log("nextEvents.push", event.eventName);
            nextEvents.push({
              ...event,
              eventMinDate: start,
              eventMaxDate: end
            });
          }
        }
      } else {
        if (event.repeat === 99) {
          let eventMinDate = moveDateToCurrentWeek(start);
          let eventMaxDate = end ? moveDateToCurrentWeek(end) : undefined;

          if (isBefore(eventMinDate, today)) {
            eventMinDate = addWeeks(eventMinDate, 1);
            eventMaxDate = eventMaxDate ? addWeeks(eventMaxDate, 1) : undefined;
          }

          // console.log(
          //   "currentEvents.repeat99.push",
          //   event.eventName,
          //   eventMinDate,
          //   eventMaxDate
          // );
          currentEvents.push({
            ...event,
            eventMinDate,
            eventMaxDate
          });

          if (event.otherDays) {
            for (const otherDay of event.otherDays) {
              let eventMinDate = moveDateToCurrentWeek(
                otherDay.startDate
                  ? parseISO(otherDay.startDate)
                  : setDay(start, otherDay.dayNumber + 1)
              );
              let eventMaxDate = end
                ? moveDateToCurrentWeek(
                    otherDay.endTime
                      ? parseISO(otherDay.endTime)
                      : setDay(end, otherDay.dayNumber + 1)
                  )
                : undefined;
              if (isBefore(eventMinDate, today)) {
                eventMinDate = addWeeks(eventMinDate, 1);
                eventMaxDate = eventMaxDate
                  ? addWeeks(eventMaxDate, 1)
                  : undefined;
              }
              // console.log(
              //   "currentEvents.repeat99.otherDay.push",
              //   event.eventName,
              //   eventMinDate,
              //   eventMaxDate
              // );
              currentEvents.push({
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
            const eventMaxDate = end ? addWeeks(end, i) : undefined;

            if (isBefore(today, eventMinDate)) {
              // console.log(`previousEvents.repeat${i}.push`, event.eventName);
              previousEvents.push({
                ...event,
                eventMinDate,
                eventMaxDate
              });
            } else {
              if (isBefore(addWeeks(today, 1), eventMinDate)) {
                // console.log(`currentEvents.repeat${i}.push`, event.eventName);
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
                  : eventMaxDate
                  ? setDay(eventMaxDate, otherDay.dayNumber + 1)
                  : undefined;

                if (isBefore(today, eventMinDate)) {
                  // console.log(
                  //   `previousEvents.repeat${i}.otherDay.push`,
                  //   event.eventName
                  // );
                  previousEvents.push({
                    ...event,
                    eventMinDate: start,
                    eventMaxDate: end,
                    repeat: otherDay.dayNumber + 1
                  });
                } else {
                  if (isBefore(addWeeks(today, 1), eventMinDate)) {
                    // console.log(
                    //   `currentEvents.repeat${i}.otherDay.push`,
                    //   event.eventName
                    // );
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
              }
            }
          }
        }
      }
    }
  }

  return { previousEvents, currentEvents, nextEvents };
};
//#endregion

//#region categories
export const getCategories = (event: IEvent<string | Date>) => {
  return getEventCategories(event.eventOrgs[0]);
};
//#endregion

//#region notifications
export const isAttending = ({
  email,
  event
}: {
  email?: string | null;
  event: IEvent;
}) => {
  if (!email) return false;
  return !!event.eventNotifications.find(({ email: e, status }) => {
    return e === email && status === EEventInviteStatus.OK;
  });
};

export const isNotAttending = ({
  email,
  event
}: {
  email?: string | null;
  event: IEvent;
}) => {
  if (!email) return false;
  return !!event.eventNotifications.find(({ email: e, status }) => {
    return e === email && status === EEventInviteStatus.NOK;
  });
};
//#endregion

//#region toString
export const monthRepeatOptions: { [key: number]: string } = {
  0: "premier",
  1: "2ème",
  2: "3ème",
  3: "dernier"
};
export const EventInviteStatuses: Record<EEventInviteStatus, string> = {
  [EEventInviteStatus.PENDING]: "La personne n'a pas encore indiqué participer",
  [EEventInviteStatus.OK]: "Participant",
  [EEventInviteStatus.NOK]: "Invitation refusée"
};

export const EventVisibilities: Record<EEventVisibility, string> = {
  [EEventVisibility.FOLLOWERS]: "Abonnés",
  [EEventVisibility.SUBSCRIBERS]: "Adhérents",
  [EEventVisibility.PRIVATE]: "Privé",
  [EEventVisibility.PUBLIC]: "Publique"
};
//#endregion
