import { NextPage, NextPageContext } from "next";
import { AppProps } from "next/app";
import { Session } from "next-auth";
import { Provider as SessionProvider } from "next-auth/client";
import React from "react";
import { getSelectorsByUserAgent } from "react-device-detect";
import { Chakra } from "features/common";
import { GlobalStyles } from "features/layout";
import { getSession } from "hooks/useAuth";
import { wrapper } from "store";
import theme from "theme/theme";
import { isServer } from "utils/isServer";

export interface PageProps {
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
    return (
      <>
        <GlobalStyles />

        <SessionProvider session={pageProps.session}>
          <Chakra theme={theme} cookies={cookies}>
            <Component {...pageProps} />
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
  const cookies = ctx.req?.headers?.cookie;
  const userAgent = ctx.req?.headers["user-agent"] || navigator.userAgent;
  const { isMobile, isMobileOnly } = getSelectorsByUserAgent(userAgent);
  const session = await getSession(ctx);
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return {
    cookies,
    pageProps: {
      ...pageProps,
      isMobile,
      //isMobileOnly,
      session
    }
  };
};

export default App;
