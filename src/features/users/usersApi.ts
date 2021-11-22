import { createApi } from "@reduxjs/toolkit/query/react";
import querystring from "querystring";
import type { IUser } from "models/User";
import baseQuery from "utils/query";
import api from "utils/api";

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
    editUser: build.mutation<
      IUser,
      { payload: Partial<IUser>; userName?: string }
    >({
      query: ({ payload, userName }) => ({
        url: `user/${userName || payload.userName}`,
        method: "PUT",
        body: payload
      })
    }),
    getUser: build.query<
      IUser,
      { slug: string; populate?: string; select?: string }
    >({
      query: ({ slug, ...query }) => ({
        url: `user/${slug}?${api.objectToQueryString(query)}`
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
