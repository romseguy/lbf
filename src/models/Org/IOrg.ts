import { IEvent } from "models/Event";
import { IProject } from "models/Project";
import { ISubscription } from "models/Subscription";
import { ITopic } from "models/Topic";
import { Base64Image } from "utils/image";
import { IEntity } from "utils/models";
import { StringMap } from "utils/types";

export interface IOrg extends IEntity {
  orgName: string;
  orgUrl: string;
  orgType: OrgType;
  orgAddress?: { address: string }[];
  orgCity?: string;
  orgLat?: number;
  orgLng?: number;
  orgEmail?: { email: string }[];
  orgPhone?: { phone: string }[];
  orgWeb?: { url: string; prefix: string }[];
  orgEventCategories?: IOrgEventCategory[];
  orgDescription?: string;
  orgDescriptionHtml?: string;
  orgEvents: IEvent[];
  orgLists?: IOrgList[];
  orgProjects: IProject[];
  orgSubscriptions: ISubscription[];
  orgTopics: ITopic[];
  orgTopicsCategories?: string[];
  orgLogo?: Base64Image & {
    url?: string;
  };
  orgBanner?: Base64Image & {
    headerHeight: number;
    mode?: "light" | "dark";
    url?: string;
  };
  orgPassword?: string;
  orgSalt?: string;
  orgTabs?: IOrgTab[];
  orgVisibility: string;
  orgs?: IOrg[];
  isApproved?: boolean;
}

export interface IOrgEventCategory {
  index: string;
  label: string;
  bgColor?: string;
}

export interface IOrgList {
  listName: string;
  subscriptions?: ISubscription[];
}

export interface IOrgTab {
  label: string;
  url?: string;
}

export enum OrgType {
  ASSO = "ASSO",
  GENERIC = "GENERIC",
  GROUP = "GROUP",
  NETWORK = "NETWORK"
}
export const OrgTypes: StringMap<OrgType, string> = {
  [OrgType.ASSO]: "Association",
  [OrgType.GENERIC]: "Organisation",
  [OrgType.GROUP]: "Groupe",
  [OrgType.NETWORK]: "Réseau"
};

export enum Visibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE"
}
export const Visibilities: StringMap<Visibility, string> = {
  [Visibility.PUBLIC]: "Publique",
  [Visibility.PRIVATE]: "Protégée par un mot de passe"
};
