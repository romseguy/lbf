import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { IProject } from "models/Project";
import { ITopic } from "models/Topic";
import { IUser } from "models/User";
import { IEntity, IEntityCategory } from "./IEntity";

export * from "./IEntity";

export const getCategoryLabel = (
  categories: IEntityCategory[],
  catId: string
) => {
  const category = categories.find((category) => category.catId === catId);
  if (!category) return "";
  return category.label;
};

export const getRefId = (entity?: IEntity | null, key?: string) => {
  if (!entity) return "";
  const value = entity[key || "createdBy"];

  if (typeof value === "object") return value?._id;

  return value;
};

export const isEvent = (entity?: IEntity | null): entity is IEvent => {
  return !!entity && (entity as IEvent).eventUrl !== undefined;
};

export const isOrg = (entity?: IEntity | null): entity is IOrg => {
  return !!entity && (entity as IOrg).orgUrl !== undefined;
};

export const isProject = (entity?: IEntity | null): entity is IProject => {
  return !!entity && (entity as IProject).projectName !== undefined;
};

export const isTopic = (entity?: IEntity | null): entity is ITopic => {
  return !!entity && (entity as ITopic).topicName !== undefined;
};

export const isUser = (entity?: IEntity | null): entity is IUser => {
  return !!entity && (entity as IUser).email !== undefined;
};
