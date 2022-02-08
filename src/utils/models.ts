import { IEvent } from "models/Event";
import { ITopic } from "models/Topic";
import { IUser } from "models/User";

export interface IEntity {
  _id: string;
  createdAt?: string;
  createdBy: IUser | string;
}

export const isEvent = (entity?: IEntity): entity is IEvent => {
  return !!entity && (entity as IEvent).eventUrl !== undefined;
};

export const isTopic = (entity?: IEntity): entity is ITopic => {
  return !!entity && (entity as ITopic).topicName !== undefined;
};
