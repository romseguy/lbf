import { unseal } from "@hapi/iron";
import { IncomingMessage } from "http";
import { NextApiRequest } from "next";
import { devSession, Session, getAuthToken, sealOptions } from "utils/auth";

export async function getSession(params: {
  req:
    | NextApiRequest
    | (IncomingMessage & { cookies: /*NextApiRequestCookies*/ any });
}): Promise<Session | null> {
  let session: Session | null = null;

  const cookies = params.req.cookies;
  const authToken = getAuthToken(cookies);

  if (authToken) {
    const user = await unseal(authToken, process.env.SECRET, sealOptions);
    session = { user };
  }

  if (devSession) session = devSession;

  if (session?.user) {
    console.log("🚀 ~ split:", process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(","));
    console.log("🚀 ~ session.user.email:", session.user.email);

    session.user.isAdmin =
      typeof session.user.email === "string" &&
      typeof process.env.NEXT_PUBLIC_ADMIN_EMAILS === "string"
        ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").includes(
            session.user.email
          )
        : false;
  }

  return session;
}
