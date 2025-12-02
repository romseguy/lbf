import { TopicMessageSchema } from "models/TopicMessage";
import { Schema } from "mongoose";
import { ITopic } from "./ITopic";

export const TopicSchema = new Schema<ITopic>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    org: {
      type: Schema.Types.ObjectId,
      ref: "Org",
    },
    isPinned: { type: Boolean, default: undefined },
    topicCategory: { type: String, trim: true },
    topicMessages: { type: [TopicMessageSchema], default: [], select: false },
    topicMessagesDisabled: Boolean,
    topicName: {
      type: String,
      required: true,
      trim: true,
    },
    topicVisibility: { type: [String], default: [] },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } },
);
