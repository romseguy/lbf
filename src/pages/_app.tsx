import Iron from "@hapi/iron";
import { parse } from "cookie";
import { NextPage, NextPageContext } from "next";
import { AppProps as NextAppProps } from "next/app";
import React from "react";
import { getSelectorsByUserAgent, isMobile } from "react-device-detect";
import { Chakra } from "features/common";
import theme from "features/layout/theme";
import { Main, PageProps } from "main";
import { wrapper } from "store";
import { getAuthToken, sealOptions, Session } from "utils/auth";
import { isServer } from "utils/isServer";

interface AppProps {
  cookies?: string;
  pageProps: Partial<PageProps>;
}

const App = wrapper.withRedux(
  ({ Component, cookies, pageProps }: NextAppProps<PageProps> & AppProps) => {
    return (
      <Chakra theme={theme} cookies={cookies}>
        <Main
          Component={Component}
          email={pageProps.email}
          isMobile={pageProps.isMobile || isMobile}
          {...pageProps}
        />
      </Chakra>
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
  console.log("App.getInitialProps: cookies", cookies);
  let session: Session | null = null;

  if (cookies) {
    const p = parse(cookies);
    console.log("App.getInitialProps: parsed cookies", p);
    const authToken = getAuthToken(p);

    if (authToken) {
      console.log("App.getInitialProps: authToken", authToken);
      const user = await Iron.unseal(
        authToken,
        process.env.SECRET,
        sealOptions
      );

      if (user) {
        session = { user };
        console.log("App.getInitialProps: session", session);
      }
    }
  }

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
  if (session) {
    pageProps.session = session;
  }

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
