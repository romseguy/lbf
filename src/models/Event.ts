import type { IOrg } from "models/Org";
import type { ISubscription } from "./Subscription";
import type { ITopic } from "models/Topic";
import type { IUser } from "models/User";
import type { Base64Image } from "utils/image";
import { Schema, Types } from "mongoose";

export interface IEvent {
  _id: string;
  eventName: string;
  eventNameLower?: string;
  eventUrl: string;
  eventMinDate: string;
  eventMaxDate: string;
  eventAddress?: string;
  eventCity?: string;
  eventLat?: number;
  eventLng?: number;
  eventEmail?: string;
  eventDescription?: string;
  eventOrgs: IOrg[];
  eventSubscriptions: ISubscription[];
  eventNotif: string[];
  eventTopics: ITopic[];
  repeat?: number;
  isApproved?: boolean;
  eventBanner?: Base64Image & { mode: "light" | "dark" };
  createdBy: IUser | string;
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
    eventUrl: String,
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
    eventLat: Number,
    eventLng: Number,
    eventEmail: String,
    eventDescription: String,
    eventOrgs: [{ type: Schema.Types.ObjectId, ref: "Org" }],
    eventSubscriptions: [
      { type: Schema.Types.ObjectId, ref: "Subscription", required: true }
    ],
    eventTopics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
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
    repeat: Number,
    isApproved: Schema.Types.Boolean
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
