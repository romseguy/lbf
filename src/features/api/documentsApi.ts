import { api } from "./";
import { objectToQueryString } from "utils/query";

export interface RemoteFile {
  url: string;
  time?: number;
  bytes: number;
}

export interface RemoteImage extends RemoteFile {
  height: number;
  width: number;
  type?: string;
  cached?: boolean;
}

export const documentApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDocuments: build.query<
      (RemoteFile | RemoteImage)[],
      { orgId: string } | { userId: string } | {}
    >({
      query: (query) => {
        console.groupCollapsed("getDocuments");
        if ("orgId" in query) console.log("orgId", query.orgId);
        if ("userId" in query) console.log("userId", query.userId);
        console.groupEnd();

        return {
          url: `documents?${objectToQueryString(query)}`
        };
      }
    })
  })
});

export const { useGetDocumentsQuery } = documentApi;
