import Iron from "@hapi/iron";
import { useContext } from "react";
import { getAuthToken, Session, SessionContext, TOKEN_NAME } from "utils/auth";

const sealOptions = {
  ...Iron.defaults,
  encryption: { ...Iron.defaults.encryption, minPasswordlength: 0 },
  integrity: { ...Iron.defaults.integrity, minPasswordlength: 0 }
};

export async function getSession(params?: any): Promise<Session | null> {
  const cookies = params.req.cookies;
  //console.log("GETSESSION COOKIES", cookies);

  if (!cookies[TOKEN_NAME]) return null;

  const user = await Iron.unseal(
    getAuthToken(cookies),
    process.env.SECRET,
    sealOptions
  );

  if (!user) return null;

  return { user };
}

export const useSession = () => {
  const [session, isSessionLoading, setSession, setIsSessionLoading] =
    useContext(SessionContext);

  // app initial state
  if (session === undefined || session === null)
    return {
      data: null,
      loading: isSessionLoading,
      setSession,
      setIsSessionLoading
    };

  return {
    data: session,
    loading: isSessionLoading,
    setSession,
    setIsSessionLoading
  };
};
