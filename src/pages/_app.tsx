import { NextPage, NextPageContext } from "next";
import { AppInitialProps, AppProps as NextAppProps } from "next/app";
import React, { useEffect, useState } from "react";
import { getSelectorsByUserAgent, isMobile } from "react-device-detect";
import { Chakra } from "features/common";
import { GlobalStyles } from "features/layout";
import { setIsOffline } from "features/session/sessionSlice";
import { selectUserEmail, setUserEmail } from "features/users/userSlice";
import { magic } from "lib/magic";
import { Session, SessionContext } from "lib/SessionContext";
import { useAppDispatch, wrapper } from "store";
import theme from "theme/theme";
import api from "utils/api";
import { useSelector } from "react-redux";
//import { AppStateProvider } from "utils/context";

export interface PageProps {
  email?: string | null;
  isMobile: boolean;
  isSessionLoading?: boolean;
  session: Session | null;
  setSession?: React.Dispatch<React.SetStateAction<Session | null>>;
}

interface AppProps extends NextAppProps<PageProps> {
  cookies?: string;
  pageProps: PageProps;
}

const App = wrapper.withRedux(({ Component, pageProps, cookies }: AppProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  const dispatch = useAppDispatch();
  const userEmail = useSelector(selectUserEmail);

  useEffect(function clientDidMount() {
    (async function checkLoginStatus() {
      try {
        const { data: session } = await api.get("user");

        if (session.user) {
          console.log("COOKIE SESSION", session);
          setSession(session);
        } else {
          const isLoggedIn = await magic.user.isLoggedIn();

          if (isLoggedIn) {
            console.log("MAGIC SESSION", isLoggedIn);
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
              console.log("user", user);

              setSession({ user });
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
        await api.get("https://lekoala.org/check");
      } catch (error) {
        dispatch(setIsOffline(true));
        setIsSessionLoading(false);
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
});

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
  const userAgent = headers?.["user-agent"] || navigator.userAgent;
  //#endregion

  let pageProps: Partial<PageProps> = {
    isMobile:
      typeof userAgent === "string"
        ? getSelectorsByUserAgent(userAgent).isMobile
        : false
  };

  //#region query
  if (ctx.query.email) {
    pageProps.email = ctx.query.email as string;
  }
  //#endregion

  if (Component.getInitialProps) {
    const componentInitialProps = await Component.getInitialProps(ctx);
    console.log(
      `componentInitialProps ${Component.displayName}`,
      componentInitialProps
    );

    pageProps = {
      ...pageProps,
      ...componentInitialProps
    };
  }

  return {
    cookies,
    pageProps
  };
};

export default App;
