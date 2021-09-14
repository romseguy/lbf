//@ts-nocheck
import { useAsync } from "react-async-hook";
import {
  useSession as useNextAuthSession,
  getSession as getNextAuthSession
} from "next-auth/client";
import { normalize } from "utils/string";
import { getUser } from "features/users/usersApi";
import { store } from "store";
import { useState } from "react";
import api from "utils/api";

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
  if (!session || !session.user) return session;

  if (!session.user.userId) {
    const { error, data } = await api.get(`user/${session.user.email}`);

    console.log(data);

    // const userQuery = await store.dispatch(
    //   getUser.initiate(session.user.email)
    // );

    //if (userQuery.data) {
    if (data) {
      //const { _id, userName, isAdmin } = userQuery.data;
      const { _id, userName, isAdmin } = data;

      return {
        ...session,
        user: {
          ...session.user,
          userId: _id,
          userName: userName
            ? userName
            : normalize(session.user.email.replace(/@.+/, "")),
          isAdmin: isAdmin || false
        }
      };
    }
  }

  return session;
}

export function useSession(): { data: AppSession | null; loading: boolean } {
  const [session, loading] = useNextAuthSession();
  const [data, setData] = useState();

  const xhr = async () => {
    const userQuery = await store.dispatch(
      getUser.initiate(session.user.email)
    );

    if (userQuery.data) setData(userQuery.data);
  };

  if (!session || session.user.userId) return { data: session, loading };

  xhr();

  if (data) {
    const { _id, userName, isAdmin } = data;

    return {
      data: {
        ...session,
        user: {
          ...session.user,
          userId: _id,
          userName: userName ? userName : _id,
          // : normalize(session.user.email.replace(/@.+/, "")),
          isAdmin: isAdmin || false
        }
      },
      loading: false
    };
  }

  return { data: session, loading };
}
