import { Schema } from "mongoose";
import { IDocument } from "./IDocument";

export const DocumentSchema = new Schema<IDocument>(
  {
    gallery: {
      type: Schema.Types.ObjectId,
      ref: "Gallery"
    },
    documentName: {
      type: String,
      required: true,
      trim: true
    },
    documentHeight: Number,
    documentWidth: Number,
    documentTime: Number,
    documentBytes: Number,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
