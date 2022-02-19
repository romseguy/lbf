import {
  EProjectInviteStatus,
  EProjectStatus,
  EProjectVisibility,
  IProject
} from "./IProject";
import { TypedMap } from "utils/types";

export * from "./IProject";

export const isAttending = ({
  email,
  project
}: {
  email: string;
  project: IProject;
}) => {
  if (email === "") return false;
  return !!project.projectNotified?.find(({ email: e, status }) => {
    return e === email && status === EProjectInviteStatus.OK;
  });
};

export const ProjectInviteStatuses: TypedMap<EProjectInviteStatus, string> = {
  [EProjectInviteStatus.PENDING]:
    "La personne n'a pas encore indiqué participer",
  [EProjectInviteStatus.OK]: "Participant",
  [EProjectInviteStatus.NOK]: "Invitation refusée"
};

export const ProjectStatuses: TypedMap<EProjectStatus, string> = {
  [EProjectStatus.PENDING]: "En attente",
  [EProjectStatus.ONGOING]: "En cours",
  [EProjectStatus.FINISHED]: "Terminé"
};

export const ProjectVisibilities: TypedMap<EProjectVisibility, string> = {
  [EProjectVisibility.PUBLIC]: "Publique",
  [EProjectVisibility.SUBSCRIBERS]: "Adhérents",
  [EProjectVisibility.FOLLOWERS]: "Abonnés"
};
