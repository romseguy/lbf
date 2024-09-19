import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IEntity } from "models/Entity";
import { selectSession } from "store/sessionSlice";
import { TOKEN_NAME } from "./auth";
import { isServer } from "./isServer";
import { AppQuery } from "./types";

export function getError(query: AppQuery<IEntity>): Error | undefined {
  if (query.error) {
    if (query.error.data) {
      return new Error(query.error.data.message) || query.error.data;
    }

    if (query.error.error?.error) return new Error(query.error.error.error);

    return new Error("Une erreur inconnue est survenue");
  }
}

export function getErrorMessageString(
  error: any,
  defaultErrorMessage?: string
) {
  if (error.message && typeof error.message === "string") {
    return error.message;
  }

  if (error.data && typeof error.data.message === "string") {
    return error.data.message;
  }

  return defaultErrorMessage;
}

export function objectToQueryString(obj: { [key: string]: string } | {}) {
  const keys = Object.keys(obj);

  if (!keys.length) return "";

  return keys
    .filter((key) => {
      //@ts-expect-error
      return typeof obj[key] !== "undefined";
    })
    .map((key) => {
      //@ts-expect-error
      return `${key}=${obj[key]}`;
    })
    .join("&");
}

//const baseQueryWithRetry = retry(baseQuery, { maxRetries: 10 });
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API,
  // credentials: "include",
  // mode: "cors",
  prepareHeaders: (headers, { getState, extra, endpoint, forced, type }) => {
    //@ts-ignore
    if (isServer() && !headers.cookie) {
      // console.log("🚀 ~ RTKQ should have set headers, working around...");
      //@ts-ignore
      const session = selectSession(getState());
      const authToken = session ? session[TOKEN_NAME] : "";
      if (authToken) {
        // console.log("🚀 ~ Manually setting auth token in request headers");
        headers.set("cookie", `api_token=${authToken}`);
      }
    }
    return headers;
  }
});

export default baseQuery;
