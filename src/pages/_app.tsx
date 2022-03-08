import { NextPage, NextPageContext } from "next";
import { AppProps } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React, { useEffect } from "react";
import { getSelectorsByUserAgent, isMobile } from "react-device-detect";
import { Chakra } from "features/common";
import { GlobalStyles } from "features/layout";
import { setIsOffline } from "features/session/sessionSlice";
import { setUserEmail } from "features/users/userSlice";
import { getSession } from "hooks/useAuth";
import { useAppDispatch, wrapper } from "store";
import theme from "theme/theme";
import api from "utils/api";
import { isServer } from "utils/isServer";

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

const App = wrapper.withRedux(
  ({
    Component,
    pageProps,
    cookies
  }: AppProps & { cookies?: string; pageProps: PageProps }) => {
    const dispatch = useAppDispatch();

    useEffect(function clientDidMount() {
      if (pageProps.email) {
        dispatch(setUserEmail(pageProps.email));
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
            <Component
              {...pageProps}
              isMobile={pageProps.isMobile || isMobile}
            />
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
  let cookies: string | undefined;
  let userAgent: string | undefined;

  if (ctx.req?.headers) {
    cookies = ctx.req.headers.cookie;
    userAgent = ctx.req.headers["user-agent"];
  }

  let pageProps: Partial<PageProps> = {};

  if (ctx.query.email) {
    pageProps.email = ctx.query.email as string;
  }

  pageProps.isMobile =
    typeof userAgent === "string"
      ? getSelectorsByUserAgent(userAgent).isMobile
      : false;

  pageProps.session = await getSession(ctx);

  if (pageProps.session) {
    pageProps.email = pageProps.session.user.email;
  }

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
