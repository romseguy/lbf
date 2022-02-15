import { createApi } from "@reduxjs/toolkit/query/react";
import { IOrg } from "models/Org";
import baseQuery, { objectToQueryString } from "utils/query";

export type AddOrgPayload = Omit<IOrg, "_id">;

export type GetOrgParams = {
  orgUrl: string;
  hash?: string | void;
  populate?: string;
};

export const orgApi = createApi({
  reducerPath: "orgsApi",
  baseQuery,
  tagTypes: ["Orgs"],
  endpoints: (build) => ({
    addOrg: build.mutation<IOrg, AddOrgPayload>({
      query: (payload) => {
        console.groupCollapsed("addOrg");
        console.log("payload", payload);
        console.groupEnd();

        return {
          url: `orgs`,
          method: "POST",
          body: payload
        };
      },
      invalidatesTags: [{ type: "Orgs", id: "LIST" }]
    }),
    deleteOrg: build.mutation<IOrg, string>({
      query: (orgUrl) => ({ url: `org/${orgUrl}`, method: "DELETE" })
    }),
    editOrg: build.mutation<
      {},
      { payload: Partial<IOrg> | string[]; orgUrl?: string }
    >({
      query: ({ payload, orgUrl }) => {
        console.groupCollapsed("editOrg");
        console.log("orgUrl", orgUrl);
        console.log("payload", payload);
        console.groupEnd();

        return {
          url: `org/${
            orgUrl ? orgUrl : "orgUrl" in payload ? payload.orgUrl : undefined
          }`,
          method: "PUT",
          body: payload
        };
      }
    }),
    getOrg: build.query<IOrg, GetOrgParams>({
      query: ({ orgUrl, ...query }) => {
        console.groupCollapsed("getOrg");
        console.log("orgUrl", orgUrl);
        console.log("hash", query.hash);
        console.log("populate", query.populate);
        console.groupEnd();

        return {
          url: `org/${orgUrl}?${objectToQueryString(query)}`
        };
      }
    }),
    getOrgs: build.query<
      IOrg[],
      { populate?: string; createdBy?: string } | void
    >({
      query: (query) => {
        console.groupCollapsed("getOrgs");
        if (query) {
          console.log("createdBy", query.createdBy);
          console.log("populate", query.populate);
        }
        console.groupEnd();

        return {
          url: `orgs${query ? `?${objectToQueryString(query)}` : ""}`
        };
      }
    })
  })
});

export const {
  useAddOrgMutation,
  useDeleteOrgMutation,
  useEditOrgMutation,
  useGetOrgQuery,
  useGetOrgsQuery
} = orgApi;
export const {
  endpoints: { getOrg, getOrgs }
} = orgApi;
