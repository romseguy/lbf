import type { IEvent } from "./Event";
import { ISubscription, SubscriptionTypes } from "./Subscription";
import type { ITopic } from "./Topic";
import type { IUser } from "models/User";
import type { Base64Image } from "utils/image";
import { Schema, Types } from "mongoose";
import { IProject } from "./Project";
import { equals } from "utils/string";

export const getSubscriptions = (org: IOrg, type: string) => {
  return org.orgSubscriptions.filter((subscription) =>
    subscription.orgs.find(
      (orgSubscription) =>
        equals(orgSubscription.orgId, org._id) && orgSubscription.type === type
    )
  );
};

export interface IOrg {
  _id: string;
  id: string;
  orgName: string;
  orgUrl: string;
  orgType: string;
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
  orgLogo?: Base64Image & {
    url?: string;
  };
  orgBanner?: Base64Image & {
    headerHeight: number;
    mode?: "light" | "dark";
    url?: string;
  };
  orgVisibility: string;
  orgs?: IOrg[];
  isApproved?: boolean;
  createdBy: IUser | string;
  createdAt?: string;
}

export interface IOrgList {
  listName: string;
  subscriptions: ISubscription[];
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

// export const OrgNetworkTypes: { [key: string]: string } = {
//   RESSOURCES: "RESSOURCES",
// };

export const Visibility: { [key: string]: string } = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE"
};

export const VisibilityV: { [key: string]: string } = {
  PUBLIC: "Publique",
  PRIVATE: "Privée"
};

export const orgTypeFull = (orgType?: string): string => {
  if (!orgType) return "";
  return `${orgType === OrgTypes.ASSO ? "de l'" : "du "}${OrgTypesV[
    orgType
  ].toLowerCase()}`;
};

export const orgTypeFull2 = (orgType: string): string =>
  `${orgType === OrgTypes.ASSO ? "à l'" : "au "}${OrgTypesV[
    orgType
  ].toLowerCase()}`;

export const orgTypeFull3 = (orgType?: string): string => {
  if (!orgType) return "une organisation";

  return `${orgType === OrgTypes.ASSO ? "une " : "un "}${OrgTypesV[
    orgType
  ].toLowerCase()}`;
};

export const orgTypeFull4 = (orgType: string): string =>
  `${orgType === OrgTypes.ASSO ? "cette " : "ce "}${OrgTypesV[
    orgType
  ].toLowerCase()}`;

export const OrgSchema = new Schema<IOrg>(
  {
    orgName: {
      type: String,
      required: true
    },
    orgUrl: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    orgType: {
      type: String,
      enum: Object.keys(OrgTypes).map((key) => OrgTypes[key]),
      required: true
    },
    orgAddress: [{ address: String }],
    orgCity: String,
    orgLat: Number,
    orgLng: Number,
    orgEmail: [{ email: String }],
    orgPhone: [{ phone: String }],
    orgWeb: [{ url: String, prefix: String }],
    orgDescription: {
      type: String,
      trim: true
    },
    orgDescriptionHtml: {
      type: String,
      trim: true
    },
    orgEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    orgLists: [
      {
        listName: { type: String, required: true, trim: true },
        subscriptions: [
          {
            type: Schema.Types.ObjectId,
            ref: "Subscription"
          }
        ]
      }
    ],
    orgProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    orgSubscriptions: [
      { type: Schema.Types.ObjectId, ref: "Subscription", required: true }
    ],
    orgTopics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
    orgLogo: {
      base64: String,
      width: Number,
      height: Number,
      url: String
    },
    orgBanner: {
      base64: String,
      height: Number,
      headerHeight: Number,
      width: Number,
      mode: String,
      url: String
    },
    orgVisibility: {
      type: String,
      enum: Object.keys(Visibility).map((key) => Visibility[key])
    },
    orgs: [{ type: Schema.Types.ObjectId, ref: "Org" }],
    isApproved: Boolean,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
