import type { IOrg } from "models/Org";
import type { IUser } from "models/User";
import { Schema } from "mongoose";
import { ITopic, TopicSchema } from "./Topic";

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
