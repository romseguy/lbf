import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API
});

export default baseQuery;
