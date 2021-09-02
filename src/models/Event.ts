import type { IOrg } from "models/Org";
import type { ISubscription } from "./Subscription";
import type { ITopic } from "models/Topic";
import type { IUser } from "models/User";
import type { Base64Image } from "utils/image";
import { Schema, Types } from "mongoose";

export interface IEvent {
  _id: string;
  eventName: string;
  eventUrl: string;
  eventMinDate: string;
  eventMaxDate: string;
  eventAddress?: string;
  eventCity?: string;
  eventLat?: number;
  eventLng?: number;
  eventEmail?: string;
  eventPhone?: string;
  eventDescription?: string;
  eventVisibility?: string;
  eventOrgs: IOrg[];
  eventSubscriptions: ISubscription[];
  eventNotif: string[]; // org ids to send an invite to
  eventNotified: [
    {
      email: string;
      status: string;
    }
  ]; // list of emails the invitation has been sent to
  eventTopics: ITopic[];
  repeat?: number;
  isApproved?: boolean;
  forwardedFrom: {
    eventId: string;
    eventUrl?: string;
  };
  eventBanner?: Base64Image & { mode: "light" | "dark" };
  createdBy: IUser | string;
  createdAt?: string;
}

export const StatusTypes: { [key: string]: string } = {
  PENDING: "PENDING",
  OK: "OK"
};

export const StatusTypesV: { [key: string]: string } = {
  PENDING: "Invitation envoyée",
  OK: "Invitation acceptée"
};

export const Visibility: { [key: string]: string } = {
  PUBLIC: "PUBLIC",
  SUBSCRIBERS: "SUBSCRIBERS"
};

export const VisibilityV: { [key: string]: string } = {
  PUBLIC: "Publique",
  SUBSCRIBERS: "Adhérents"
};

export const EventSchema = new Schema<IEvent>(
  {
    eventName: {
      type: String,
      required: true
    },
    eventUrl: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
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
    eventPhone: String,
    eventDescription: String,
    eventVisibility: {
      type: String,
      enum: Object.keys(Visibility).map((key) => Visibility[key])
    },
    eventOrgs: [{ type: Schema.Types.ObjectId, ref: "Org" }],
    eventSubscriptions: [
      { type: Schema.Types.ObjectId, ref: "Subscription", required: true }
    ],
    eventTopics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
    eventNotif: [{ type: Schema.Types.ObjectId, ref: "Org" }],
    eventNotified: [
      {
        email: String,
        status: {
          type: String,
          enum: Object.keys(StatusTypes).map((key) => StatusTypes[key])
        }
      }
    ],
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
    isApproved: Schema.Types.Boolean,
    forwardedFrom: {
      eventId: {
        type: Schema.Types.ObjectId,
        ref: "Event"
      },
      eventUrl: String
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
