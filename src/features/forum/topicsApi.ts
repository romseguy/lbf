import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { AddTopicParams, EditTopicParams } from "api/forum";
import { IEvent } from "models/Event";
import { ITopicNotification } from "models/INotification";
import { IOrg } from "models/Org";
import { ITopic } from "models/Topic";
import { ITopicMessage } from "models/TopicMessage";
import baseQuery, { objectToQueryString } from "utils/query";

//const baseQueryWithRetry = retry(baseQuery, { maxRetries: 10 });

export const topicsApi = createApi({
  reducerPath: "topicsApi", // We only specify this because there are many services. This would not be common in most applications
  //baseQuery: baseQueryWithRetry,
  baseQuery,
  tagTypes: ["Topics"],
  endpoints: (build) => ({
    addTopic: build.mutation<
      ITopic,
      {
        payload: AddTopicParams;
      }
    >({
      query: ({ payload }) => {
        console.log("addTopic: payload", payload);

        return {
          url: `topics`,
          method: "POST",
          body: payload
        };
      },
      invalidatesTags: [{ type: "Topics", id: "LIST" }]
    }),
    deleteTopic: build.mutation<ITopic, string>({
      query: (topicId) => ({ url: `topic/${topicId}`, method: "DELETE" })
    }),
    editTopic: build.mutation<
      {},
      {
        payload: EditTopicParams;
        topicId?: string;
      }
    >({
      query: ({ payload, topicId }) => {
        console.groupCollapsed("editTopic");
        console.log("editTopic: topicId", topicId);
        console.log("editTopic: payload", payload);
        console.groupEnd();

        return {
          url: `topic/${topicId ? topicId : payload.topic._id}`,
          method: "PUT",
          body: payload
        };
      }
    }),
    postTopicNotif: build.mutation<
      { notifications: ITopicNotification[] },
      {
        payload: {
          event?: IEvent;
          orgListsNames?: string[];
        };
        topicId: string;
      }
    >({
      query: ({ payload, topicId }) => {
        console.groupCollapsed("postTopicNotif");
        console.log("postTopicNotif: topicId", topicId);
        console.log("postTopicNotif: payload", payload);
        console.groupEnd();

        return {
          url: `topic/${topicId}`,
          method: "POST",
          body: payload
        };
      }
    }),
    getTopics: build.query<
      ITopic[],
      { createdBy?: string; populate?: string } | void
    >({
      query: (query) => {
        console.groupCollapsed("getTopics");
        if (query) {
          console.log("query", query);
        }
        console.groupEnd();

        return {
          url: `topics${query ? `?${objectToQueryString(query)}` : ""}`
        };
      }
    })
    // getTopicByName: build.query<ITopic, string>({
    //   query: (topicUrl) => ({ url: `topic/${topicUrl}` })
    // }),
  })
});

export const {
  useAddTopicMutation,
  // useAddTopicDetailsMutation,
  usePostTopicNotifMutation,
  useDeleteTopicMutation,
  useEditTopicMutation,
  useGetTopicsQuery
  // useGetTopicByNameQuery,
  // useGetTopicsByCreatorQuery
} = topicsApi;

export const {
  endpoints: {
    /* getTopicByName, getTopics, getTopicsByCreator */
  }
} = topicsApi;
