import { Schema } from "mongoose";
import { IProject, Status, StatusTypes } from "./IProject";

export const ProjectSchema = new Schema<IProject>(
  {
    projectName: {
      type: String,
      required: true,
      trim: true
    },
    projectDescription: {
      type: String,
      trim: true
    },
    projectDescriptionHtml: {
      type: String,
      trim: true
    },
    projectOrgs: [{ type: Schema.Types.ObjectId, ref: "Org" }],
    projectStatus: {
      type: String,
      enum: Object.keys(Status).map((key) => Status[key])
    },
    projectVisibility: [String],
    projectNotified: [
      {
        email: String,
        status: {
          type: String,
          enum: Object.keys(StatusTypes).map((key) => StatusTypes[key])
        }
      }
    ],
    forwardedFrom: {
      projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project"
      }
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
