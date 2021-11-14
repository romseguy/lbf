import type { IEvent } from "models/Event";
import type { IOrg } from "models/Org";
import type { ITopicMessage } from "models/TopicMessage";
import type { IUser } from "models/User";
import { Schema, Types } from "mongoose";
import { TopicMessageSchema } from "models/TopicMessage";

export interface ITopic {
  _id?: string;
  id?: string;
  topicName: string;
  topicMessages: ITopicMessage[];
  topicVisibility?: string[];
  org?: IOrg;
  event?: IEvent;
  topicNotified?: ITopicNotified;
  createdBy: IUser | string;
  createdAt?: string;
}

export type ITopicNotified = {
  email?: string;
  phone?: string;
  status?: string;
}[];

export const Visibility: { [key: string]: string } = {
  PUBLIC: "PUBLIC",
  SUBSCRIBERS: "SUBSCRIBERS",
  FOLLOWERS: "FOLLOWERS"
};

export const VisibilityV: { [key: string]: string } = {
  PUBLIC: "Publique",
  SUBSCRIBERS: "Adhérents",
  FOLLOWERS: "Abonnés"
};

export const TopicSchema = new Schema<ITopic>(
  {
    topicName: {
      type: String,
      required: true,
      trim: true
    },
    topicMessages: [TopicMessageSchema],
    topicVisibility: [String],
    org: {
      type: Schema.Types.ObjectId,
      ref: "Org"
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event"
    },
    topicNotified: [
      {
        email: String,
        phone: String
      }
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
