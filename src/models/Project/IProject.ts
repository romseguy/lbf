import { IProjectNotification } from "models/INotification";
import { IOrg } from "models/Org";
import { IEntity } from "utils/models";

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

export interface IProject extends IEntity {
  forwardedFrom?: {
    projectId: string;
  };
  projectDescription: string;
  projectDescriptionHtml: string;
  projectName: string;
  projectNotifications: IProjectNotification[];
  projectOrgs?: IOrg[];
  projectStatus: EProjectStatus;
  projectVisibility?: string[];
}
