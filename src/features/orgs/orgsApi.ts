import { createApi } from "@reduxjs/toolkit/query/react";
import { IOrg } from "models/Org";
import baseQuery, { objectToQueryString } from "utils/query";

export const orgApi = createApi({
  reducerPath: "orgsApi",
  baseQuery,
  tagTypes: ["Orgs"],
  endpoints: (build) => ({
    addOrg: build.mutation<IOrg, Partial<IOrg>>({
      query: (body) => {
        console.log("addOrg: payload", body);

        return {
          url: `orgs`,
          method: "POST",
          body
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
        console.group("editOrg");
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
    getOrg: build.query<IOrg, { orgUrl: string; populate?: string }>({
      query: ({ orgUrl, populate }) => {
        console.group("getOrg");
        console.log("orgUrl", orgUrl);
        console.log("populate", populate);
        console.groupEnd();

        return {
          url: populate ? `org/${orgUrl}?populate=${populate}` : `org/${orgUrl}`
        };
      }
    }),
    getOrgs: build.query<
      IOrg[],
      { populate?: string; createdBy?: string } | void
    >({
      query: (query) => {
        if (query) {
          console.group("getOrgs");
          console.log("createdBy", query.createdBy);
          console.log("populate", query.populate);
          console.groupEnd();
        }

        return {
          url: `orgs${query ? `?${objectToQueryString(query)}` : ""}`
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
