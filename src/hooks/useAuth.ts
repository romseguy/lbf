//@ts-nocheck
import {
  useSession as useNextAuthSession,
  getSession as getNextAuthSession
} from "next-auth/client";
import { normalize } from "utils/string";
import { getUser } from "features/users/usersApi";
import { useAppDispatch } from "store";
import { useState } from "react";
import api from "utils/api";

let cachedSession;

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

export async function getSession(options): Promise<AppSession | null> {
  const session = await getNextAuthSession(options);
  if (!session || !session.user || session.user.userId) return session;

  if (!session.user.userId) {
    if (cachedSession) {
      // console.log("returning cachedSession");
      return cachedSession;
    }

    const { data } = await api.get(`user/${session.user.email}`);

    if (data) {
      const { _id, userName, userImage, isAdmin } = data;
      cachedSession = {
        ...session,
        user: {
          ...session.user,
          userId: _id,
          userName: userName ? userName : session.user.email.replace(/@.+/, ""),
          userImage,
          isAdmin: isAdmin || false
        }
      };

      return cachedSession;
    }
  }

  return session;
}

export function useSession(): { data: AppSession | null; loading: boolean } {
  const [session, loading] = useNextAuthSession();
  const [dataSession, setDataSession] = useState();
  const dispatch = useAppDispatch();

  if (!session || session.user.userId) {
    cachedSession = session;
    return { data: session, loading };
  }

  if (cachedSession && cachedSession.user.email === session.user.email) {
    // console.log("returning cached session");
    return { data: cachedSession, loading };
  }

  const xhr = async () => {
    console.log("fetching session");
    const userQuery = await dispatch(getUser.initiate(session.user.email));
    if (userQuery.data) {
      const { _id, userName, userImage, isAdmin } = userQuery.data;
      cachedSession = {
        ...session,
        user: {
          ...session.user,
          userId: _id,
          userName: userName ? userName : _id,
          userImage,
          isAdmin: isAdmin || false
        }
      };
      setDataSession(cachedSession);
    }
  };

  xhr();

  if (dataSession) {
    console.log("returning fetched session");
    return {
      data: dataSession,
      loading: false
    };
  }

  return { data: session, loading };
}
