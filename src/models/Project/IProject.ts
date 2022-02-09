import { IOrg } from "models/Org";
import { IEntity } from "utils/models";
import { StringMap } from "utils/types";

export interface IProject extends IEntity {
  projectName: string;
  projectDescription: string;
  projectDescriptionHtml: string;
  projectOrgs?: IOrg[];
  projectStatus: Status;
  projectVisibility?: string[];
  projectNotified: {
    email: string;
    status: InviteStatus;
  }[];
  forwardedFrom: {
    projectId: string;
  };
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
    return e === email && status === InviteStatus.OK;
  });
};

export enum Status {
  PENDING = "PENDING",
  ONGOING = "ONGOING",
  FINISHED = "FINISHED"
}
export const Statuses: StringMap<Status, string> = {
  [Status.PENDING]: "En attente",
  [Status.ONGOING]: "En cours",
  [Status.FINISHED]: "Terminé"
};

export enum InviteStatus {
  PENDING = "PENDING",
  OK = "OK",
  NOK = "NOK"
}
export const InviteStatuses: StringMap<InviteStatus, string> = {
  [InviteStatus.PENDING]: "La personne n'a pas encore indiqué participer",
  [InviteStatus.OK]: "Participant",
  [InviteStatus.NOK]: "Invitation refusée"
};

export enum Visibility {
  FOLLOWERS = "FOLLOWERS",
  PUBLIC = "PUBLIC",
  SUBSCRIBERS = "SUBSCRIBERS"
}
export const Visibilities: StringMap<Visibility, string> = {
  [Visibility.PUBLIC]: "Publique",
  [Visibility.SUBSCRIBERS]: "Adhérents",
  [Visibility.FOLLOWERS]: "Abonnés"
};
