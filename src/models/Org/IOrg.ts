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
  orgPassword: string;
  orgVisibility: string;
  orgs?: IOrg[];
  isApproved?: boolean;
  createdBy: IUser | string;
  createdAt?: string;
}

export interface IOrgList {
  listName: string;
  subscriptions?: ISubscription[];
}

export type OrgType = "ASSO" | "GROUP" | "NETWORK";

export const OrgTypes: { [key: string]: OrgType } = {
  ASSO: "ASSO",
  GROUP: "GROUP",
  NETWORK: "NETWORK"
};
export const OrgTypesV: { [key: string]: string } = {
  ASSO: "Association",
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
