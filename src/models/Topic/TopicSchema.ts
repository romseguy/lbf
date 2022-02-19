import { TopicMessageSchema } from "models/TopicMessage";
import { Schema } from "mongoose";
import { ITopic } from "./ITopic";

export const TopicSchema = new Schema<ITopic>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event"
    },
    org: {
      type: Schema.Types.ObjectId,
      ref: "Org"
    },
    topicCategory: { type: String, trim: true },
    topicMessages: { type: [TopicMessageSchema], default: [] },
    topicMessagesDisabled: Boolean,
    topicName: {
      type: String,
      required: true,
      trim: true
    },
    topicNotifications: {
      type: [
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
      default: []
    },
    topicVisibility: { type: [String], default: [] },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
