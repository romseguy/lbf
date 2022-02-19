import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "store";
import type { IEvent } from "models/Event";
import type { IOrg } from "models/Org";
import type {
  IEventSubscription,
  IOrgSubscription,
  ISubscription
} from "models/Subscription";
import { createSlice } from "@reduxjs/toolkit";
import { ESubscriptionType } from "models/Subscription";

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
