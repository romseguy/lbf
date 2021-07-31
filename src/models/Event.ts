import type { IOrg } from "models/Org";
import type { IUser } from "models/User";
import type { ITopic } from "models/Topic";
import type { Base64Image } from "utils/image";
import { Schema } from "mongoose";
import { TopicSchema } from "./Topic";

export interface IEvent {
  _id: string;
  eventName: string;
  eventNameLower?: string;
  eventMinDate: string;
  eventMaxDate: string;
  eventAddress?: string;
  eventCity?: string;
  eventEmail?: string;
  eventDescription?: string;
  eventOrgs: IOrg[];
  eventNotif: string[];
  eventTopics: ITopic[];
  repeat?: number;
  isApproved?: boolean;
  eventBanner?: Base64Image & { mode: "light" | "dark" };
  createdBy: IUser;
  createdAt?: string;
}

export const EventSchema = new Schema<IEvent>(
  {
    eventName: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    eventNameLower: String,
    eventMinDate: {
      type: String,
      required: true
    },
    eventMaxDate: {
      type: String,
      required: true
    },
    eventAddress: String,
    eventCity: String,
    eventEmail: String,
    eventDescription: String,
    eventOrgs: [{ type: Schema.Types.ObjectId, ref: "Org" }],
    eventNotif: [{ type: Schema.Types.ObjectId, ref: "Org" }],
    eventBanner: {
      base64: String,
      width: Number,
      height: Number,
      mode: String
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    eventTopics: [TopicSchema],
    repeat: Number,
    isApproved: Schema.Types.Boolean
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
