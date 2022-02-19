import { IEvent } from "models/Event";
import { IProject } from "models/Project";
import { ISubscription } from "models/Subscription";
import { ITopic } from "models/Topic";
import { Base64Image } from "utils/image";
import { IEntity } from "utils/models";

export enum EOrgType {
  ASSO = "ASSO",
  GENERIC = "GENERIC",
  GROUP = "GROUP",
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
  orgDescriptionHtml?: string;
  orgAddress: IOrgAddress[];
  orgCity?: string;
  orgLat?: number;
  orgLng?: number;
  orgEmail: IOrgEmail[];
  orgPhone: IOrgPhone[];
  orgWeb: IOrgWeb[];
  orgEventCategories: IOrgEventCategory[];
  orgEvents: IEvent[];
  orgLists: IOrgList[];
  orgProjects: IProject[];
  orgSubscriptions: ISubscription[];
  orgTopics: ITopic[];
  orgTopicsCategories: string[];
  orgBanner?: Base64Image & {
    headerHeight: number;
    mode?: "light" | "dark";
    url?: string;
  };
  orgLogo?: Base64Image & {
    url?: string;
  };
  orgPassword?: string;
  orgSalt?: string;
  orgTabs?: IOrgTab[];
  orgVisibility: string;
  orgs: IOrg[];
  isApproved?: boolean;
}

export interface IOrgAddress {
  address: string;
}

export interface IOrgEmail {
  email: string;
}

export interface IOrgPhone {
  phone: string;
}

export interface IOrgWeb {
  url: string;
  prefix: string;
}

export interface IOrgEventCategory {
  index: string;
  label: string;
  bgColor?: string;
}

export interface IOrgList {
  listName: string;
  subscriptions: ISubscription[];
}

export interface IOrgTab {
  label: string;
  url?: string;
}
