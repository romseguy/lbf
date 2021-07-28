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
      { payload: { topic?: ITopic }; orgName?: string }
    >({
      query: ({ payload, orgName }) => ({
        url: `org/${orgName}`,
        method: "POST",
        body: payload
      })
    }),
    deleteOrg: build.mutation<IOrg, string>({
      query: (orgName) => ({ url: `org/${orgName}`, method: "DELETE" })
    }),
    editOrg: build.mutation<IOrg, { payload: Partial<IOrg>; orgName?: string }>(
      {
        query: ({ payload, orgName }) => ({
          url: `org/${orgName || payload.orgName}`,
          method: "PUT",
          body: payload
        })
      }
    ),
    getOrgByName: build.query<IOrg, string>({
      query: (orgName) => ({ url: `org/${orgName}` })
    }),
    getOrgsByCreator: build.query<IOrg[], void>({
      query: (createdBy) => ({ url: `org?userId=${createdBy}` })
    })
  })
});

export const {
  useAddOrgMutation,
  useAddOrgDetailsMutation,
  useDeleteOrgMutation,
  useEditOrgMutation,
  useGetOrgByNameQuery,
  useGetOrgsByCreatorQuery
} = orgApi;
export const {
  endpoints: { getOrgByName, getOrgsByCreator }
} = orgApi;
