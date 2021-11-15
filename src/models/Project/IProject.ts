import { StatusTypes } from "models/Event";
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
