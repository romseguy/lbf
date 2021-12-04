import axios, { AxiosResponse } from "axios";
import { databaseErrorCodes } from "utils/errors";
import { isServer } from "utils/isServer";
import { objectToQueryString } from "./query";

type ParamsType = { [key: string]: any };
export type ResponseType<T> = { data?: T; error?: any; status?: number };

async function request(endpoint: string, params?: ParamsType, method = "GET") {
  if (!isServer()) {
    console.log(
      `${method} ${endpoint.includes("http") ? endpoint : "/" + endpoint}`
    );
    if (params) console.log(params);
  }

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

    if (params)
      if (method === "GET") endpoint += "?" + objectToQueryString(params);
      else options.body = JSON.stringify(params);

    const response = await fetch(
      endpoint.includes("http")
        ? endpoint
        : `${process.env.NEXT_PUBLIC_API}/${endpoint}`,
      options
    );

    if (response.status === 200) {
      const data = await response.json();
      if (!isServer())
        console.log(
          `${method} ${
            endpoint.includes("http") ? endpoint : "/" + endpoint
          }: data`,
          data
        );

      return { data };
    }

    const error = await response.json();

    if (!isServer())
      console.log(
        `${method} ${
          endpoint.includes("http") ? endpoint : "/" + endpoint
        }: error`,
        error
      );

    return { status: response.status, error };
  } catch (error: any) {
    if (!isServer())
      console.log(
        `${method} ${
          endpoint.includes("http") ? endpoint : "/" + endpoint
        }: error`,
        error
      );

    throw error;
  }
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

async function sendPushNotification({
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
        url: url.includes("http") ? url : `${process.env.NEXT_PUBLIC_URL}/${url}`
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
  get,
  post,
  update,
  remove,
  databaseErrorCodes,
  sendPushNotification
};
