import { NextPage, NextPageContext } from "next";
import { AppProps as NextAppProps } from "next/app";
import React, { useState } from "react";
import { getSelectorsByUserAgent, isMobile } from "react-device-detect";
import { Chakra } from "features/common";
import theme from "features/layout/theme";
import { wrapper } from "store";
import { Session, SessionContext } from "utils/auth";
import { isServer } from "utils/isServer";
import { Main, PageProps } from "main";

interface AppProps {
  cookies?: string;
  pageProps: Partial<PageProps>;
}

const App = wrapper.withRedux(
  ({ Component, cookies, pageProps }: NextAppProps<PageProps> & AppProps) => {
    const [session, setSession] = useState<Session | null>(null);
    const [isSessionLoading, setIsSessionLoading] = useState(true);

    return (
      <SessionContext.Provider
        value={[session, isSessionLoading, setSession, setIsSessionLoading]}
      >
        <Chakra theme={theme} cookies={cookies}>
          <Main
            Component={Component}
            email={pageProps.email}
            isMobile={pageProps.isMobile || isMobile}
            isSessionLoading={isSessionLoading}
            setIsSessionLoading={setIsSessionLoading}
            session={session}
            setSession={setSession}
          />
        </Chakra>
      </SessionContext.Provider>
    );
  }
);

App.getInitialProps = async function AppGetInitialProps({
  Component,
  ctx
}: {
  Component: NextPage;
  ctx: NextPageContext;
}): Promise<AppProps> {
  //#region headers
  const headers = ctx.req?.headers;
  const cookies = headers?.cookie;
  let userAgent = headers?.["user-agent"];
  if (!userAgent && !isServer()) userAgent = navigator.userAgent;
  //#endregion

  let pageProps: AppProps["pageProps"] = {
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

  return {
    cookies,
    pageProps
  };
};

export default App;
