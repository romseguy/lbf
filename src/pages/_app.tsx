import React from "react";
import { NextPage, NextPageContext } from "next";
import { AppProps } from "next/app";
import { Provider as SessionProvider } from "next-auth/client";
import { Chakra } from "features/common";
import { GlobalStyles } from "features/layout";
import theme from "theme/theme";
import { wrapper } from "store";
import { isServer } from "utils/isServer";
import { getSession } from "hooks/useAuth";

import { AbortController } from "abort-controller";
import fetch, { Headers, Request, Response } from "node-fetch";

Object.assign(globalThis, {
  fetch,
  Headers,
  Request,
  Response,
  AbortController
});

if (isServer()) {
  React.useLayoutEffect = React.useEffect;
} else if (process.env.NODE_ENV === "production") {
  const CleanConsole = require("@eaboy/clean-console");
  CleanConsole.init({
    initialMessages: [
      { message: `Bienvenue sur ${process.env.NEXT_PUBLIC_SHORT_URL}` }
    ],
    debugLocalStoregeKey: "allowConsole"
  });
}

const App = wrapper.withRedux(
  ({ Component, pageProps, cookies }: AppProps & { cookies?: string }) => {
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
  const session = await getSession(ctx);
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  let cookies;

  if (ctx.req && ctx.req.headers) {
    cookies = ctx.req.headers.cookie;
  }

  return {
    cookies,
    pageProps: {
      ...pageProps,
      session
    }
  };
};

export default App;
