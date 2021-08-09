import type { ITopic } from "models/Topic";
import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import baseQuery from "utils/query";

//const baseQueryWithRetry = retry(baseQuery, { maxRetries: 10 });

export const topicsApi = createApi({
  reducerPath: "topicsApi", // We only specify this because there are many services. This would not be common in most applications
  //baseQuery: baseQueryWithRetry,
  baseQuery,
  tagTypes: ["Topics"],
  endpoints: (build) => ({
    // addTopic: build.mutation<ITopic, Partial<ITopic>>({
    //   query: (body) => ({
    //     url: `topics`,
    //     method: "POST",
    //     body
    //   }),
    //   invalidatesTags: [{ type: "Topics", id: "LIST" }]
    // }),
    // addTopicDetails: build.mutation<
    //   ITopic,
    //   { payload: { topic?: ITopic }; topicUrl?: string }
    // >({
    //   query: ({ payload, topicUrl }) => ({
    //     url: `topic/${topicUrl}`,
    //     method: "POST",
    //     body: payload
    //   })
    // }),
    deleteTopic: build.mutation<ITopic, string>({
      query: (topicId) => ({ url: `topic/${topicId}`, method: "DELETE" })
    })
    // editTopic: build.mutation<ITopic, { payload: Partial<ITopic>; topicUrl?: string }>({
    //   query: ({ payload, topicUrl }) => ({
    //     url: `topic/${topicUrl || payload.topicUrl}`,
    //     method: "PUT",
    //     body: payload
    //   })
    // }),
    // getTopics: build.query<ITopic[], undefined>({
    //   query: () => ({ url: `topics` })
    // }),
    // getTopicByName: build.query<ITopic, string>({
    //   query: (topicUrl) => ({ url: `topic/${topicUrl}` })
    // }),
    // getTopicsByCreator: build.query<ITopic[], string>({
    //   query: (createdBy) => ({ url: `topics/${createdBy}` })
    // })
  })
});

export const {
  // useAddTopicMutation,
  // useAddTopicDetailsMutation,
  useDeleteTopicMutation
  // useEditTopicMutation,
  // useGetTopicsQuery,
  // useGetTopicByNameQuery,
  // useGetTopicsByCreatorQuery
} = topicsApi;
export const {
  endpoints: {
    /* getTopicByName, getTopics, getTopicsByCreator */
  }
} = topicsApi;
