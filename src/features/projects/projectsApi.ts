import type { IProject } from "models/Project";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "utils/query";
import { IProjectNotification } from "models/INotification";

export type AddProjectPayload = Omit<
  IProject,
  "_id" | "createdBy" | "projectNotifications"
>;

export interface AddProjectNotifPayload {
  orgListsNames?: string[];
  email?: string;
}

export const projectApi = createApi({
  reducerPath: "projectsApi",
  baseQuery,
  tagTypes: ["Projects"],
  endpoints: (build) => ({
    addProject: build.mutation<IProject, AddProjectPayload>({
      query: (payload) => {
        console.groupCollapsed("addProject");
        console.log("payload", payload);
        console.groupEnd();

        return {
          url: `projects`,
          method: "POST",
          body: payload
        };
      },
      invalidatesTags: [{ type: "Projects", id: "LIST" }]
    }),
    addProjectNotif: build.mutation<
      { notifications: IProjectNotification[] },
      {
        payload: AddProjectNotifPayload;
        projectId: string;
      }
    >({
      query: ({ payload, projectId }) => {
        console.groupCollapsed("addProjectNotif");
        console.log("addProjectNotif: projectId", projectId);
        console.log("addProjectNotif: payload", payload);
        console.groupEnd();

        return {
          url: `project/${projectId}`,
          method: "POST",
          body: payload
        };
      }
    }),
    deleteProject: build.mutation<IProject, string>({
      query: (projectId) => ({ url: `project/${projectId}`, method: "DELETE" })
    }),
    editProject: build.mutation<
      IProject,
      { payload: Partial<IProject>; projectId?: string }
    >({
      query: ({ payload, projectId }) => {
        console.log("editProject: projectId", projectId);
        console.log("editProject: payload", payload);

        return {
          url: `project/${projectId ? projectId : payload._id}`,
          method: "PUT",
          body: payload
        };
      }
    })
  })
});

export const {
  useAddProjectMutation,
  useAddProjectNotifMutation,
  useDeleteProjectMutation,
  useEditProjectMutation
} = projectApi;
export const {
  endpoints: {
    /* getProjectByName, getProjects, getProjectsByCreator */
  }
} = projectApi;
