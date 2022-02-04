import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { ITopic } from "models/Topic";
import { ITopicMessage } from "models/TopicMessage";

export interface AddTopicParams {
  topic: Partial<ITopic>;
  //topicNotif?: boolean;
  org?: Partial<IOrg>;
  event?: Partial<IEvent>;
}

export interface EditTopicParams {
  topic: Partial<ITopic>;
  topicMessage?: ITopicMessage;
  topicMessageId?: string;
}
