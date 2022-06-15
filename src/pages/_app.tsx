import { NextPage, NextPageContext } from "next";
import { AppInitialProps, AppProps as NextAppProps } from "next/app";
import React, { useEffect, useState } from "react";
import { getSelectorsByUserAgent, isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import { Chakra } from "features/common";
import { GlobalStyles } from "features/layout";
import { setIsOffline } from "features/session/sessionSlice";
import { selectUserEmail, setUserEmail } from "features/users/userSlice";
import { useAppDispatch, wrapper } from "store";
import theme from "theme/theme";
import api from "utils/api";
import { magic, Session, SessionContext } from "utils/auth";
import { isServer } from "utils/isServer";
//import { AppStateProvider } from "utils/context";

export interface PageProps {
  email?: string | null;
  isMobile: boolean;
  isSessionLoading?: boolean;
  session: Session | null;
  setSession?: React.Dispatch<React.SetStateAction<Session | null>>;
}

const App = wrapper.withRedux(
  ({
    Component,
    pageProps,
    cookies
  }: NextAppProps<{
    pageProps: {
      email?: string;
      isMobile: boolean;
    };
  }> & {
    cookies?: string;
  }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [isSessionLoading, setIsSessionLoading] = useState(true);

    const dispatch = useAppDispatch();
    const userEmail = useSelector(selectUserEmail);

    useEffect(function clientDidMount() {
      (async function checkLoginStatus() {
        try {
          const { data: session } = await api.get("user");

          if (session.user) {
            setSession(session);
            dispatch(setUserEmail(session.user.email));
          } else {
            const isLoggedIn = await magic.user.isLoggedIn();

            if (isLoggedIn) {
              const didToken = await magic.user.getIdToken({
                lifespan: 60 * 60 * 10
              });

              const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + didToken
                }
              });

              if (res.status === 200) {
                const user = await res.json();
                setSession({ user });
                dispatch(setUserEmail(session.user.email));
              }
            }
          }

          setIsSessionLoading(false);
        } catch (error) {
          setSession(null);
          setIsSessionLoading(false);
        }
      })();

      (async function checkOnlineStatus() {
        try {
          const res = await api.get("check");
          if (res.status === 404) throw new Error();
        } catch (error) {
          dispatch(setIsOffline(true));
          //setIsSessionLoading(false);
        }
      })();

      window.addEventListener("offline", () => {
        console.log("offline_event");
        dispatch(setIsOffline(true));
      });

      window.addEventListener("online", () => {
        console.log("online_event");
        dispatch(setIsOffline(false));
      });
    }, []);

    return (
      <>
        <GlobalStyles />

        <SessionContext.Provider
          value={[session, isSessionLoading, setSession, setIsSessionLoading]}
        >
          <Chakra theme={theme} cookies={cookies}>
            <Component
              {...pageProps}
              email={
                session
                  ? session.user.email
                  : pageProps.email
                  ? pageProps.email
                  : userEmail
              }
              isMobile={pageProps.isMobile || isMobile}
              //isMobile
              isSessionLoading={isSessionLoading}
              session={session}
              setSession={setSession}
            />
          </Chakra>
        </SessionContext.Provider>
      </>
    );
  }
);

App.getInitialProps = async function AppGetInitialProps({
  Component,
  ctx
}: {
  Component: NextPage;
  ctx: NextPageContext;
}): Promise<AppInitialProps & { cookies?: string }> {
  //#region headers
  const headers = ctx.req?.headers;
  const cookies = headers?.cookie;
  let userAgent = headers?.["user-agent"];
  if (!userAgent && !isServer()) userAgent = navigator.userAgent;
  //#endregion

  //#region pageProps
  let pageProps: Partial<PageProps> = {
    isMobile:
      typeof userAgent === "string"
        ? getSelectorsByUserAgent(userAgent).isMobile
        : false
  };

  if (ctx.query.email) pageProps.email = ctx.query.email as string;

  if (Component.getInitialProps)
    pageProps = {
      ...pageProps,
      ...(await Component.getInitialProps(ctx))
    };
  //#endregion

  return {
    cookies,
    pageProps
  };
};

export default App;
