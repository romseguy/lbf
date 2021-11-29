import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { ITopic } from "models/Topic";

export const isEvent = (
  entity: IEvent<string | Date> | ITopic | IOrg
): entity is IEvent<string | Date> => {
  return (entity as IEvent<string | Date>).eventUrl !== undefined;
};

export const isTopic = (
  entity: IEvent<string | Date> | ITopic
): entity is ITopic => {
  return (entity as ITopic).topicName !== undefined;
};
