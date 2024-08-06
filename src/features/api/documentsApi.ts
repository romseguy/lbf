import { api, TagTypes } from "./";
import { objectToQueryString } from "utils/query";
import { IDocument } from "models/Document";
import { getRefId, isDocument } from "models/Entity";

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
    addDocument: build.mutation<
      { documentId: string; orgId?: string; galleryId?: string },
      AddDocumentPayload
    >({
      query: (payload) => {
        console.log("addDocument: payload", payload);

        return {
          url: `documents`,
          method: "POST",
          body: payload
        };
      },
      invalidatesTags: (result, error, doc) => {
        if (error || !result) return [];

        let tags = [{ type: TagTypes.DOCUMENTS, id: "LIST" }];

        if (result.orgId) {
          tags.push({ type: TagTypes.ORGS, id: result.orgId });
        } else if (result.galleryId) {
          tags.push({ type: TagTypes.GALLERIES, id: result.galleryId });
        }

        console.log("🚀 addDocument ~ tags:", tags);
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
    deleteDocument: build.mutation<
      IDocument | { orgId?: string; galleryId?: string },
      string
    >({
      query: (documentId) => ({
        url: `document/${documentId}`,
        method: "DELETE"
      }),
      invalidatesTags: (result, error, documentId) => {
        if (error || !result) return [];

        let tags = [{ type: TagTypes.DOCUMENTS, id: "LIST" }];

        if (isDocument(result)) {
          console.log("🚀 ~ result is a doc:", result);
          tags.push({
            type: TagTypes.GALLERIES,
            id: getRefId(result.gallery, "_id")
          });
        } else if (result.orgId) {
          console.log("🚀 ~ result is a orgId:", result);
          tags.push({ type: TagTypes.ORGS, id: result.orgId });
        } else if (result.galleryId) {
          console.log("🚀 ~ result is a galleryId:", result);
          tags.push({ type: TagTypes.GALLERIES, id: result.galleryId });
        }

        console.log("🚀 deleteDocument ~ tags:", tags);
        return tags;
      }
    })
  }),
  overrideExisting: true
});

export const { useAddDocumentMutation, useDeleteDocumentMutation } =
  documentApi;
