import React from "react";
import { NextPage, NextPageContext } from "next";
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Chakra } from "features/common";
import { GlobalStyles } from "features/layout";
import theme from "theme/theme";
import { wrapper } from "store";
import { isServer } from "utils/isServer";
import { getSession } from "hooks/useAuth";

if (isServer()) {
  React.useLayoutEffect = React.useEffect;
}

const App = ({
  Component,
  pageProps: { session, ...pageProps },
  cookies
}: AppProps & { cookies?: string }) => {
  return (
    <>
      <GlobalStyles />

      <SessionProvider session={session}>
        <Chakra theme={theme} cookies={cookies}>
          <Component {...pageProps} />
        </Chakra>
      </SessionProvider>
    </>
  );
};

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

export default wrapper.withRedux(App);
