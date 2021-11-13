import { createApi } from "@reduxjs/toolkit/query/react";
import querystring from "querystring";
import { IEvent } from "models/Event";
import baseQuery from "utils/query";

export const eventApi = createApi({
  reducerPath: "eventsApi",
  baseQuery,
  tagTypes: ["Events"],
  endpoints: (build) => ({
    addEvent: build.mutation<IEvent, Partial<IEvent>>({
      query: (body) => {
        console.log("addEvent: payload", body);

        return {
          url: `events`,
          method: "POST",
          body
        };
      },
      invalidatesTags: [{ type: "Events", id: "LIST" }]
    }),
    deleteEvent: build.mutation<IEvent, { eventUrl: string }>({
      query: ({ eventUrl }) => ({ url: `event/${eventUrl}`, method: "DELETE" })
    }),
    editEvent: build.mutation<
      {},
      { payload: Partial<IEvent> | string[]; eventUrl?: string }
    >({
      query: ({ payload, eventUrl }) => {
        console.log("editEvent: eventUrl", eventUrl);
        console.log("editEvent: payload", payload);

        return {
          url: `event/${
            eventUrl
              ? eventUrl
              : "eventUrl" in payload
              ? payload.eventUrl
              : undefined
          }`,
          method: "PUT",
          body: payload
        };
      }
    }),
    getEvent: build.query<
      IEvent,
      { eventUrl: string; email?: string; populate?: string }
    >({
      query: ({ eventUrl, email, populate }) => ({
        url: email
          ? `event/${eventUrl}/${email}`
          : populate
          ? `event/${eventUrl}?populate=${populate}`
          : `event/${eventUrl}`
      })
    }),
    getEvents: build.query<IEvent[], { userId: string } | void>({
      query: (query) => ({
        url: `events${query ? "?" + querystring.stringify(query) : ""}`
      })
    }),
    getEventsByUserId: build.query<IEvent[], string>({
      query: (userId) => ({ url: `events/${userId}` })
    }),
    postEventNotif: build.mutation<
      { emailList: string[] },
      {
        payload: { lists?: string[]; email?: string };
        eventUrl?: string;
      }
    >({
      query: ({ payload, eventUrl }) => ({
        url: `event/${eventUrl}`,
        method: "POST",
        body: payload
      })
    })
  })
});

export const {
  useAddEventMutation,
  usePostEventNotifMutation,
  useDeleteEventMutation,
  useEditEventMutation,
  useGetEventQuery,
  useGetEventsQuery,
  useGetEventsByUserIdQuery
} = eventApi;
export const {
  endpoints: { getEvent, getEvents, getEventsByUserId, deleteEvent }
} = eventApi;
