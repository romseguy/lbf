import type { IProject } from "models/Project";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "utils/query";

export type AddProjectPayload = Omit<IProject, "_id" | "createdBy">;

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
    // getProjects: build.query<IProject[], undefined>({
    //   query: () => ({ url: `projects` })
    // }),
    // getProjectByName: build.query<IProject, string>({
    //   query: (projectUrl) => ({ url: `project/${projectUrl}` })
    // }),
    // getProjectsByCreator: build.query<IProject[], string>({
    //   query: (createdBy) => ({ url: `projects/${createdBy}` })
    // })
  })
});

export const {
  useAddProjectMutation,
  // useAddProjectDetailsMutation,
  useDeleteProjectMutation,
  useEditProjectMutation
  // useGetProjectsQuery,
  // useGetProjectByNameQuery,
  // useGetProjectsByCreatorQuery
} = projectApi;
export const {
  endpoints: {
    /* getProjectByName, getProjects, getProjectsByCreator */
  }
} = projectApi;
