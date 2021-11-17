import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import {
  IOrgSubscription,
  IEventSubscription,
  ISubscription,
  SubscriptionTypes,
  TagType
} from "./ISubscription";

export * from "./ISubscription";
export * from "./SubscriptionSchema";

export const isOrgSubscription = (
  followerSubscription: IOrgSubscription | IEventSubscription
): followerSubscription is IOrgSubscription => {
  return (followerSubscription as IOrgSubscription).orgId !== undefined;
};

export const addTagType = (
  tagTypeToAdd: TagType,
  followerSubscription: IOrgSubscription | IEventSubscription
): TagType[] => {
  if (!followerSubscription.tagTypes) return [tagTypeToAdd];

  if (
    !followerSubscription.tagTypes.find(({ type, emailNotif, pushNotif }) => {
      if (type !== tagTypeToAdd.type) return false;
      if (tagTypeToAdd.emailNotif) return !!emailNotif;
      return !!pushNotif;
    })
  )
    return [...followerSubscription.tagTypes, tagTypeToAdd];

  return followerSubscription.tagTypes;
};

export const removeTagType = (
  tagTypeToRemove: TagType,
  followerSubscription: IOrgSubscription | IEventSubscription
): TagType[] => {
  if (!followerSubscription.tagTypes) return [];

  if (
    followerSubscription.tagTypes.find(({ type, emailNotif, pushNotif }) => {
      if (type !== tagTypeToRemove.type) return false;
      if (tagTypeToRemove.emailNotif) return !!emailNotif;
      return !!pushNotif;
    })
  ) {
    return followerSubscription.tagTypes.filter(
      ({ type }) => type !== tagTypeToRemove.type
    );
  }

  return followerSubscription.tagTypes;
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
