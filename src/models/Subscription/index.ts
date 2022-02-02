import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { hasItems } from "utils/array";
import { equals, logJson } from "utils/string";
import {
  IOrgSubscription,
  IEventSubscription,
  ISubscription,
  SubscriptionTypes,
  TagType
} from "./ISubscription";

export * from "./ISubscription";

export const isOrgSubscription = (
  followerSubscription: IOrgSubscription | IEventSubscription
): followerSubscription is IOrgSubscription => {
  return (followerSubscription as IOrgSubscription).orgId !== undefined;
};

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
          equals(orgSubscription.orgId, org._id) &&
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
}): IOrgSubscription | undefined => {
  if (org && (subQuery?.data || subscription)) {
    return (subQuery?.data || subscription).orgs?.find(
      (orgSubscription: IOrgSubscription) =>
        equals(orgSubscription.orgId, org._id) &&
        orgSubscription.type === SubscriptionTypes.SUBSCRIBER
    );
  }
};

export const setFollowerSubscriptionTagType = (
  newTagType: TagType,
  followerSubscription: IOrgSubscription | IEventSubscription
): IOrgSubscription | IEventSubscription => {
  if (!hasItems(followerSubscription.tagTypes)) {
    followerSubscription.tagTypes = [newTagType];
    return followerSubscription;
  }

  if (
    followerSubscription.tagTypes?.find(
      (tagType) => tagType.type === newTagType.type
    )
  ) {
    followerSubscription.tagTypes = followerSubscription.tagTypes
      .filter((tagType) => tagType.type !== newTagType.type)
      .concat([newTagType]);
  } else {
    followerSubscription.tagTypes = (
      followerSubscription.tagTypes || []
    ).concat([newTagType]);
  }

  return followerSubscription;
};
