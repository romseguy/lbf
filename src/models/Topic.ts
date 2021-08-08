import type { ITopicMessage } from "models/TopicMessage";
import type { IUser } from "models/User";
import { Schema, Types } from "mongoose";
import { TopicMessageSchema } from "models/TopicMessage";

export interface ITopic {
  _id?: string;
  id?: string;
  topicName: string;
  topicNameLower?: string;
  topicMessages: ITopicMessage[];
  topicVisibility?: string;
  createdBy: IUser | string;
  createdAt?: string;
}

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
    topicNameLower: String,
    topicMessages: [TopicMessageSchema],
    topicVisibility: {
      type: String,
      enum: Object.keys(Visibility).map((key) => Visibility[key])
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
