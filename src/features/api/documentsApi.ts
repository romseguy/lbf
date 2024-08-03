import { api, TagTypes } from "./";
import { objectToQueryString } from "utils/query";
import { IDocument } from "models/Document";
import { getRefId } from "models/Entity";

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
      },
      invalidatesTags: (result, error, params) => {
        let tags = [];
        const galleryId = result?.gallery._id || params.gallery._id;

        if (galleryId) {
          tags.push({
            type: TagTypes.GALLERIES,
            id: galleryId
          });
        }

        return tags;
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
      }),
      invalidatesTags: (result, error, documentId) => {
        let tags = [{ type: TagTypes.DOCUMENTS, id: "LIST" }];
        const galleryId = getRefId(result);
        if (galleryId) tags.push({ type: TagTypes.GALLERIES, id: galleryId });
        return tags;
      }
    })
  }),
  overrideExisting: true
});

export const { useAddDocumentMutation, useDeleteDocumentMutation } =
  documentApi;
