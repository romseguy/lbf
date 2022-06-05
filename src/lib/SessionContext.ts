import { MagicUserMetadata } from "@magic-sdk/types";
import { createContext } from "react";

export type Session =
  | {
      user: MagicUserMetadata;
    }
  | null
  | undefined;

export const SessionContext = createContext<
  [
    // 1st tuple: user data
    Session,
    // 2nd tuple: session loading state
    boolean,
    // 3rd tuple: session setter
    React.Dispatch<React.SetStateAction<Session>>
  ]
>([undefined, true, () => {}]);
