import type { IUser } from "models/User";
import { Schema } from "mongoose";

export interface ITopicMessage {
  _id?: string;
  message: string;
  messageHtml?: string;
  createdBy?: IUser | string;
  createdAt?: string;
}

export const TopicMessageSchema = new Schema<ITopicMessage>(
  {
    message: { type: String, default: "" },
    messageHtml: { type: String, default: "" },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
