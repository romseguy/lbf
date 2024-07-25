import { api } from "./";
import { objectToQueryString } from "utils/query";
import { IDocument } from "models/Document";

export type AddDocumentPayload = Omit<IDocument, "_id">;

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

export interface Video extends RemoteFile {
  fileName: string;
}

export type GetDocumentsParams = Record<string, string | undefined>;

export const documentApi = api.injectEndpoints({
  endpoints: (build) => ({
    addDocument: build.mutation<IDocument, AddDocumentPayload>({
      query: (payload) => {
        console.log("addDocument: payload", payload);

        return {
          url: `documents`,
          method: "POST",
          body: payload
        };
      }
    }),
    getDocuments: build.query<(RemoteFile | RemoteImage)[], GetDocumentsParams>(
      {
        query: (query) => {
          console.groupCollapsed("getDocuments");
          console.log("query", query);
          console.groupEnd();

          return {
            url: `documents?${objectToQueryString(query)}`
          };
        }
      }
    ),
    deleteDocument: build.mutation<IDocument, string>({
      query: (documentId) => ({
        url: `document/${documentId}`,
        method: "DELETE"
      })
    })
  }),
  overrideExisting: true
});

export const { useAddDocumentMutation, useDeleteDocumentMutation } =
  documentApi;
