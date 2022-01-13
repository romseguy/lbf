import { IEvent } from "models/Event";
import { IProject } from "models/Project";
import { ISubscription } from "models/Subscription";
import { ITopic } from "models/Topic";
import { IUser } from "models/User";
import { Base64Image } from "utils/image";

export interface IOrg {
  _id: string;
  id: string;
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
  createdBy: IUser | string;
  createdAt?: string;
}

export interface IOrgEventCategory {
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

export type OrgType = "ASSO" | "GENERIC" | "GROUP" | "NETWORK";

export const OrgTypes: { [key: string]: OrgType } = {
  ASSO: "ASSO",
  GENERIC: "GENERIC",
  GROUP: "GROUP",
  NETWORK: "NETWORK"
};
export const OrgTypesV: { [key: string]: string } = {
  ASSO: "Association",
  GENERIC: "Organisation",
  GROUP: "Groupe",
  NETWORK: "Réseau"
};

export const Visibility: { [key: string]: string } = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE"
};
export const VisibilityV: { [key: string]: string } = {
  PUBLIC: "Publique",
  PRIVATE: "Protégée par un mot de passe"
};
