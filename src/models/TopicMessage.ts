import type { IUser } from "models/User";
import { Schema } from "mongoose";

export interface ITopicMessage {
  _id?: string;
  message: string;
  messageHtml?: string;
  createdBy?: IUser;
  createdAt?: string;
}

export const TopicMessageSchema = new Schema<ITopicMessage>(
  {
    message: {
      type: String,
      required: true,
      trim: true
    },
    messageHtml: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
