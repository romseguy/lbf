import { createApi } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";
import baseQuery from "utils/query";

export enum TagTypes {
  ORGS = "Orgs",
  EVENTS = "Events",
  GALLERIES = "Galleries",
  DOCUMENTS = "Documents",
  //PROJECTS = "Projects",
  SUBSCRIPTIONS = "Subscriptions",
  TOPICS = "Topics",
  USERS = "Users"
}

const tagTypes = [
  TagTypes.ORGS,
  TagTypes.EVENTS,
  TagTypes.GALLERIES,
  TagTypes.DOCUMENTS,
  //TagTypes.PROJECTS,
  TagTypes.SUBSCRIPTIONS,
  TagTypes.TOPICS,
  TagTypes.USERS
];

export const api = createApi({
  baseQuery,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes,
  endpoints: () => ({})
});

export const {
  util: { getRunningQueriesThunk }
} = api;
