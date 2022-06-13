import { api } from "features/api";
import { objectToQueryString } from "utils/query";

export const documentApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDocuments: build.query<
      string[],
      { orgId: string } | { userId: string } | {}
    >({
      query: (query) => {
        console.groupCollapsed("getDocuments");
        if ("orgId" in query) console.log("orgId", query.orgId);
        if ("userId" in query) console.log("userId", query.userId);
        console.groupEnd();

        return {
          url: `${process.env.NEXT_PUBLIC_API2}?${objectToQueryString(query)}`
        };
      }
    })
  })
});

export const { useGetDocumentsQuery } = documentApi;
