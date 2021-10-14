import type { ISubscription } from "models/Subscription";
import type { IUser } from "models/User";
import { createApi, FetchArgs } from "@reduxjs/toolkit/query/react";
import baseQuery from "utils/query";

export const subscriptionApi = createApi({
  reducerPath: "subscriptionsApi",
  baseQuery,
  tagTypes: ["Subscriptions"],
  endpoints: (build) => ({
    addSubscription: build.mutation<
      ISubscription,
      {
        payload: Partial<ISubscription>;
        email?: string;
        phone?: string;
        user?: IUser | string;
      }
    >({
      query: ({ payload, email, phone, user }) => ({
        url: `subscriptions`,
        method: "POST",
        body: { ...payload, email, phone, user }
      }),
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
      query: ({ payload, subscriptionId, orgId, topicId }) => ({
        url: `subscription/${subscriptionId}`,
        method: "DELETE",
        body: payload ? payload : { orgId, topicId }
      })
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
    getSubscription: build.query<ISubscription, string | null | undefined>({
      // slug is either :
      // - email
      // - user._id
      // - subscription._id
      query: (slug) => ({
        url: `subscription/${slug || ""}`
      })
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
export const {
  endpoints: { getSubscription, deleteSubscription }
} = subscriptionApi;
