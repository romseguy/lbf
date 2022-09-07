import Iron from "@hapi/iron";
import { createContext } from "react";
import { Base64Image } from "utils/image";
import { getAuthToken, sealOptions, TOKEN_NAME } from "./";

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

export const SessionContext = createContext<
  [
    // 1st tuple: session
    Session | null,
    // 2nd tuple: session loading state
    boolean,
    // 3rd tuple: session setter
    React.Dispatch<React.SetStateAction<Session | null>>,
    // 4th tuple: session loading state setter
    React.Dispatch<React.SetStateAction<boolean>>
  ]
>([null, true, () => {}, () => {}]);

export async function getSession(params?: any): Promise<Session | null> {
  if (process.env.NODE_ENV === "development") return devSession;

  const cookies = params.req.cookies;

  if (!cookies[TOKEN_NAME]) {
    return null;
  }

  const user = await Iron.unseal(
    getAuthToken(cookies),
    process.env.SECRET,
    sealOptions
  );

  if (!user) return null;

  return { user };
}

export const devSession =
  // null
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
