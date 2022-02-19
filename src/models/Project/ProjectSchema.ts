import { Schema } from "mongoose";
import { IProject, EProjectStatus, EProjectInviteStatus } from "./IProject";

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
      enum: EProjectStatus
    },
    projectVisibility: [String],
    projectNotified: [
      {
        email: String,
        status: {
          type: String,
          enum: EProjectInviteStatus
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
