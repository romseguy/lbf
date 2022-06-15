import { useContext } from "react";
import { SessionContext } from "utils/auth";

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
