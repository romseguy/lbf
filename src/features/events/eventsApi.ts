import { createApi } from "@reduxjs/toolkit/query/react";
import { IEvent } from "models/Event";
import { IEventNotification } from "models/INotification";
import baseQuery, { objectToQueryString } from "utils/query";

export type AddEventPayload = Omit<IEvent, "_id" | "createdBy">;

export interface AddEventNotifPayload {
  orgListsNames?: string[];
  email?: string;
}

export type EditEventPayload = Partial<IEvent> | string[];

export interface GetEventParams {
  eventUrl: string;
  email?: string;
  populate?: string;
}

export const eventApi = createApi({
  reducerPath: "eventsApi",
  baseQuery,
  tagTypes: ["Events"],
  endpoints: (build) => ({
    addEvent: build.mutation<IEvent, AddEventPayload>({
      query: (payload) => {
        console.groupCollapsed("addEvent");
        console.log("payload", payload);
        console.groupEnd();

        return {
          url: `events`,
          method: "POST",
          body: payload
        };
      },
      invalidatesTags: [{ type: "Events", id: "LIST" }]
    }),
    addEventNotif: build.mutation<
      { notifications: IEventNotification[] },
      {
        payload: AddEventNotifPayload;
        eventUrl: string;
      }
    >({
      query: ({ payload, eventUrl }) => {
        console.groupCollapsed("addEventNotif");
        console.log("addEventNotif: eventUrl", eventUrl);
        console.log("addEventNotif: payload", payload);
        console.groupEnd();

        return {
          url: `event/${eventUrl}`,
          method: "POST",
          body: payload
        };
      }
    }),
    deleteEvent: build.mutation<IEvent, { eventId: string }>({
      query: ({ eventId }) => ({ url: `event/${eventId}`, method: "DELETE" })
    }),
    editEvent: build.mutation<
      {},
      { payload: EditEventPayload; eventId?: string }
    >({
      query: ({ payload, eventId }) => {
        const id = eventId
          ? eventId
          : "_id" in payload
          ? payload._id
          : undefined;

        console.groupCollapsed("editEvent");
        console.log("eventId", id);
        console.log("payload", payload);
        console.groupEnd();

        return {
          url: `event/${id}`,
          method: "PUT",
          body: payload
        };
      }
    }),
    getEvent: build.query<IEvent, GetEventParams>({
      query: ({ eventUrl, email, populate }) => {
        console.groupCollapsed("getEvent");
        console.log("eventUrl", eventUrl);
        console.log("email", email);
        console.log("populate", populate);
        console.groupEnd();

        return {
          url: email
            ? `event/${eventUrl}/${email}`
            : populate
            ? `event/${eventUrl}?populate=${populate}`
            : `event/${eventUrl}`
        };
      }
    }),
    getEvents: build.query<IEvent[], { createdBy: string } | void>({
      query: (query) => {
        if (query) {
          console.groupCollapsed("getEvents");
          console.log("createdBy", query.createdBy);
          console.groupEnd();
        }

        return {
          url: `events${query ? `?${objectToQueryString(query)}` : ""}`
        };
      }
    })
  })
});

export const {
  useAddEventMutation,
  useAddEventNotifMutation,
  useDeleteEventMutation,
  useEditEventMutation,
  useGetEventQuery,
  useGetEventsQuery
} = eventApi;
export const {
  endpoints: { getEvent, getEvents, deleteEvent }
} = eventApi;
