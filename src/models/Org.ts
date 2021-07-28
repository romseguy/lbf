import type { IEvent } from "./Event";
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
  orgEmailList: string[];
  orgDescription?: string;
  orgEvents?: IEvent[];
  orgTopics: ITopic[];
  orgBanner?: Base64Image & { mode: "light" | "dark" };
  createdBy: IUser;
  createdAt?: string;
}

export const OrgTypes: { [key: string]: string } = {
  ASSO: "ASSOCIATION",
  GROUP: "GROUPE"
};

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
      enum: Object.keys(OrgTypes),
      required: true
    },
    orgAddress: String,
    orgEmail: String,
    orgEmailList: Array,
    orgDescription: String,
    orgEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    orgTopics: [TopicSchema],
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
