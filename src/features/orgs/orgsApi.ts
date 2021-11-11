import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "utils/query";
import { IOrg } from "models/Org";

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
        console.log("editOrg: orgUrl", orgUrl);
        console.log("editOrg: payload", payload);

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
      query: ({ orgUrl, populate }) => ({
        url: populate ? `org/${orgUrl}?populate=${populate}` : `org/${orgUrl}`
      })
    }),
    getOrgs: build.query<
      IOrg[],
      { populate?: string; createdBy?: string } | void
    >({
      query: ({ populate, createdBy } = {}) => {
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
