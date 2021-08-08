import type { ISubscription } from "models/Subscription";
import type { IUser } from "models/User";
import { createApi } from "@reduxjs/toolkit/query/react";
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
        user?: IUser | string;
      }
    >({
      query: ({ payload, email, user }) => ({
        url: `subscriptions`,
        method: "POST",
        body: { ...payload, email, user }
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
    getSubscription: build.query<ISubscription, string | undefined>({
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
