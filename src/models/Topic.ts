import type { ITopicMessage } from "models/TopicMessage";
import type { IUser } from "models/User";
import { Schema } from "mongoose";
import { TopicMessageSchema } from "models/TopicMessage";

export interface ITopic {
  _id?: string;
  id?: string;
  topicName: string;
  topicNameLower?: string;
  topicMessages: ITopicMessage[];
  createdBy: IUser;
}

export const TopicSchema = new Schema<ITopic>(
  {
    topicName: {
      type: String,
      required: true,
      trim: true
    },
    topicNameLower: String,
    topicMessages: [TopicMessageSchema],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
