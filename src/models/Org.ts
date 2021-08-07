import type { IEvent } from "./Event";
import type { ISubscription } from "./Subscription";
import type { IUser } from "models/User";
import type { Base64Image } from "utils/image";
import { Schema } from "mongoose";
import { ITopic, TopicSchema } from "./Topic";

export interface IOrg {
  _id: string;
  id: string;
  orgName: string;
  orgNameLower?: string;
  orgType: string;
  orgAddress?: string;
  orgEmail?: string;
  orgSubscriptions: ISubscription[];
  orgDescription?: string;
  orgEvents?: IEvent[];
  orgTopics: ITopic[];
  orgBanner?: Base64Image & { mode: "light" | "dark" };
  createdBy: IUser;
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

export const orgTypeFull = (orgType: string) =>
  `${orgType === OrgTypes.ASSO ? "de l'" : "du "}${OrgTypesV[
    orgType
  ].toLowerCase()}`;

export const OrgSchema = new Schema<IOrg>(
  {
    orgName: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    orgNameLower: String,
    orgType: {
      type: String,
      enum: Object.keys(OrgTypes).map((key) => OrgTypes[key]),
      required: true
    },
    orgAddress: String,
    orgEmail: String,
    orgSubscriptions: [
      { type: Schema.Types.ObjectId, ref: "Subscription", required: true }
    ],
    orgDescription: String,
    orgEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    orgTopics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
    orgBanner: {
      base64: String,
      width: Number,
      height: Number,
      mode: String
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
