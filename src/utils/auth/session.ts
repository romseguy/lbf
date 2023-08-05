import Iron from "@hapi/iron";
import { IncomingMessage } from "http";
import { NextApiRequest } from "next";
import { Base64Image } from "utils/image";
import { getAuthToken, sealOptions } from "./";

type UserMetadata = {
  email: string;
  userId: string;
  userImage?: Base64Image;
  userName: string;
  isAdmin?: boolean;
};

export type Session = {
  user: UserMetadata;
};

export async function getSession(params: {
  req:
    | NextApiRequest
    | (IncomingMessage & { cookies: /*NextApiRequestCookies*/ any });
}): Promise<Session | null> {
  if (devSession && process.env.NODE_ENV === "development") return devSession;
  const cookies = params.req.cookies;
  const authToken = getAuthToken(cookies);
  if (!authToken) return null;
  const user = await Iron.unseal(authToken, process.env.SECRET, sealOptions);
  if (!user) return null;
  return { user };
}

export const devSession =
  // admin
  {
    user: {
      email: "rom.seguy@lilo.org",
      userId: "60e340cb56ef290008d2e75d",
      userName: "romain"
    }
  };
// {
//   user: {
//     email: "rom.seguy@gmail.com",
//     userId: "61138a879544b000088318ae",
//     userName: "romseguy66"
//   }
// };
null;
