import { Session, User } from "next-auth";
import {
  useSession as useNextAuthSession,
  getSession as getNextAuthSession,
  GetSessionOptions
} from "next-auth/client";
import { useSelector } from "react-redux";
import {
  selectLoading,
  selectSession,
  setLoading,
  setSession
} from "features/session/sessionSlice";
import { IUser } from "models/User";
import { useAppDispatch } from "store";
import api from "utils/api";
import { isServer } from "utils/isServer";
import sessionFixture from "../../cypress/fixtures/session.json";

export async function getSession(
  options: GetSessionOptions
): Promise<Session | null> {
  if (
    process.env.NEXT_PUBLIC_IS_TEST &&
    typeof options.req?.headers.cookie === "string" &&
    !options.req?.headers.cookie.includes("null")
  ) {
    return sessionFixture;
  }

  let session = await getNextAuthSession(options);
  if (!session) return session;

  if (
    session.user &&
    (!session.user.userId || session.user.suggestedCategoryAt === undefined)
  ) {
    // console.log("getSession: fetching", session);
    const { data } = await api.get(`user/${session.user.email}?select=isAdmin`);

    if (data) {
      const { _id, userName, suggestedCategoryAt = null, isAdmin } = data;

      session = {
        ...session,
        user: {
          ...session.user,
          userId: _id,
          userName,
          // userName: userName
          //   ? userName
          //   : session.user.email?.replace(/@.+/, ""),
          suggestedCategoryAt,
          isAdmin: isAdmin || false
        }
      };
      // console.log("getSession: fetched", session);
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
    const userQuery = await api.get(
      `user/${session.user.email}?select=isAdmin`
    );

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
