import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "utils/query";

export const api = createApi({
  baseQuery,
  tagTypes: ["Orgs", "Events", "Users"],
  endpoints: () => ({})
});
