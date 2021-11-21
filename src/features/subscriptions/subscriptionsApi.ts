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
      query: ({ payload, email, phone, user }) => {
        console.log("addSubscription: email", email);
        console.log("addSubscription: phone", phone);
        console.log("addSubscription: user", user);
        console.log("addSubscription: payload", payload);
        return {
          url: `subscriptions`,
          method: "POST",
          body: { ...payload, email, phone, user }
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
        console.log("deleteSubscription: subscriptionId", subscriptionId);
        console.log("deleteSubscription: orgId", orgId);
        console.log("deleteSubscription: topicId", topicId);
        console.log("deleteSubscription: payload", payload);

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
        console.log("getSubscription: email", email);
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
