import { unseal } from "@hapi/iron";
import { IncomingMessage } from "http";
import { NextApiRequest } from "next";
import {
  devSession,
  Session,
  testSession,
  getAuthToken,
  sealOptions
} from "utils/auth";
const { getEnv } = require("utils/env");

export async function getSession(params: {
  req:
    | NextApiRequest
    | (IncomingMessage & { cookies: /*NextApiRequestCookies*/ any });
}): Promise<Session | null> {
  if (devSession && getEnv() === "development") return devSession;
  if (testSession && getEnv() === "test") return testSession;
  const cookies = params.req.cookies;
  const authToken = getAuthToken(cookies);
  //console.log("🚀 ~ getSession ~ authToken:", authToken);
  if (!authToken) return null;
  const user = await unseal(authToken, process.env.SECRET, sealOptions);
  if (!user) return null;
  const isAdmin =
    typeof process.env.ADMIN_EMAILS === "string"
      ? process.env.ADMIN_EMAILS.split(",").includes(user.email)
      : false;
  return {
    user: {
      ...user,
      isAdmin
    }
  };
}
