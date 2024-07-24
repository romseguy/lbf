import { createApi } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";
import baseQuery from "utils/query";

export const api = createApi({
  baseQuery,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: [
    "Orgs",
    "Events",
    "Galleries",
    "Projects",
    "Subscriptions",
    "Topics",
    "Users"
  ],
  endpoints: () => ({})
});

export const {
  util: { getRunningQueriesThunk }
} = api;
