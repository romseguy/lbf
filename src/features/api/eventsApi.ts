import { api, TagTypes } from "./";
import { IEvent } from "models/Event";
import { IEventNotification } from "models/INotification";
import { objectToQueryString } from "utils/query";

export type AddEventPayload<T> = Omit<IEvent<T>, "_id" | "createdBy">;

export interface AddEventNotifPayload {
  orgListsNames?: string[];
  email?: string;
}

export type EditEventPayload<T> = Partial<IEvent<T>> | string[];

export interface GetEventParams {
  eventUrl: string;
  email?: string;
  populate?: string;
}

export const eventApi = api.injectEndpoints({
  endpoints: (build) => ({
    addEvent: build.mutation<IEvent, AddEventPayload<Date>>({
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
      invalidatesTags: (result, error, params) =>
        result
          ? [
              ...result.eventOrgs.map((org) => ({
                type: TagTypes.ORGS,
                id: org._id
              })),
              { type: TagTypes.EVENTS, id: "LIST" }
            ]
          : [{ type: TagTypes.EVENTS, id: "LIST" }]
    }),
    // addEventNotif: build.mutation<
    //   { notifications: IEventNotification[] },
    //   {
    //     payload: AddEventNotifPayload;
    //     eventId: string;
    //   }
    // >({
    //   query: ({ payload, eventId }) => {
    //     console.groupCollapsed("addEventNotif");
    //     console.log("addEventNotif: eventId", eventId);
    //     console.log("addEventNotif: payload", payload);
    //     console.groupEnd();

    //     return {
    //       url: `event/${eventId}`,
    //       method: "POST",
    //       body: payload
    //     };
    //   },
    //   invalidatesTags: (result, error, params) => [
    //     { types: TagTypes.EVENTS, id: params.eventId }
    //   ]
    // }),
    deleteEvent: build.mutation<IEvent, { eventId: string }>({
      query: ({ eventId }) => ({ url: `event/${eventId}`, method: "DELETE" }),
      invalidatesTags: (result, error, params) =>
        result
          ? [
              ...result.eventOrgs.map((org) => ({
                type: TagTypes.ORGS,
                id: org._id
              })),
              { type: TagTypes.EVENTS, id: "LIST" }
            ]
          : [
              { type: TagTypes.ORGS, id: "LIST" },
              { type: TagTypes.EVENTS, id: "LIST" }
            ]
    }),
    editEvent: build.mutation<
      IEvent,
      { payload: EditEventPayload<Date>; eventId?: string }
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
      },
      invalidatesTags: (result, error, params) =>
        result
          ? [
              ...result.eventOrgs.map((org) => ({
                type: TagTypes.ORGS,
                id: org._id
              })),
              { type: TagTypes.EVENTS, id: params.eventId }
            ]
          : [{ type: TagTypes.EVENTS, id: params.eventId }]
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
      },
      providesTags: (result, error, params) => [
        { type: TagTypes.EVENTS, id: result?._id }
      ]
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
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: TagTypes.EVENTS,
                id: _id
              })),
              { type: TagTypes.EVENTS, id: "LIST" }
            ]
          : [{ type: TagTypes.EVENTS, id: "LIST" }]
    })
  }),
  overrideExisting: true
});

export const {
  useAddEventMutation,
  //useAddEventNotifMutation,
  useDeleteEventMutation,
  useEditEventMutation,
  useGetEventQuery,
  useGetEventsQuery
} = eventApi;
export const { getEvent, getEvents, deleteEvent } = eventApi.endpoints;
