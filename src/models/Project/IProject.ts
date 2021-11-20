import { IOrg } from "models/Org";
import { IUser } from "models/User";

export interface IProject {
  _id?: string;
  projectName: string;
  projectDescription: string;
  projectDescriptionHtml: string;
  projectOrgs?: IOrg[];
  projectStatus: string;
  projectVisibility?: string[];
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
