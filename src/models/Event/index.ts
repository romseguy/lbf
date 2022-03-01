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
import { getOrgEventCategories, IOrgEventCategory } from "models/Org";
import { LatLon } from "use-places-autocomplete";
import { getNthDayOfMonth, moveDateToCurrentWeek } from "utils/date";
import { getDistance } from "utils/maps";
import { IEvent, EEventInviteStatus, EEventVisibility } from "models/Event";
import { hasItems } from "utils/array";

export * from "./IEvent";

//#region categories
export const defaultEventCategories: IOrgEventCategory[] = [
  {
    index: "0",
    label: "Autre"
  }
];
export const defaultCategory = defaultEventCategories[0];
export const getEventCategories = (event: IEvent<string | Date>) => {
  return getOrgEventCategories(event.eventOrgs[0]);
};
//#region

//#region notifications
export const isAttending = ({
  email,
  event
}: {
  email?: string;
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
  email?: string;
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
//#endregion

//#region EventsList
export const getEvents = ({
  events,
  isCreator,
  isSubscribed,
  origin,
  distance,
  selectedCategories
}: {
  events: IEvent[];
  isCreator?: boolean;
  isSubscribed?: boolean;
  origin?: LatLon;
  distance: number;
  selectedCategories: number[];
}) => {
  const today = setSeconds(setMinutes(setHours(new Date(), 0), 0), 0);
  let previousEvents: IEvent<Date>[] = [];
  let currentEvents: IEvent<Date>[] = [];
  let nextEvents: IEvent<Date>[] = [];

  for (let event of events) {
    if (
      typeof event.eventCategory === "number" &&
      hasItems(selectedCategories) &&
      !selectedCategories.includes(event.eventCategory)
    ) {
      continue;
    }

    if (
      isCreator ||
      event.eventVisibility === EEventVisibility.PUBLIC ||
      (event.eventVisibility === EEventVisibility.SUBSCRIBERS &&
        (isSubscribed || isCreator))
    ) {
      if (origin && event.eventLat && event.eventLng) {
        const d = getDistance(origin, {
          lat: event.eventLat,
          lng: event.eventLng
        });

        if (distance > 0 && d / 1000 > distance) continue;

        const eventDistance = d > 1000 ? Math.round(d / 1000) + "km" : d + "m";

        event = {
          ...event,
          eventDistance
        };
      }

      const start = parseISO(event.eventMinDate);
      const end = parseISO(event.eventMaxDate);

      if (!event.repeat) {
        let pushedMonthRepeat = false;

        if (event.otherDays) {
          for (const otherDay of event.otherDays) {
            const eventMinDate = otherDay.startDate
              ? parseISO(otherDay.startDate)
              : setDay(start, otherDay.dayNumber + 1);
            const eventMaxDate = otherDay.endTime
              ? parseISO(otherDay.endTime)
              : setDay(end, otherDay.dayNumber + 1);

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
          let eventMaxDate = moveDateToCurrentWeek(end);

          if (isBefore(eventMinDate, today)) {
            eventMinDate = addWeeks(eventMinDate, 1);
            eventMaxDate = addWeeks(eventMaxDate, 1);
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
              let eventMaxDate = moveDateToCurrentWeek(
                otherDay.endTime
                  ? parseISO(otherDay.endTime)
                  : setDay(end, otherDay.dayNumber + 1)
              );
              if (isBefore(eventMinDate, today)) {
                eventMinDate = addWeeks(eventMinDate, 1);
                eventMaxDate = addWeeks(eventMaxDate, 1);
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
            const eventMaxDate = addWeeks(end, i);

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
                  : setDay(eventMaxDate, otherDay.dayNumber + 1);

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
