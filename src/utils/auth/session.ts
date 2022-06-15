//import { MagicUserMetadata } from "@magic-sdk/types";
import { createContext } from "react";
import { Base64Image } from "utils/image";

type UserMetadata = {
  email: string;
  userId: string;
  userImage: Base64Image;
  userName: string;
  isAdmin: boolean;
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
