// @ts-nocheck
import {
  useSession as useNextAuthSession,
  getSession as getNextAuthSession
} from "next-auth/react";
import type { UseSessionOptions, GetSessionOptions } from "next-auth/react";
import { isServer } from "utils/isServer";

const speedUpDev = process.env.NODE_ENV === "development" && false;

export const AccountTypes = {
  ADMIN: "ADMIN",
  USER: "USER"
};

const session = {
  user: {
    userId: "60e318732d8f5b154bfaa346",
    userName: "romseguy8933",
    email: process.env.EMAIL_ADMIN
  },
  type: AccountTypes.ADMIN
};

type AppSession = {
  user: {
    userId: string;
    userName: string;
    email: string;
  };
  type?: string;
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
export function useSession(options?: UseSessionOptions): {
  data: Session | null;
  loading: boolean;
} {
  if (process.env.NEXT_PUBLIC_IS_TEST || speedUpDev) {
    return { data: session, loading: false };
  }

  return useNextAuthSession(options);
}
