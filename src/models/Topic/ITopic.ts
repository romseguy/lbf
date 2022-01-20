import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { ITopicMessage } from "models/TopicMessage";
import { IUser } from "models/User";

export interface ITopic {
  _id?: string;
  id?: string;
  topicName: string;
  topicMessages: ITopicMessage[];
  topicMessagesDisabled?: boolean;
  topicCategory?: string | null;
  topicOrgLists?: string[];
  topicVisibility?: string[];
  org?: IOrg;
  event?: IEvent;
  topicNotified?: ITopicNotified;
  createdBy: IUser | string;
  createdAt?: string;
}

export type ITopicNotified = {
  email?: string;
  phone?: string;
  status?: string;
}[];

export const Visibility: { [key: string]: string } = {
  PUBLIC: "PUBLIC",
  SUBSCRIBERS: "SUBSCRIBERS",
  FOLLOWERS: "FOLLOWERS"
};
export const VisibilityV: { [key: string]: string } = {
  PUBLIC: "Publique",
  SUBSCRIBERS: "Adhérents",
  FOLLOWERS: "Abonnés"
};
