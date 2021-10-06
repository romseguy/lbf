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
    getOrg: build.query<IOrg, { orgUrl: string; populate?: string }>({
      query: ({ orgUrl, populate }) => ({
        url: populate ? `org/${orgUrl}?populate=${populate}` : `org/${orgUrl}`
      })
    }),
    getOrgs: build.query<IOrg[], { populate?: string; createdBy?: string }>({
      query: ({ populate, createdBy }) => {
        let url = "orgs";

        if (populate) {
          url += `?populate=${populate}`;
          if (createdBy) url += `&createdBy=${createdBy}`;
        } else if (createdBy) url += `?createdBy=${createdBy}`;

        return {
          url
        };
      }
    }),
    getOrgsByUserId: build.query<IOrg[], string>({
      query: (userId) => ({ url: `orgs/${userId}` })
    })
  })
});

export const {
  useAddOrgMutation,
  useDeleteOrgMutation,
  useEditOrgMutation,
  useGetOrgQuery,
  useGetOrgsQuery,
  useGetOrgsByUserIdQuery
} = orgApi;
export const {
  endpoints: { getOrg, getOrgs, getOrgsByUserId }
} = orgApi;
