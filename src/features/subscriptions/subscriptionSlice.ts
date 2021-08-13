import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "store";
import type { IEvent } from "models/Event";
import type { IOrg } from "models/Org";
import type { IEventSubscription, IOrgSubscription } from "models/Subscription";
import { createSlice } from "@reduxjs/toolkit";
import { SubscriptionTypes } from "models/Subscription";

export const isFollowedBy = ({
  event,
  org,
  subQuery
}: {
  event?: IEvent;
  org?: IOrg;
  subQuery?: any;
}): IOrgSubscription | IEventSubscription | undefined => {
  if ((!org && !event) || !subQuery || !subQuery.data) return undefined;

  if (org) {
    return subQuery.data.orgs.find(
      (orgSubscription: IOrgSubscription) =>
        orgSubscription.orgId === org._id &&
        orgSubscription.type === SubscriptionTypes.FOLLOWER
    );
  }

  if (event) {
    return subQuery.data.events.find(
      (eventSubscription: IEventSubscription) =>
        eventSubscription.eventId === event._id
    );
  }

  return undefined;
};

export const isSubscribedBy = (org?: IOrg, subQuery?: any) => {
  if (!org || !subQuery || !subQuery.data) return false;

  return !!subQuery.data.orgs?.find(
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
