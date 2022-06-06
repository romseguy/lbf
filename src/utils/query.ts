import Iron from "@hapi/iron";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export function objectToQueryString(obj: { [key: string]: string } | {}) {
  const keys = Object.keys(obj);

  if (!keys.length) return "";

  return keys
    .map((key) => {
      //@ts-expect-error
      return `${key}=${obj[key]}`;
    })
    .join("&");
}

export const sealOptions = {
  ...Iron.defaults,
  encryption: { ...Iron.defaults.encryption, minPasswordlength: 0 },
  integrity: { ...Iron.defaults.integrity, minPasswordlength: 0 }
};

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API
});

export default baseQuery;
