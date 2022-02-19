import { IEvent } from "models/Event";
import { ITopicNotification } from "models/INotification";
import { IOrg } from "models/Org";
import { ITopicMessage } from "models/TopicMessage";
import { IEntity } from "utils/models";

export interface ITopic extends IEntity {
  _id: string;
  topicName: string;
  topicMessages: ITopicMessage[];
  topicMessagesDisabled?: boolean;
  topicCategory?: string | null;
  topicVisibility?: string[];
  org?: IOrg;
  event?: IEvent;
  topicNotifications?: ITopicNotification[];
}

export enum ETopicVisibility {
  FOLLOWERS = "FOLLOWERS",
  PUBLIC = "PUBLIC",
  SUBSCRIBERS = "SUBSCRIBERS"
}
