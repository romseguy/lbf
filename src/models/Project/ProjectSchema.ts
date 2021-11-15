import { Schema } from "mongoose";
import { IProject } from "./IProject";

export const Status: { [key: string]: string } = {
  PENDING: "PENDING",
  ONGOING: "ONGOING",
  FINISHED: "FINISHED"
};
export const StatusV: { [key: string]: string } = {
  PENDING: "En attente",
  ONGOING: "En cours",
  FINISHED: "Terminé"
};

export const StatusTypes: { [key: string]: string } = {
  PENDING: "PENDING",
  OK: "OK",
  NOK: "NOK"
};
export const StatusTypesV: { [key: string]: string } = {
  PENDING: "Invitation envoyée",
  OK: "Participant",
  NOK: "Invitation refusée"
};

export const Visibility: { [key: string]: string } = {
  PUBLIC: "PUBLIC",
  SUBSCRIBERS: "SUBSCRIBERS",
  FOLLOWERS: "FOLLOWERS"
};
export const VisibilityV: { [key: string]: string } = {
  PUBLIC: "Publique",
  SUBSCRIBERS: "Adhérents",
  FOLLOWERS: "Abonnés"
};

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
