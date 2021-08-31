//@ts-nocheck
import {
  useSession as useNextAuthSession,
  getSession as getNextAuthSession
} from "next-auth/react";
//import type { UseSessionOptions, GetSessionOptions } from "next-auth/client";
import type { GetSessionOptions } from "next-auth/react";
import { Session } from "next-auth";

const speedUpDev = process.env.NODE_ENV === "development" && false;
const session = {
  user: {
    userId: process.env.NEXT_PUBLIC_IS_LOCAL_TEST
      ? "610ee9f18ee7760d3390e482"
      : "60e318732d8f5b154bfaa346",
    userName: "romseguy8933",
    email: process.env.EMAIL_ADMIN
  }
};

export type AppSession =
  | Session & {
      user: {
        userId: string;
        userName: string;
        userImage?: string;
        email: string;
        isAdmin: boolean;
      };
    };

// server-side
export async function getSession(
  options?: GetSessionOptions
): Promise<AppSession> {
  if (process.env.NEXT_PUBLIC_IS_TEST || speedUpDev) {
    return session;
  }

  return getNextAuthSession(options);
}

// client-side
// export function useSession(options?: UseSessionOptions): {
export function useSession(options?: any): {
  data: AppSession | null;
  loading: boolean;
} {
  if (process.env.NEXT_PUBLIC_IS_TEST || speedUpDev) {
    return { data: session, loading: false };
  }

  const { data, status } = useNextAuthSession();
  return { data, loading: false };

  // 3 const [session, loading] = useNextAuthSession();
  // 3 return { data: session, loading };
}
