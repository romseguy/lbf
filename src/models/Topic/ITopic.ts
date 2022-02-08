import { IEvent } from "models/Event";
import { ITopicNotification } from "models/INotification";
import { IOrg } from "models/Org";
import { ITopicMessage } from "models/TopicMessage";
import { IEntity } from "utils/models";

export interface ITopic extends IEntity {
  topicName: string;
  topicMessages: ITopicMessage[];
  topicMessagesDisabled?: boolean;
  topicCategory?: string | null;
  topicOrgLists?: string[];
  topicVisibility?: string[];
  org?: IOrg;
  event?: IEvent;
  topicNotifications?: ITopicNotification[];
}

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
