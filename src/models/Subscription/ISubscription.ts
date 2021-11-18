import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { ITopic } from "models/Topic";
import { IUser } from "models/User";

export interface ISubscription {
  _id: string;
  user?: IUser;
  email?: string;
  phone?: string;
  events?: IEventSubscription[];
  orgs?: IOrgSubscription[];
  topics: ITopicSubscription[];
  createdBy: IUser | string;
}

export type TagType = {
  type: "Events" | "Topics";
  emailNotif?: boolean;
  pushNotif?: boolean;
};

export interface IEventSubscription {
  event: IEvent;
  eventId: string;
  tagTypes?: TagType[];
}

export interface IOrgSubscription {
  org: IOrg;
  orgId: string;
  type: string;
  tagTypes?: TagType[];
  eventCategories?: IOrgSubscriptionEventCategory[];
}

export interface IOrgSubscriptionEventCategory {
  catId: number;
  emailNotif?: boolean;
  pushNotif?: boolean;
}

export interface ITopicSubscription {
  emailNotif?: boolean;
  pushNotif?: boolean;
  topic: ITopic;
}

export const SubscriptionTypes: { [key: string]: string } = {
  SUBSCRIBER: "SUBSCRIBER",
  FOLLOWER: "FOLLOWER"
};
