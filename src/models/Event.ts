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
  eventWeb?: string;
  eventDescription?: string;
  eventCategory?: number;
  eventVisibility?: string;
  eventOrgs: IOrg[];
  eventSubscriptions: ISubscription[];
  eventNotif: string[]; // org ids to send an invite to
  eventNotified?: {
    email: string;
    status: string;
  }[]; // list of emails the invitation has been sent to
  eventTopics: ITopic[];
  repeat?: number;
  isApproved?: boolean;
  forwardedFrom: {
    eventId: string;
    eventUrl?: string;
  };
  eventLogo?: Base64Image;
  eventBanner?: Base64Image & { mode: "light" | "dark"; url?: string };
  createdBy: IUser | string;
  createdAt?: string;
}

export const Category: { [key: number]: { label: string; bgColor: string } } = [
  { label: "À définir", bgColor: "gray" },
  { label: "Atelier", bgColor: "red" },
  { label: "Chantier participatif", bgColor: "orange" },
  { label: "Concert", bgColor: "green.300" },
  { label: "Exposition", bgColor: "green.600" },
  { label: "Fête", bgColor: "blue.300" },
  { label: "Festival", bgColor: "blue.600" },
  { label: "Jam session", bgColor: "purple.300" },
  { label: "Réunion", bgColor: "purple.600" },
  { label: "Autre", bgColor: "transparent" }
].reduce((obj, cat, index) => ({ ...obj, [index]: cat }), {});

export const StatusTypes: { [key: string]: string } = {
  PENDING: "PENDING",
  OK: "OK",
  NOK: "NOK"
};

export const StatusTypesV: { [key: string]: string } = {
  PENDING: "Invitation envoyée",
  OK: "Participant",
  NOK: "Invitation refusée"
};

export const Visibility: { [key: string]: string } = {
  PUBLIC: "PUBLIC",
  SUBSCRIBERS: "SUBSCRIBERS"
};

export const VisibilityV: { [key: string]: string } = {
  PUBLIC: "Publique",
  SUBSCRIBERS: "Adhérents"
};

export const isAttending = ({
  email,
  event
}: {
  email: string;
  event: IEvent;
}) => {
  if (email === "") return false;
  return !!event.eventNotified?.find(({ email: e, status }) => {
    return e === email && status === StatusTypes.OK;
  });
};

export const isNotAttending = ({
  email,
  event
}: {
  email: string;
  event: IEvent;
}) => {
  if (email === "") return false;
  return !!event.eventNotified?.find(({ email: e, status }) => {
    return e === email && status === StatusTypes.NOK;
  });
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
    eventWeb: String,
    eventDescription: String,
    eventCategory: Number,
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
    eventLogo: {
      base64: String,
      width: Number,
      height: Number
    },
    eventBanner: {
      base64: String,
      width: Number,
      height: Number,
      mode: String,
      url: String
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
