import { IEvent } from "models/Event";
import { ITopicNotification } from "models/INotification";
import { IOrg } from "models/Org";
import { ITopicMessage } from "models/TopicMessage";
import { IEntity } from "utils/models";

export interface ITopic extends IEntity {
  event?: IEvent;
  org?: IOrg;
  topicCategory?: string | null;
  topicMessages: ITopicMessage[];
  topicMessagesDisabled?: boolean;
  topicName: string;
  topicNotifications: ITopicNotification[];
  topicVisibility: string[];
}
