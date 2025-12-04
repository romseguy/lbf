import { IEntity } from "models/Entity";

import { IOrg } from "models/Org";
import { ITopicMessage } from "models/TopicMessage";

export enum ETopicsListOrder {
  ALPHA = "ALPHA",
  NEWEST = "NEWEST",
  OLDEST = "OLDEST",
  PINNED = "PINNED",
}

export interface ITopic extends IEntity {
  org?: IOrg;
  isPinned?: boolean;
  topicCategory?: string | null;
  topicMessages: ITopicMessage[];
  topicMessagesDisabled?: boolean;
  topicName: string;
  topicVisibility: string[];
}
