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
    const { data } = await api.get(`user/${session.user.email}`);

    if (data) {
      const { _id, userName, userImage, isAdmin } = data;

      return {
        ...session,
        user: {
          ...session.user,
          userId: _id,
          userName: userName ? userName : session.user.email.replace(/@.+/, ""),
          userImage,
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
  const dispatch = useAppDispatch();

  const xhr = async () => {
    const userQuery = await dispatch(getUser.initiate(session.user.email));

    if (userQuery.data) setData(userQuery.data);
  };

  if (!session || session.user.userId) return { data: session, loading };

  xhr();

  if (data) {
    const { _id, userName, userImage, isAdmin } = data;

    return {
      data: {
        ...session,
        user: {
          ...session.user,
          userId: _id,
          userName: userName ? userName : _id,
          userImage,
          isAdmin: isAdmin || false
        }
      },
      loading: false
    };
  }

  return { data: session, loading };
}
