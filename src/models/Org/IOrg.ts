import {
  IEntity,
  IEntityAddress,
  IEntityBanner,
  IEntityCategory,
  IEntityEmail,
  IEntityLogo,
  IEntityPhone,
  IEntityStyles,
  IEntityWeb,
} from "models/Entity";

import { ETopicsListOrder, ITopic } from "models/Topic";
import { AppIcon } from "utils/types";

export enum EOrgType {
  GENERIC = "GENERIC",
  NETWORK = "NETWORK",
  TREETOOLS = "TREETOOLS",
}

export enum EOrgVisibility {
  FRONT = "FRONT",
  LINK = "LINK",
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export interface IOrg extends IEntity {
  orgName: string;
  orgUrl: string;
  redirectUrl?: string;
  orgType: EOrgType;
  orgDescription?: string;
  orgAddress: IEntityAddress[];
  orgCity?: string;
  orgLat?: number;
  orgLng?: number;
  orgEmail: IEntityEmail[];
  orgPhone: IEntityPhone[];
  orgWeb: IEntityWeb[];
  orgTopicCategories: IOrgTopicCategory[];
  orgTopicOrder?: ETopicsListOrder;
  orgTopics: ITopic[];
  orgStyles: IEntityStyles;
  orgBanner?: IEntityBanner;
  orgLogo?: IEntityLogo;
  orgPassword?: string;
  orgSalt?: string;
  orgTabs?: IOrgTab[];
  orgVisibility: EOrgVisibility;
  orgs: IOrg[];
  orgPermissions?: IOrgPermissions;
  isApproved?: boolean;
  isArchived?: boolean;
}

export interface IOrgEventCategory extends IEntityCategory {}

export interface IOrgTab {
  label: string | string[];
  url: string | string[];
}

export interface IOrgTabWithMetadata extends IOrgTab {
  order?: number;
  icon?: AppIcon;
}

export interface IOrgTopicCategory extends IEntityCategory {}

export interface IOrgPermissions {
  allowedChildrenTypes?: { [key: string]: boolean };
  anyoneCanAddChildren?: boolean;
}
