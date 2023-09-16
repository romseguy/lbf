import axios, { AxiosResponse } from "axios";
import https from "https";
import { isServer } from "utils/isServer";
import { objectToQueryString } from "../query";
import { Primitive } from "../types";

type ParamsType = Record<string, any> | Primitive;
export type ResponseType<T> = { data?: T; error?: any; status?: number };

const agent = new https.Agent({
  rejectUnauthorized: false,
  requestCert: false
});

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API2,
  responseType: "json",
  withCredentials: true,
  httpsAgent: agent
});

async function request(endpoint: string, params?: ParamsType, method = "GET") {
  const prefix = `${method} ${
    endpoint.includes("http") ? endpoint : "/" + endpoint
  }`;

  try {
    console.log(`${prefix}${params ? ` params : ${String(params)}` : ""}`);

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

    if (params)
      if (method === "GET") endpoint += "?" + objectToQueryString(params);
      else options.body = JSON.stringify(params);

    const response = await fetch(
      endpoint.includes("http")
        ? endpoint
        : `${process.env.NEXT_PUBLIC_API}/${endpoint}`,
      options
    );

    if (response.status !== 200) {
      const error = await response.json();
      console.log(`${prefix}: ${response.status} error`, error);
      return { status: response.status, error };
    }

    const data = await response.json();
    console.log(`${prefix}: data`, data);
    return { status: 200, data };
  } catch (error: any) {
    console.log(`${prefix}: caught error`, error);
    return { status: 500, error };
  }
}

export function get(endpoint: string, params?: ParamsType) {
  return request(endpoint, params);
}

export function post(endpoint: string, params: ParamsType) {
  return request(endpoint, params, "POST");
}

export function update(endpoint: string, params: ParamsType) {
  return request(endpoint, params, "PUT");
}

export function remove(endpoint: string, params: ParamsType) {
  return request(endpoint, params, "DELETE");
}

// TODO: src/features/api/notificationsApi.ts
export async function sendPushNotification({
  message = "",
  title = "Vous avez reçu une notification",
  url = "",
  subscription
}: {
  message?: string;
  title?: string;
  url?: string;
  subscription?: unknown;
}): Promise<AxiosResponse<string>> {
  if (!subscription)
    throw new Error("api/sendPushNotification: must provide subscription");

  return axios.post(
    process.env.NEXT_PUBLIC_API + "/notification",
    {
      subscription,
      notification: {
        title,
        message,
        url: url.includes("http")
          ? url
          : `${process.env.NEXT_PUBLIC_URL}/${url}`
      }
    },
    {
      headers: {
        Accept: "application/json, text/plain, */*",
        "User-Agent": "*"
      }
    }
  );
}

export default {
  client,
  get,
  post,
  update,
  remove,
  sendPushNotification
};
