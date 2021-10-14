import { Session } from "next-auth";
import {
  useSession as useNextAuthSession,
  getSession as getNextAuthSession,
  GetSessionOptions
} from "next-auth/client";
import { useAppDispatch } from "store";
import api from "utils/api";
import { useSelector } from "react-redux";
import {
  selectLoading,
  selectSession,
  setLoading,
  setSession
} from "features/session/sessionSlice";
import { isServer } from "utils/isServer";

let cachedSession: Session | null;

/*
export async function getSession(
  options: GetSessionOptions
): Promise<Session | null> {
  return await getNextAuthSession(options);
}

export const useSession = (): { data: Session | null; loading: boolean } => {
  const [session, loading] = useNextAuthSession();
  return { data: session, loading };
};
*/

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
  const dispatch = useAppDispatch();
  const [session, loading] = useNextAuthSession();

  if (isServer()) return { data: session, loading };

  const appSessionLoading = useSelector(selectLoading);
  const appSession = useSelector(selectSession);
  if (appSession) return { data: appSession, loading: false };
  if (!session) return { data: null, loading };

  const xhr = async () => {
    dispatch(setLoading(true));

    const userQuery = await api.get("user/" + session.user.userId);

    if (userQuery.data) {
      const {
        _id,
        email = session.user.email,
        userName = _id,
        userImage,
        isAdmin = false
      } = userQuery.data;

      const newSession = {
        ...session,
        user: {
          ...session.user,
          email,
          userId: _id,
          userName: userName ? userName : _id,
          userImage,
          isAdmin: isAdmin || false
        }
      };

      dispatch(setSession(newSession));
      dispatch(setLoading(false));
    }
  };

  if (!appSessionLoading) xhr();

  return { data: null, loading: true };
};
