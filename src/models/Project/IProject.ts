import { IOrg } from "models/Org";
import { IEntity } from "utils/models";
import { TypedMap } from "utils/types";

export enum EProjectStatus {
  PENDING = "PENDING",
  ONGOING = "ONGOING",
  FINISHED = "FINISHED"
}

export enum EProjectInviteStatus {
  PENDING = "PENDING",
  OK = "OK",
  NOK = "NOK"
}

export enum EProjectVisibility {
  FOLLOWERS = "FOLLOWERS",
  PUBLIC = "PUBLIC",
  SUBSCRIBERS = "SUBSCRIBERS"
}

export interface IProject extends IEntity {
  projectName: string;
  projectDescription: string;
  projectDescriptionHtml: string;
  projectOrgs?: IOrg[];
  projectStatus: EProjectStatus;
  projectVisibility?: string[];
  projectNotified?: {
    email: string;
    status: EProjectInviteStatus;
  }[];
  forwardedFrom?: {
    projectId: string;
  };
}
