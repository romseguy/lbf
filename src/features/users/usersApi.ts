import { createApi } from "@reduxjs/toolkit/query/react";
import { IUser } from "models/User";
import baseQuery, { objectToQueryString } from "utils/query";

export type UserQueryParams = {
  slug: string;
  populate?: string;
  select?: string;
};

export const userApi = createApi({
  reducerPath: "usersApi",
  baseQuery,
  tagTypes: ["Users"],
  endpoints: (build) => ({
    addUser: build.mutation<IUser, Partial<IUser>>({
      query: (payload) => ({
        url: `users`,
        method: "POST",
        body: payload
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }]
    }),
    editUser: build.mutation<IUser, { payload: Partial<IUser>; slug: string }>({
      query: ({ payload, slug }) => ({
        url: `user/${slug}`,
        method: "PUT",
        body: payload
      })
    }),
    getUser: build.query<IUser, UserQueryParams>({
      query: ({ slug, ...query }) => ({
        url: `user/${slug}?${objectToQueryString(query)}`
      })
    }),
    getUserByEmail: build.query<IUser, string>({
      query: (email) => ({ url: `user/${email}` })
    })
  })
});

export const {
  useAddUserMutation,
  useEditUserMutation,
  useGetUserQuery,
  useGetUserByEmailQuery
} = userApi;
export const {
  endpoints: { getUser }
} = userApi;
