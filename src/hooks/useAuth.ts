import { Session } from "next-auth";
import {
  useSession as useNextAuthSession,
  getSession as getNextAuthSession,
  GetSessionParams
} from "next-auth/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectSessionRefetch } from "features/session/sessionSlice";
import api from "utils/api";
import { isServer } from "utils/isServer";
import sessionFixture from "../../cypress/fixtures/session.json";

export async function getSession(
  params: GetSessionParams
): Promise<Session | null> {
  if (
    process.env.NEXT_PUBLIC_IS_TEST &&
    typeof params.req?.headers.cookie === "string" &&
    !params.req?.headers.cookie.includes("null")
  ) {
    return sessionFixture;
  }

  let session = await getNextAuthSession(params);
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

let cachedRefetchSession = false;
let isLoading = false;
let populatedSession: Session | null = null;

export const useSession = (): {
  data: Session | null;
  loading: boolean;
} => {
  const refetchSession = useSelector(selectSessionRefetch);
  useEffect(() => {
    if (refetchSession !== cachedRefetchSession) {
      //console.log("REFETCHING");
      cachedRefetchSession = refetchSession;
      populatedSession = null;
    }
  }, [refetchSession]);

  const { data: session, status } = useNextAuthSession();
  const loading = status === "loading";

  if (!session || loading) return { data: session, loading };

  if (populatedSession) {
    //console.log("POPULATED", populatedSession);
    return { data: populatedSession, loading: false };
  }

  if (!isServer() && !isLoading) {
    //console.log("POPULATING");
    (async () => {
      isLoading = true;
      const userQuery = await api.get(
        `user/${session.user.email}?select=isAdmin`
      );
      isLoading = false;

      if (!userQuery.data) {
        populatedSession = session;
      } else {
        const {
          _id,
          email = session.user.email,
          userName = _id,
          userImage,
          suggestedCategoryAt,
          isAdmin = false
        } = userQuery.data;

        populatedSession = {
          ...session,
          user: {
            ...session.user,
            email,
            userId: _id,
            userName: userName ? userName : _id,
            userImage,
            suggestedCategoryAt,
            isAdmin: isAdmin || false
          }
        };
      }
    })();
  }

  return { data: populatedSession || session, loading: isLoading };
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
