import type { ISubscription } from "models/Subscription";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "utils/query";

export type AddSubscriptionPayload = Omit<ISubscription, "_id" | "createdBy">;

export const subscriptionApi = createApi({
  reducerPath: "subscriptionsApi",
  baseQuery,
  tagTypes: ["Subscriptions"],
  endpoints: (build) => ({
    addSubscription: build.mutation<ISubscription, AddSubscriptionPayload>({
      query: (payload) => {
        console.groupCollapsed("addSubscription");
        console.log("payload", payload);
        console.groupEnd();

        return {
          url: `subscriptions`,
          method: "POST",
          body: payload
        };
      },
      invalidatesTags: [{ type: "Subscriptions", id: "LIST" }]
    }),
    deleteSubscription: build.mutation<
      ISubscription,
      {
        payload?: Partial<ISubscription>;
        subscriptionId: string;
        orgId?: string;
        topicId?: string;
      }
    >({
      query: ({ payload, subscriptionId, orgId, topicId }) => {
        console.groupCollapsed("deleteSubscription");
        console.log("subscriptionId", subscriptionId);
        console.log("orgId", orgId);
        console.log("topicId", topicId);
        console.log("payload", payload);
        console.groupEnd();

        return {
          url: `subscription/${subscriptionId}`,
          method: "DELETE",
          body: payload ? payload : { orgId, topicId }
        };
      }
    }),
    editSubscription: build.mutation<
      ISubscription,
      { payload: Partial<ISubscription>; subscriptionId: string }
    >({
      query: ({ payload, subscriptionId }) => ({
        url: `subscription/${subscriptionId || payload._id}`,
        method: "PUT",
        body: payload
      })
    }),
    getSubscription: build.query<
      ISubscription,
      { email?: string; populate?: string }
    >({
      query: ({ email, populate }) => {
        if (!email) return "";

        console.groupCollapsed("getSubscription");
        console.log("email", email);
        console.groupEnd();

        return {
          url: `subscription/${email}${populate ? `?populate=${populate}` : ""}`
        };
      }
    }),
    getSubscriptions: build.query<ISubscription[], { topicId?: string }>({
      query: ({ topicId }) => ({
        url: `subscriptions${topicId ? `?topicId=${topicId}` : ""}`
      })
    })
    // getSubscription: build.query<ISubscription, string | undefined>({
    //   query: (string) => ({ url: `subscriptions/${string}` })
    // })
  })
});

export const {
  useAddSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useEditSubscriptionMutation,
  useGetSubscriptionQuery,
  useGetSubscriptionsQuery
} = subscriptionApi;

// export const {
//   endpoints: { getSubscription, getSubscriptions, deleteSubscription }
// } = subscriptionApi;
