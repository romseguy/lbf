import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { hasItems } from "utils/array";
import { equals, logJson } from "utils/string";
import { AppQuery } from "utils/types";
import {
  ESubscriptionType,
  IOrgSubscription,
  IEventSubscription,
  ISubscription,
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
  subQuery?: AppQuery<ISubscription>;
  subscription?: ISubscription;
}): IOrgSubscription | IEventSubscription | undefined => {
  const sub = subQuery?.data || subscription;

  if (!sub) return;

  if (event) {
    return sub.events?.find(
      (eventSubscription: IEventSubscription) =>
        eventSubscription.eventId === event._id
    );
  }

  if (org) {
    return sub.orgs?.find(
      (orgSubscription: IOrgSubscription) =>
        equals(orgSubscription.orgId, org._id) &&
        orgSubscription.type === ESubscriptionType.FOLLOWER
    );
  }
};

export const getSubscriberSubscription = ({
  org,
  subQuery,
  subscription
}: {
  org?: IOrg;
  subQuery?: AppQuery<ISubscription>;
  subscription?: ISubscription;
}): IOrgSubscription | undefined => {
  const sub = subQuery?.data || subscription;
  if (!org || !sub || !sub.orgs) return;

  return sub.orgs.find(
    (orgSubscription: IOrgSubscription) =>
      equals(orgSubscription.orgId, org._id) &&
      orgSubscription.type === ESubscriptionType.SUBSCRIBER
  );
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
