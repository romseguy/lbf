import { serialize } from "cookie";
import { NextApiResponse } from "next";
import * as Iron from "@hapi/iron";
const { getEnv } = require("utils/env");

export const TOKEN_NAME = "api_token";
const MAX_AGE = 60 * 60 * 24 * 7;

function createCookie(name: string, data: string, options = {}) {
  return serialize(name, data, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    secure: getEnv() === "production",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    ...options
  });
}
export function getAuthToken(cookies?: Record<string, string>) {
  if (!cookies) return "";
  return cookies[TOKEN_NAME];
}

export const sealOptions = {
  ...Iron.defaults,
  encryption: { ...Iron.defaults.encryption, minPasswordlength: 0 },
  integrity: { ...Iron.defaults.integrity, minPasswordlength: 0 }
};

export function setTokenCookie(res: NextApiResponse, token: string) {
  res.setHeader("Set-Cookie", [
    createCookie(TOKEN_NAME, token),
    createCookie("authed", token ? "true" : "false", { httpOnly: false })
  ]);
}
