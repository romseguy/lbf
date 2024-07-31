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

export const getRefId = (
  entity?: string | Record<string, any> | null,
  key?: string
) => {
  if (entity) {
    if (typeof entity === "string") return entity;

    if (typeof entity === "object") {
      //if (typeof entity.toString === "function") return entity.toString();

      const value = entity[key || "createdBy"];

      if (value) {
        if (typeof value === "string") return value;

        if (typeof value === "object") return value._id;
      }
    }
  }

  return "";
};

export const isEvent = (entity?: any): entity is IEvent => {
  return !!entity && (entity as IEvent).eventUrl !== undefined;
};

export const isOrg = (entity?: any): entity is IOrg => {
  return !!entity && (entity as IOrg).orgUrl !== undefined;
};

export const isProject = (entity?: any): entity is IProject => {
  return !!entity && (entity as IProject).projectName !== undefined;
};

export const isTopic = (entity?: any): entity is ITopic => {
  return !!entity && (entity as ITopic).topicName !== undefined;
};

export const isUser = (entity?: any): entity is IUser => {
  return (
    !!entity &&
    ((entity as IUser).email !== undefined ||
      (entity as IUser).userName !== undefined)
  );
};
