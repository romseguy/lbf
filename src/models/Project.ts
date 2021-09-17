import type { IOrg } from "models/Org";
import { Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface IProject {
  _id?: string;
  projectName: string;
  projectDescription: string;
  projectOrgs: IOrg[];
  projectStatus: string;
  projectVisibility: string;
  projectNotified: {
    email: string;
    status: string;
  }[];
  forwardedFrom: {
    projectId: string;
  };
  createdBy: IUser | string;
  createdAt?: string;
}

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

export const isAttending = ({
  email,
  project
}: {
  email: string;
  project: IProject;
}) => {
  if (email === "") return false;
  return !!project.projectNotified?.find(({ email: e, status }) => {
    return e === email && status === StatusTypes.OK;
  });
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
    projectOrgs: [{ type: Schema.Types.ObjectId, ref: "Org" }],
    projectStatus: {
      type: String,
      enum: Object.keys(Status).map((key) => Status[key])
    },
    projectVisibility: {
      type: String,
      enum: Object.keys(Visibility).map((key) => Visibility[key])
    },
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
