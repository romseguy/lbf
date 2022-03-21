import { Session } from "next-auth";
import {
  useSession as useNextAuthSession,
  getSession as getNextAuthSession,
  GetSessionParams
} from "next-auth/react";
import { useSelector } from "react-redux";
import { selectSession, setSession } from "features/session/sessionSlice";
import { useAppDispatch } from "store";
import api from "utils/api";
import { isServer } from "utils/isServer";
import sessionFixture from "../../cypress/fixtures/session.json";

let cachedSession: Session | null = null;

export async function getSession(
  params?: GetSessionParams
): Promise<Session | null> {
  if (
    process.env.NEXT_PUBLIC_IS_TEST &&
    typeof params?.req?.headers.cookie === "string" &&
    !params?.req?.headers.cookie.includes("null")
  ) {
    return sessionFixture;
  }

  const session = await getNextAuthSession(params);
  //console.log("G NAS", session);
  //console.log("G AppS", cachedSession);

  if (!session) return session;

  if (!cachedSession) {
    const userQuery = await api.get(`user/${session.user.email}`);

    if (!userQuery.data) {
      cachedSession = session;
    } else {
      const {
        _id,
        userName = _id,
        userImage,
        suggestedCategoryAt,
        isAdmin = false
      } = userQuery.data;

      cachedSession = {
        ...session,
        user: {
          ...session.user,
          userId: _id,
          userName: userName ? userName : _id,
          userImage,
          suggestedCategoryAt,
          isAdmin: isAdmin || false
        }
      };
    }
  }

  return cachedSession;
}

let isLoading = false;

export const useSession = (): {
  data: Session | null;
  loading: boolean;
} => {
  const dispatch = useAppDispatch();
  const { data: session, status } = useNextAuthSession();
  //console.log("NAS", session, status);
  const populatedSession = useSelector(selectSession);
  //console.log("AppS", populatedSession, isLoading);

  const loading = status === "loading";

  if (!session || loading) return { data: session, loading };

  if (populatedSession) {
    return { data: populatedSession, loading: false };
  }

  if (!isServer() && !isLoading) {
    (async function populateSession() {
      isLoading = true;
      const userQuery = await api.get(`user/${session.user.email}`);
      isLoading = false;

      if (!userQuery.data) {
        dispatch(setSession(session));
      } else {
        const {
          _id,
          userName = _id,
          userImage,
          suggestedCategoryAt,
          isAdmin = false
        } = userQuery.data;

        dispatch(
          setSession({
            ...session,
            user: {
              ...session.user,
              userId: _id,
              userName: userName ? userName : _id,
              userImage,
              suggestedCategoryAt,
              isAdmin: isAdmin || false
            }
          })
        );
      }
    })();
  }

  return { data: session, loading: typeof session.user.userId === "undefined" };
};

// export async function getSession(
//   params: GetSessionParams
// ): Promise<Session | null> {
//   return await getNextAuthSession(params);
// }

// export const useSession = (): { data: Session | null; loading: boolean } => {
//   const { data: session, status } = useNextAuthSession();
//   console.log("CSSession", session);
//   const loading = status === "loading";
//   return { data: session, loading };
// };
