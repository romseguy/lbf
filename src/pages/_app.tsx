import { NextPage, NextPageContext } from "next";
import { AppProps as NextAppProps } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React, { useEffect } from "react";
import { getSelectorsByUserAgent, isMobile } from "react-device-detect";
import { Chakra } from "features/common";
import { GlobalStyles } from "features/layout";
import {
  selectSession,
  setIsOffline,
  setSession
} from "features/session/sessionSlice";
import { setUserEmail } from "features/users/userSlice";
import { getSession } from "hooks/useAuth";
import { useAppDispatch, wrapper } from "store";
import theme from "theme/theme";
import api from "utils/api";
//import { AppStateProvider } from "utils/context";
import { isServer } from "utils/isServer";
import { useSelector } from "react-redux";

export interface PageProps {
  email?: string;
  isMobile: boolean;
  session: Session | null;
}

if (!isServer() && process.env.NODE_ENV === "production") {
  const CleanConsole = require("@eaboy/clean-console");
  CleanConsole.init({
    initialMessages: [
      { message: `Bienvenue sur ${process.env.NEXT_PUBLIC_SHORT_URL}` }
    ],
    debugLocalStoregeKey: "allowConsole"
  });
}

interface AppProps extends NextAppProps<PageProps> {
  cookies?: string;
  pageProps: PageProps;
}

const App = wrapper.withRedux(
  ({ Component, pageProps, cookies, ...props }: AppProps) => {
    const dispatch = useAppDispatch();
    const session = useSelector(selectSession);

    useEffect(function clientDidMount() {
      if (pageProps.email) {
        dispatch(setUserEmail(pageProps.email));
      }

      if (pageProps.session && !session) {
        dispatch(setSession(pageProps.session));
      }

      (async function checkOnlineStatus() {
        try {
          await api.get("check");
        } catch (error) {
          dispatch(setIsOffline(true));
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

        <SessionProvider session={pageProps.session}>
          <Chakra theme={theme} cookies={cookies}>
            {/* <AppStateProvider isMobile={props.isMobile || isMobile}> */}
            <Component
              {...pageProps}
              isMobile={/*true ||*/ pageProps.isMobile || isMobile}
            />
            {/* </AppStateProvider> */}
          </Chakra>
        </SessionProvider>
      </>
    );
  }
);

App.getInitialProps = async ({
  Component,
  ctx
}: {
  Component: NextPage;
  ctx: NextPageContext;
}) => {
  //#region headers
  const headers = ctx.req?.headers;
  const cookies = headers?.cookie;
  const userAgent = headers?.["user-agent"] || navigator.userAgent;
  //#endregion

  let pageProps: Partial<PageProps> = {
    isMobile:
      typeof userAgent === "string"
        ? getSelectorsByUserAgent(userAgent).isMobile
        : false,
    session: await getSession({ req: ctx.req })
  };

  //#region query
  if (ctx.query.email) {
    pageProps.email = ctx.query.email as string;
  } else if (pageProps.session) {
    pageProps.email = pageProps.session.user.email;
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
