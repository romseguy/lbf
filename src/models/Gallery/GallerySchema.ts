// import { GalleryMessageSchema } from "models/GalleryMessage";
import { Schema } from "mongoose";
import { IGallery } from "./IGallery";

export const GallerySchema = new Schema<IGallery>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event"
    },
    org: {
      type: Schema.Types.ObjectId,
      ref: "Org"
    },
    isPinned: { type: Boolean, default: undefined },
    galleryCategory: { type: String, trim: true },
    galleryDescription: { type: String, default: undefined },
    galleryDescriptions: { type: Map, of: String, default: {} },
    // galleryMessages: { type: [GalleryMessageSchema], default: [], select: false },
    //galleryMessagesDisabled: Boolean,
    galleryName: {
      type: String,
      required: true,
      trim: true
    },
    galleryDocuments: {
      type: [{ type: Schema.Types.ObjectId, ref: "Document" }],
      default: []
    },
    // galleryNotifications: {
    //   type: [
    //     {
    //       email: String,
    //       phone: String,
    //       user: {
    //         type: Schema.Types.ObjectId,
    //         ref: "User"
    //       },
    //       createdAt: { type: String, required: true }
    //     }
    //   ],
    //   default: []
    // },
    // galleryVisibility: { type: [String], default: [] },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
