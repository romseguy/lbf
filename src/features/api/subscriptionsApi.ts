import type { ISubscription } from "models/Subscription";
import { api } from "./";

export type AddSubscriptionPayload = Omit<ISubscription, "_id" | "createdBy">;

export const subscriptionApi = api.injectEndpoints({
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
      invalidatesTags: (result, error, params) => {
        return [
          { type: "Subscriptions", id: "LIST" },
          { type: "Subscriptions", id: params.email }
        ];
      }
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
      },
      invalidatesTags: (result, error, params) => {
        if (!error) {
          //const email = params.email;
          //console.log("🚀 ~ file: subscriptionsApi.ts:58 ~ email:", email);
          //if (email) return [{ type: "Subscriptions", email }];
          const id = params.subscriptionId || result?._id;
          if (id) return [{ type: "Subscriptions", id }];
        }
        return [];
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
        console.groupCollapsed("getSubscription");
        console.log("email", typeof email, email);
        console.groupEnd();

        if (!email) return "";

        return {
          url: `subscription/${email}${populate ? `?populate=${populate}` : ""}`
        };
      },
      providesTags: (result, error, params) => [
        { type: "Subscriptions" as const, id: params.email }
      ]
    }),
    getSubscriptions: build.query<ISubscription[], { topicId?: string }>({
      query: ({ topicId }) => ({
        url: `subscriptions${topicId ? `?topicId=${topicId}` : ""}`
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Subscriptions" as const,
                id: _id
              })),
              { type: "Subscriptions", id: "LIST" }
            ]
          : [{ type: "Subscriptions", id: "LIST" }]
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
