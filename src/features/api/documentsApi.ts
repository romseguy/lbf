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

export interface IndexedRemoteImage extends RemoteImage {
  index: number;
}

export interface Video extends RemoteFile {
  fileName: string;
}

export const documentApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDocuments: build.query<
      (RemoteFile | RemoteImage)[],
      | { galleryId: string }
      | { eventId: string }
      | { orgId: string }
      | { userId: string }
      | {}
    >({
      query: (query) => {
        console.groupCollapsed("getDocuments");
        if ("galleryId" in query) console.log("galleryId", query.galleryId);
        else if ("eventId" in query) console.log("eventId", query.eventId);
        else if ("orgId" in query) console.log("orgId", query.orgId);
        else if ("userId" in query) console.log("userId", query.userId);
        console.groupEnd();

        return {
          url: `documents?${objectToQueryString(query)}`
        };
      }
    })
  }),
  overrideExisting: true
});

export const { useGetDocumentsQuery } = documentApi;
