import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "store";
import type { IOrgSubscription } from "models/Subscription";
import type { IOrg } from "models/Org";
import { createSlice } from "@reduxjs/toolkit";
import { SubscriptionTypes } from "models/Subscription";

export const isFollowedBy = (org?: IOrg, subQuery?: any) => {
  if (!org || !subQuery) return false;

  return !!subQuery.data?.orgs?.find(
    (orgSubscription: IOrgSubscription) =>
      (orgSubscription.orgId === org._id &&
        orgSubscription.type === SubscriptionTypes.FOLLOWER) ||
      orgSubscription.type === SubscriptionTypes.BOTH
  );
};

export const isSubscribedBy = (org?: IOrg, subQuery?: any) => {
  if (!org || !subQuery) return false;

  return !!subQuery.data?.orgs?.find(
    (orgSubscription: IOrgSubscription) =>
      (orgSubscription.orgId === org._id &&
        orgSubscription.type === SubscriptionTypes.SUBSCRIBER) ||
      orgSubscription.type === SubscriptionTypes.BOTH
  );
};

type SubscriptionState = {
  subscriptionRefetch: boolean;
};

const initialState: SubscriptionState = {
  subscriptionRefetch: false
};

export const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    subscriptionRefetch: (state, action: PayloadAction<undefined>) => {
      state.subscriptionRefetch = !state.subscriptionRefetch;
    }
  }
});

export const { subscriptionRefetch } = subscriptionSlice.actions;

export const selectSubscriptionRefetch = (state: AppState) =>
  state.subscription.subscriptionRefetch;

export default subscriptionSlice.reducer;
