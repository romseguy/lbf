import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { IEvent } from "models/Event";
import { ITopicNotification } from "models/INotification";
import { IOrg } from "models/Org";
import { ITopic } from "models/Topic";
import { ITopicMessage } from "models/TopicMessage";
import baseQuery, { objectToQueryString } from "utils/query";
import { Optional } from "utils/types";

//const baseQueryWithRetry = retry(baseQuery, { maxRetries: 10 });

export interface AddTopicPayload {
  topic: Optional<
    Omit<ITopic, "topicNotifications" | "createdBy">,
    "_id" | "topicMessages"
  >;
  org?: Partial<IOrg>;
  event?: Partial<IEvent>;
}

export interface AddTopicNotifPayload {
  email?: string;
  event?: IEvent<string | Date>;
  org?: IOrg;
  orgListsNames?: string[];
}

export interface EditTopicPayload {
  topic: Partial<ITopic>;
  topicMessage?: ITopicMessage;
  topicMessageId?: string;
}

export const topicApi = createApi({
  reducerPath: "topicsApi", // We only specify this because there are many services. This would not be common in most applications
  //baseQuery: baseQueryWithRetry,
  baseQuery,
  tagTypes: ["Topics"],
  endpoints: (build) => ({
    addTopic: build.mutation<
      ITopic,
      {
        payload: AddTopicPayload;
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
    addTopicNotif: build.mutation<
      { notifications: ITopicNotification[] },
      {
        payload: AddTopicNotifPayload;
        topicId: string;
      }
    >({
      query: ({ payload, topicId }) => {
        console.groupCollapsed("addTopicNotif");
        console.log("addTopicNotif: topicId", topicId);
        console.log("addTopicNotif: payload", payload);
        console.groupEnd();

        return {
          url: `topic/${topicId}`,
          method: "POST",
          body: payload
        };
      }
    }),
    deleteTopic: build.mutation<ITopic, string>({
      query: (topicId) => ({ url: `topic/${topicId}`, method: "DELETE" })
    }),
    editTopic: build.mutation<
      {},
      {
        payload: EditTopicPayload;
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
  })
});

export const {
  useAddTopicMutation,
  // useAddTopicDetailsMutation,
  useAddTopicNotifMutation,
  useDeleteTopicMutation,
  useEditTopicMutation,
  useGetTopicsQuery
  // useGetTopicByNameQuery,
  // useGetTopicsByCreatorQuery
} = topicApi;

export const {
  endpoints: {
    /* getTopicByName, getTopics, getTopicsByCreator */
  }
} = topicApi;
