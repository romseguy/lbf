import { IEvent } from "models/Event";
import { IProject } from "models/Project";
import { ITopic } from "models/Topic";
import { TypedMap } from "utils/types";
import { IEntity } from "./IEntity";

export * from "./IEntity";

export const isEvent = (entity?: IEntity): entity is IEvent => {
  return !!entity && (entity as IEvent).eventUrl !== undefined;
};

export const isProject = (entity?: IEntity): entity is IProject => {
  return !!entity && (entity as IProject).projectName !== undefined;
};

export const isTopic = (entity?: IEntity): entity is ITopic => {
  return !!entity && (entity as ITopic).topicName !== undefined;
};

export const getRefId = (entity: TypedMap<string, any>, key?: string) => {
  const value = entity[key || "createdBy"];

  if (typeof value === "object") return value._id;

  return value;
};
