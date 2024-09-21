import { IDocument } from "models/Document";
import { IEntity } from "models/Entity";
import { IEvent } from "models/Event";
import { ITopicNotification } from "models/INotification";
import { IOrg } from "models/Org";
import { ITopicMessage } from "models/TopicMessage";

export interface ITopic extends IEntity {
  document?: IDocument;
  event?: IEvent;
  org?: IOrg;
  isPinned?: boolean;
  topicCategory?: string | null;
  topicMessages: ITopicMessage[];
  topicMessagesDisabled?: boolean;
  topicName: string;
  topicNotifications: ITopicNotification[];
  topicVisibility: string[];
}
