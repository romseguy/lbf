import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import {
  IOrgSubscription,
  IEventSubscription,
  ISubscription,
  SubscriptionTypes
} from "./ISubscription";

export * from "./ISubscription";
export * from "./SubscriptionSchema";

export const isOrgSubscription = (
  followerSubscription: IOrgSubscription | IEventSubscription
): followerSubscription is IOrgSubscription => {
  return (followerSubscription as IOrgSubscription).orgId !== undefined;
};

export type TagType = "Events" | "Topics";

export const addTagType = (
  tagType: TagType,
  followerSubscription: IOrgSubscription | IEventSubscription
): TagType[] => {
  return followerSubscription.tagTypes &&
    !followerSubscription.tagTypes.includes(tagType)
    ? [...followerSubscription.tagTypes, tagType]
    : [tagType];
};

export const removeTagType = (
  tagType: TagType,
  followerSubscription: IOrgSubscription | IEventSubscription
): TagType[] => {
  if (followerSubscription.tagTypes) {
    if (followerSubscription.tagTypes.includes(tagType)) {
      return followerSubscription.tagTypes.filter((t) => t !== tagType);
    }
  }

  return followerSubscription.tagTypes || [];
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
