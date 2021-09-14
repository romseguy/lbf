//@ts-nocheck
import { useAsync } from "react-async-hook";
import {
  useSession as useNextAuthSession,
  getSession as getNextAuthSession
} from "next-auth/client";
//import type { UseSessionOptions, GetSessionOptions } from "next-auth/client";
import type { GetSessionOptions } from "next-auth/client";
import { Session } from "next-auth";
import api from "utils/api";

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

  const nextAuthSession = await getNextAuthSession(options);
  let ret = nextAuthSession;

  if (nextAuthSession && nextAuthSession.user) {
    if (!nextAuthSession.user.userId) {
      const { data } = await fetchUser(nextAuthSession);

      if (data) {
        const { _id, userName, isAdmin } = data;

        ret = {
          ...nextAuthSession,
          user: {
            ...nextAuthSession.user,
            userId: _id,
            userName,
            isAdmin: isAdmin || false
          }
        };
      }
    }
  }

  return ret;
}

const fetchUser = async (s) => {
  if (s && !s.user.userId) return await api.get(`user/${s.user.email}`);
  return null;
};

// client-side
// export function useSession(options?: UseSessionOptions): {
export function useSession(options?: any): {
  data: AppSession | null;
  loading: boolean;
} {
  if (process.env.NEXT_PUBLIC_IS_TEST || speedUpDev) {
    return { data: session, loading: false };
  }

  // const { data, status } = useNextAuthSession();
  // return { data, loading: false };

  const [session, loading] = useNextAuthSession();
  let data = session;
  const userQuery = useAsync(fetchUser, [session]);

  if (
    session &&
    !session.user.userId &&
    !userQuery.loading &&
    userQuery.result.data
  ) {
    const { _id, userName, isAdmin } = userQuery.result.data;
    data = {
      ...session,
      user: {
        ...session.user,
        userId: _id,
        userName,
        isAdmin: isAdmin || false
      }
    };
  }

  return { data, loading: loading || userQuery.loading };
}
