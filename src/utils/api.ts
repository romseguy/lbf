import { databaseErrorCodes } from "utils/errors";
import { isServer } from "utils/isServer";

type ParamsType = { [key: string]: any };
export type ResponseType<T> = { data?: T; error?: any; status?: number };

async function request(endpoint: string, params?: ParamsType, method = "GET") {
  console.log(`${method} /${endpoint}`);
  if (params) console.log(params);
  try {
    const options: {
      method: string;
      headers: { [key: string]: string };
      body?: BodyInit;
    } = {
      method,
      headers: {
        "Content-Type": "application/json"
      }
    };

    if (params) {
      if (method === "GET") {
        endpoint += "?" + objectToQueryString(params);
      } else {
        options.body = JSON.stringify(params);
      }
    }

    console.log(
      `Fetching ${endpoint.includes("http") ? endpoint : "/" + endpoint}`
    );

    const response = await fetch(
      endpoint.includes("http")
        ? endpoint
        : `${process.env.NEXT_PUBLIC_API}/${endpoint}`,
      options
    );

    console.log(`Fulfilled /${endpoint}`);

    if (response.status === 200) {
      const data = await response.json();
      // if (!process.env.NEXT_PUBLIC_IS_TEST)
      if (
        !isServer() /*  && process.env.NEXT_PUBLIC_VERCEL_ENV !== "production" */
      )
        console.log(`Result /${endpoint}`, data);
      return { data };
    }

    const error = await response.json();
    throw error;
  } catch (error: any) {
    console.error(`API ERROR /${endpoint}`, error);
    throw error;
  }
}

function objectToQueryString(obj: { [key: string]: string }) {
  return Object.keys(obj)
    .map((key) => key + "=" + obj[key])
    .join("&");
}

function get(endpoint: string, params?: ParamsType) {
  return request(endpoint, params);
}

function post(endpoint: string, params: ParamsType) {
  return request(endpoint, params, "POST");
}

function update(endpoint: string, params: ParamsType) {
  return request(endpoint, params, "PUT");
}

function remove(endpoint: string, params: ParamsType) {
  return request(endpoint, params, "DELETE");
}

export default {
  get,
  post,
  update,
  remove,
  databaseErrorCodes
};
