import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "utils/query";

export const documentApi = createApi({
  reducerPath: "documentsApi",
  baseQuery,
  tagTypes: ["Documents"],
  endpoints: (build) => ({
    addDocument: build.mutation<any, any>({
      query: (body) => ({
        url: process.env.NEXT_PUBLIC_API2,
        method: "POST",
        body
      })
    }),
    getDocuments: build.query<string, any>({
      query: (orgId) => {
        return {
          url: `${process.env.NEXT_PUBLIC_API2}?orgId=${orgId}`
        };
      }
    })
  })
});

export const { useAddDocumentMutation, useGetDocumentsQuery } = documentApi;
