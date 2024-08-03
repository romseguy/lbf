import type { ISubscription } from "models/Subscription";
import { api, TagTypes } from "./";

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
      //@ts-ignore
      invalidatesTags: (result, error, params) => {
        if (error) return [];

        const arr = [
          { type: TagTypes.SUBSCRIPTIONS, id: "LIST" },
          { type: TagTypes.SUBSCRIPTIONS, id: params.email }
        ];

        if (Array.isArray(params.orgs)) {
          for (const orgSubscription of params.orgs) {
            arr.push({ type: TagTypes.ORGS, id: orgSubscription.org._id });
          }
        }

        return arr;
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
      //@ts-ignore
      invalidatesTags: (result, error, params) => {
        if (error) return [];

        let arr = [];

        if (params.orgId) arr.push({ type: "Orgs", id: params.orgId });

        //const email = params.email;
        //if (email) return [{ type: TagTypes.SUBSCRIPTIONS, email }];
        const id = params.subscriptionId || result?._id;
        if (id) arr.push({ type: TagTypes.SUBSCRIPTIONS, id });

        return arr;
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
        console.log("populate", populate);
        console.groupEnd();

        if (!email) return "";

        return {
          url: `subscription/${email}${populate ? `?populate=${populate}` : ""}`
        };
      },
      providesTags: (result, error, params) => [
        { type: TagTypes.SUBSCRIPTIONS, id: params.email }
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
                type: TagTypes.SUBSCRIPTIONS,
                id: _id
              })),
              { type: TagTypes.SUBSCRIPTIONS, id: "LIST" }
            ]
          : [{ type: TagTypes.SUBSCRIPTIONS, id: "LIST" }]
    })
    // getSubscription: build.query<ISubscription, string | undefined>({
    //   query: (string) => ({ url: `subscriptions/${string}` })
    // })
  }),
  overrideExisting: true
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
