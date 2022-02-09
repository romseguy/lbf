import { IEvent } from "models/Event";
import { ITopicNotification } from "models/INotification";
import { IOrg } from "models/Org";
import { ITopicMessage } from "models/TopicMessage";
import { IEntity } from "utils/models";
import { StringMap } from "utils/types";

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

export enum Visibility {
  FOLLOWERS = "FOLLOWERS",
  PUBLIC = "PUBLIC",
  SUBSCRIBERS = "SUBSCRIBERS"
}
export const Visibilities: StringMap<Visibility, string> = {
  [Visibility.FOLLOWERS]: "Abonnés",
  [Visibility.PUBLIC]: "Publique",
  [Visibility.SUBSCRIBERS]: "Adhérents"
};
