import type { IEvent } from "./Event";
import type { ISubscription } from "./Subscription";
import type { ITopic } from "./Topic";
import type { IUser } from "models/User";
import type { Base64Image } from "utils/image";
import { Schema, Types } from "mongoose";

export interface IOrg {
  _id: string;
  id: string;
  orgName: string;
  orgUrl: string;
  orgType: string;
  orgAddress?: string;
  orgCity?: string;
  orgLat?: number;
  orgLng?: number;
  orgEmail?: string;
  orgDescription?: string;
  orgEvents: IEvent[];
  orgSubscriptions: ISubscription[];
  orgTopics: ITopic[];
  orgBanner?: Base64Image & { mode: "light" | "dark" };
  isApproved?: boolean;
  createdBy: IUser | string;
  createdAt?: string;
}

export const OrgTypes: { [key: string]: string } = {
  ASSO: "ASSO",
  GROUP: "GROUP"
};

export const OrgTypesV: { [key: string]: string } = {
  ASSO: "Association",
  GROUP: "Groupe"
};

export const orgTypeFull = (orgType?: string) => {
  if (!orgType) return "";
  return `${orgType === OrgTypes.ASSO ? "de l'" : "du "}${OrgTypesV[
    orgType
  ].toLowerCase()}`;
};

export const orgTypeFull2 = (orgType: string) =>
  `${orgType === OrgTypes.ASSO ? "à l'" : "au "}${OrgTypesV[
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
    orgAddress: String,
    orgCity: String,
    orgLat: Number,
    orgLng: Number,
    orgEmail: String,
    orgDescription: String,
    orgEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    orgSubscriptions: [
      { type: Schema.Types.ObjectId, ref: "Subscription", required: true }
    ],
    orgTopics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
    orgBanner: {
      base64: String,
      width: Number,
      height: Number,
      mode: String
    },
    isApproved: Schema.Types.Boolean,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
