import { createApi } from "@reduxjs/toolkit/query/react";
import type { ISubscription } from "models/Subscription";
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
      }
    >({
      query: ({ payload, email }) => ({
        url: `subscriptions`,
        method: "POST",
        body: { ...payload, email }
      }),
      invalidatesTags: [{ type: "Subscriptions", id: "LIST" }]
    }),
    deleteSubscription: build.mutation<
      ISubscription,
      { payload: Partial<ISubscription>; subscriptionId: string }
    >({
      query: ({ payload, subscriptionId }) => ({
        url: `subscription/${subscriptionId}`,
        method: "DELETE",
        body: payload
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
    getSubscription: build.query<ISubscription, string>({
      query: (userId) => ({ url: `subscription/${userId}` })
    })
    // getSubscriptionByName: build.query<ISubscription, string>({
    //   query: (subscriptionName) => ({ url: `subscription/${subscriptionName}` })
    // }),
    // getSubscriptionByEmail: build.query<ISubscription, string>({
    //   query: (email) => ({ url: `subscription/${email}` })
    // })
  })
});

export const {
  useAddSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useEditSubscriptionMutation,
  useGetSubscriptionQuery
  // useGetSubscriptionByNameQuery,
  // useGetSubscriptionByEmailQuery
} = subscriptionApi;
export const {
  endpoints: { getSubscription }
} = subscriptionApi;
