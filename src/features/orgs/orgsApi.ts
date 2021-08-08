import type { IOrg } from "models/Org";
import type { ITopic } from "models/Topic";
import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import baseQuery from "utils/query";

//const baseQueryWithRetry = retry(baseQuery, { maxRetries: 10 });

export const orgApi = createApi({
  reducerPath: "orgsApi", // We only specify this because there are many services. This would not be common in most applications
  //baseQuery: baseQueryWithRetry,
  baseQuery,
  tagTypes: ["Orgs"],
  endpoints: (build) => ({
    addOrg: build.mutation<IOrg, Partial<IOrg>>({
      query: (body) => ({
        url: `orgs`,
        method: "POST",
        body
      }),
      invalidatesTags: [{ type: "Orgs", id: "LIST" }]
    }),
    addOrgDetails: build.mutation<
      IOrg,
      { payload: { topic?: ITopic }; orgUrl?: string }
    >({
      query: ({ payload, orgUrl }) => ({
        url: `org/${orgUrl}`,
        method: "POST",
        body: payload
      })
    }),
    deleteOrg: build.mutation<IOrg, string>({
      query: (orgUrl) => ({ url: `org/${orgUrl}`, method: "DELETE" })
    }),
    editOrg: build.mutation<IOrg, { payload: Partial<IOrg>; orgUrl?: string }>({
      query: ({ payload, orgUrl }) => ({
        url: `org/${orgUrl || payload.orgUrl}`,
        method: "PUT",
        body: payload
      })
    }),
    getOrgs: build.query<IOrg[], undefined>({
      query: () => ({ url: `orgs` })
    }),
    getOrgByName: build.query<IOrg, string>({
      query: (orgUrl) => ({ url: `org/${orgUrl}` })
    }),
    getOrgsByCreator: build.query<IOrg[], string>({
      query: (createdBy) => ({ url: `orgs/${createdBy}` })
    })
  })
});

export const {
  useAddOrgMutation,
  useAddOrgDetailsMutation,
  useDeleteOrgMutation,
  useEditOrgMutation,
  useGetOrgsQuery,
  useGetOrgByNameQuery,
  useGetOrgsByCreatorQuery
} = orgApi;
export const {
  endpoints: { getOrgByName, getOrgs, getOrgsByCreator }
} = orgApi;
