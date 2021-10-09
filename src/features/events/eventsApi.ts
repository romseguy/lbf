import { createApi } from "@reduxjs/toolkit/query/react";
import type { IEvent } from "models/Event";
import baseQuery from "utils/query";

export const eventApi = createApi({
  reducerPath: "eventsApi",
  baseQuery,
  tagTypes: ["Events"],
  endpoints: (build) => ({
    addEvent: build.mutation<IEvent, Partial<IEvent>>({
      query: (body) => ({
        url: `events`,
        method: "POST",
        body
      }),
      invalidatesTags: [{ type: "Events", id: "LIST" }]
    }),
    postEventNotif: build.mutation<
      { emailList: string[] },
      {
        payload: { orgIds?: string[]; email?: string };
        eventUrl?: string;
      }
    >({
      query: ({ payload, eventUrl }) => ({
        url: `event/${eventUrl}`,
        method: "POST",
        body: payload
      })
    }),
    deleteEvent: build.mutation<IEvent, { eventUrl: string }>({
      query: ({ eventUrl }) => ({ url: `event/${eventUrl}`, method: "DELETE" })
    }),
    editEvent: build.mutation<
      { emailList?: string[] },
      { payload: Partial<IEvent>; eventUrl?: string }
    >({
      query: ({ payload, eventUrl }) => ({
        url: `event/${eventUrl || payload.eventUrl}`,
        method: "PUT",
        body: payload
      })
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
    getEvents: build.query<IEvent[], string | undefined>({
      query: (populate) => ({
        url: `events${populate ? `?populate=${populate}` : ""}`
      })
    }),
    getEventsByUserId: build.query<IEvent[], string>({
      query: (userId) => ({ url: `events/${userId}` })
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
