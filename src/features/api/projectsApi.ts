import type { IProject } from "models/Project";
import { api } from "./";

export type AddProjectPayload = Omit<IProject, "_id" | "createdBy">;

export const projectApi = api.injectEndpoints({
  endpoints: (build) => ({
    addProject: build.mutation<IProject, AddProjectPayload>({
      query: (payload) => {
        //console.groupCollapsed("addProject");
        //console.log("payload", payload);
        //console.groupEnd();

        return {
          url: `projects`,
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: (result, error, params) => {
        if (Array.isArray(result?.projectOrgs))
          return [
            {
              type: "Orgs",
              id: result?.projectOrgs[0]._id,
            },
          ];

        return [{ type: "Projects", id: "LIST" }];
      },
    }),
    deleteProject: build.mutation<IProject, string>({
      query: (projectId) => ({ url: `project/${projectId}`, method: "DELETE" }),
      invalidatesTags: (result, error, params) => {
        if (Array.isArray(result?.projectOrgs))
          return [
            {
              type: "Orgs",
              id: result?.projectOrgs[0]._id,
            },
          ];

        return [{ type: "Topics", id: "LIST" }];
      },
    }),
    editProject: build.mutation<
      IProject,
      { payload: Partial<IProject>; projectId?: string }
    >({
      query: ({ payload, projectId }) => {
        const id = projectId
          ? projectId
          : "_id" in payload
          ? payload._id
          : undefined;

        //console.log("editProject: projectId", id);
        //console.log("editProject: payload", payload);

        return {
          url: `project/${id}`,
          method: "PUT",
          body: payload,
        };
      },
      invalidatesTags: (result, error, params) => {
        if (Array.isArray(result?.projectOrgs))
          return [
            {
              type: "Orgs",
              id: result?.projectOrgs[0]._id,
            },
          ];

        return [{ type: "Topics", id: "LIST" }];
      },
    }),
  }),
});

export const {
  useAddProjectMutation,
  useDeleteProjectMutation,
  useEditProjectMutation,
} = projectApi;
