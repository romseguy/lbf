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
import { SubscriptionTypes } from "models/Subscription";

export const getFollowerSubscription = ({
  event,
  org,
  subQuery,
  subscription
}: {
  event?: IEvent;
  org?: IOrg;
  subQuery?: any;
  subscription?: ISubscription;
}): IOrgSubscription | IEventSubscription | undefined => {
  if (!org && !event) return;

  if (subQuery?.data || subscription) {
    if (org) {
      return (subQuery?.data || subscription).orgs?.find(
        (orgSubscription: IOrgSubscription) =>
          orgSubscription.orgId === org._id &&
          orgSubscription.type === SubscriptionTypes.FOLLOWER
      );
    }

    if (event) {
      return (subQuery?.data || subscription).events?.find(
        (eventSubscription: IEventSubscription) =>
          eventSubscription.eventId === event._id
      );
    }
  }
};

export const getSubscriberSubscription = ({
  org,
  subQuery,
  subscription
}: {
  org?: IOrg;
  subQuery?: any;
  subscription?: ISubscription;
}) => {
  if (!org) return;

  if (subQuery?.data || subscription) {
    return (subQuery?.data || subscription).orgs?.find(
      (orgSubscription: IOrgSubscription) =>
        orgSubscription.orgId === org._id &&
        orgSubscription.type === SubscriptionTypes.SUBSCRIBER
    );
  }
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
