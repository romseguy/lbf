import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
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

export const updateTagType = (
  newTagType: TagType,
  followerSubscription: IOrgSubscription | IEventSubscription
): IOrgSubscription | IEventSubscription => {
  followerSubscription.tagTypes = followerSubscription.tagTypes?.map(
    (tagType) => {
      if (tagType.type === newTagType.type) {
        return {
          ...tagType,
          ...newTagType
        };
      }
      return tagType;
    }
  );

  return followerSubscription;
};
