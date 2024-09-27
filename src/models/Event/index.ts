import { parseISO, setMinutes, setHours, isBefore, setSeconds } from "date-fns";
import { getEventCategories } from "models/Org";
import { LatLon } from "use-places-autocomplete";
import { getDistance } from "utils/maps";
import { IEvent, EEventInviteStatus, EEventVisibility } from "models/Event";
import { hasItems } from "utils/array";
import { CalendarIcon, ChatIcon } from "@chakra-ui/icons";
import { FaImages } from "react-icons/fa";
import { AppIcon } from "utils/types";

export * from "./IEvent";

export let defaultTabs: { [key: string]: { icon: AppIcon; url: string } } = {
  Présentation: { icon: CalendarIcon, url: "/" },
  ["Discussions de l'événement"]: { icon: ChatIcon, url: "/discussions" },
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

      if (isBefore(start, today)) {
        // console.log("previousEvents.push", event.eventName);
        previousEvents.push({
          ...event,
          eventMinDate: start,
          eventMaxDate: end
        });
      } else {
        // console.log("currentEvents.push", event.eventName, event);
        currentEvents.push({
          ...event,
          eventMinDate: start,
          eventMaxDate: end
        });
      }
    }
  }

  return { previousEvents, currentEvents };
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
