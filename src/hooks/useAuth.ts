import { Session, User } from "next-auth";
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
import { IUser } from "models/User";

export async function getSession(
  options: GetSessionOptions
): Promise<Session | null> {
  const session = await getNextAuthSession(options);

  if (
    session &&
    session.user &&
    (!session.user.userId || session.user.suggestedCategoryAt === undefined)
  ) {
    const { data } = await api.get(`user/${session.user.email}`);

    if (data) {
      const { _id, userName, suggestedCategoryAt = null, isAdmin } = data;

      return {
        ...session,
        user: {
          ...session.user,
          userId: _id,
          // userName: userName
          //   ? userName
          //   : session.user.email?.replace(/@.+/, ""),
          suggestedCategoryAt,
          isAdmin: isAdmin || false
        }
      };
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
        suggestedCategoryAt,
        isAdmin = false
      }: IUser = userQuery.data;

      const user: User = {
        ...session.user,
        email,
        userId: _id,
        userName: userName ? userName : _id,
        userImage,
        suggestedCategoryAt,
        isAdmin: isAdmin || false
      };

      const newSession = {
        ...session,
        user
      };

      dispatch(setSession(newSession));
      dispatch(setLoading(false));
    }
  };

  if (!appSessionLoading) xhr();

  return { data: null, loading: true };
};

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
