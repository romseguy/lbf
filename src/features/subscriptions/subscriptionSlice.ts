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
      orgSubscription.orgId === org._id &&
      orgSubscription.type === SubscriptionTypes.FOLLOWER
  );
};

export const isSubscribedBy = (org?: IOrg, subQuery?: any) => {
  if (!org || !subQuery) return false;

  return !!subQuery.data?.orgs?.find(
    (orgSubscription: IOrgSubscription) =>
      orgSubscription.orgId === org._id &&
      orgSubscription.type === SubscriptionTypes.SUBSCRIBER
  );
};

type SubscriptionState = {
  refetchSubscription: boolean;
};

const initialState: SubscriptionState = {
  refetchSubscription: false
};

export const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    refetchSubscription: (state, action: PayloadAction<undefined>) => {
      state.refetchSubscription = !state.refetchSubscription;
    }
  }
});

export const { refetchSubscription } = subscriptionSlice.actions;

export const selectSubscriptionRefetch = (state: AppState) =>
  state.subscription.refetchSubscription;

export default subscriptionSlice.reducer;
