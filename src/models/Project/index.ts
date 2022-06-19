import { EProjectInviteStatus, EProjectStatus, IProject } from "./IProject";

export * from "./IProject";

export const isAttending = ({
  email,
  project
}: {
  email: string;
  project: IProject;
}) => {
  if (email === "") return false;
  return !!project.projectNotifications?.find(({ email: e, status }) => {
    return e === email && status === EProjectInviteStatus.OK;
  });
};

export const ProjectInviteStatuses: Record<EProjectInviteStatus, string> = {
  [EProjectInviteStatus.PENDING]:
    "La personne n'a pas encore indiqué participer",
  [EProjectInviteStatus.OK]: "Participant",
  [EProjectInviteStatus.NOK]: "Invitation refusée"
};

export const ProjectStatuses: Record<EProjectStatus, string> = {
  [EProjectStatus.PENDING]: "En attente",
  [EProjectStatus.ONGOING]: "En cours",
  [EProjectStatus.FINISHED]: "Terminé"
};
