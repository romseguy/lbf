import type { IEvent } from "models/Event";
import type { ITopic } from "models/Topic";
import { createApi } from "@reduxjs/toolkit/query/react";
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
    addEventDetails: build.mutation<
      ITopic,
      { payload: { topic?: ITopic }; eventUrl?: string }
    >({
      query: ({ payload, eventUrl }) => ({
        url: `event/${eventUrl}`,
        method: "POST",
        body: payload
      })
    }),
    deleteEvent: build.mutation<IEvent, string>({
      query: (eventUrl) => ({ url: `event/${eventUrl}`, method: "DELETE" })
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
    getEvent: build.query<IEvent, { eventUrl: string; email?: string }>({
      query: ({ eventUrl, email }) => ({
        url: `event/${eventUrl}${email ? `/${email}` : ""}`
      })
    }),
    getEvents: build.query<IEvent[], void>({
      query: () => ({ url: `events` })
    }),
    getEventsByUserId: build.query<IEvent[], string>({
      query: (userId) => ({ url: `events/${userId}` })
    })
  })
});

export const {
  useAddEventMutation,
  useAddEventDetailsMutation,
  useDeleteEventMutation,
  useEditEventMutation,
  useGetEventQuery,
  useGetEventsQuery,
  useGetEventsByUserIdQuery
} = eventApi;
export const {
  endpoints: { getEvent, getEvents, getEventsByUserId, deleteEvent }
} = eventApi;
