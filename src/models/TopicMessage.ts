import { Schema } from "mongoose";
import { IEntity } from "models/Entity";

export interface ITopicMessage extends Omit<IEntity, "_id"> {
  _id?: string;
  message: string;
}

export const TopicMessageSchema = new Schema<ITopicMessage>(
  {
    message: { type: String, default: "" },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
