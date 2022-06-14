import {
  IEntity,
  IEntityAddress,
  IEntityBanner,
  IEntityCategory,
  IEntityEmail,
  IEntityLogo,
  IEntityPhone,
  IEntityStyles,
  IEntityWeb
} from "models/Entity";
import { IEvent } from "models/Event";
import { IProject } from "models/Project";
import { ISubscription } from "models/Subscription";
import { ITopic } from "models/Topic";
import { AppIcon } from "utils/types";

export enum EOrgType {
  GENERIC = "GENERIC",
  NETWORK = "NETWORK"
}

export enum EOrgVisibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE"
}

export interface IOrg extends IEntity {
  orgName: string;
  orgUrl: string;
  orgType: EOrgType;
  orgDescription?: string;
  orgAddress: IEntityAddress[];
  orgCity?: string;
  orgLat?: number;
  orgLng?: number;
  orgEmail: IEntityEmail[];
  orgPhone: IEntityPhone[];
  orgWeb: IEntityWeb[];
  orgEventCategories: IOrgEventCategory[];
  orgEvents: IEvent[];
  orgLists: IOrgList[];
  orgProjects: IProject[];
  orgSubscriptions: ISubscription[];
  orgTopicCategories: IOrgTopicCategory[];
  orgTopics: ITopic[];
  orgStyles: IEntityStyles;
  orgBanner?: IEntityBanner;
  orgLogo?: IEntityLogo;
  orgPassword?: string;
  orgSalt?: string;
  orgTabs?: IOrgTab[];
  orgVisibility: string;
  orgs: IOrg[];
  isApproved?: boolean;
}

export interface IOrgEventCategory extends IEntityCategory {}

export interface IOrgList {
  listName: string;
  subscriptions: ISubscription[];
}

export interface IOrgTab {
  label: string;
  url?: string;
}

export interface IOrgTabWithIcon extends IOrgTab {
  icon?: AppIcon;
}

export interface IOrgTopicCategory extends IEntityCategory {}
