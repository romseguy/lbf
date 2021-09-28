import { Session } from "next-auth";
import {
  useSession as useNextAuthSession,
  getSession as getNextAuthSession,
  GetSessionOptions
} from "next-auth/client";
import { getUser } from "features/users/usersApi";
import { useAppDispatch } from "store";
import { useState } from "react";
import api from "utils/api";

let cachedSession: Session | null;

export async function getSession(
  options: GetSessionOptions
): Promise<Session | null> {
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
          userName: userName
            ? userName
            : session.user.email?.replace(/@.+/, ""),
          userImage,
          isAdmin: isAdmin || false
        }
      };

      return cachedSession;
    }
  }

  return session;
}

export const useSession = (): { data: Session | null; loading: boolean } => {
  const [session, loading] = useNextAuthSession();
  const [dataSession, setDataSession] = useState<Session | null>();
  const dispatch = useAppDispatch();

  if (
    session &&
    cachedSession &&
    cachedSession.user.email === session.user.email
  ) {
    return { data: cachedSession, loading };
  }

  if (!session || session.user.userId) {
    cachedSession = session;
    return { data: session, loading };
  }

  const xhr = async () => {
    if (!session.user.email) return;

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
    return {
      data: dataSession,
      loading: false
    };
  }

  return { data: session, loading };
};
