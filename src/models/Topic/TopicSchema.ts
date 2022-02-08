import { TopicMessageSchema } from "models/TopicMessage";
import { Schema } from "mongoose";
import { ITopic } from "./ITopic";

export const TopicSchema = new Schema<ITopic>(
  {
    topicName: {
      type: String,
      required: true,
      trim: true
    },
    topicMessages: [TopicMessageSchema],
    topicMessagesDisabled: Boolean,
    topicCategory: { type: String, trim: true },
    topicOrgLists: [String],
    topicVisibility: [String],
    org: {
      type: Schema.Types.ObjectId,
      ref: "Org"
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event"
    },
    topicNotifications: [
      {
        email: String,
        phone: String,
        user: {
          type: Schema.Types.ObjectId,
          ref: "User"
        },
        createdAt: { type: String, required: true }
      }
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
