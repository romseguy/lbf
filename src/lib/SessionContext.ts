//import { MagicUserMetadata } from "@magic-sdk/types";
import { createContext } from "react";
import { Base64Image } from "utils/image";

type UserMetadata = {
  email: string;
  userId: string;
  userImage: Base64Image;
  userName: string;
};

export type Session = {
  user: UserMetadata;
};

export const SessionContext = createContext<
  [
    // 1st tuple: user data
    Session | null,
    // 2nd tuple: session loading state
    boolean,
    // 3rd tuple: session setter
    React.Dispatch<React.SetStateAction<Session | null>>
  ]
>([null, true, () => {}]);
