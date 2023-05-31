import Iron from "@hapi/iron";
import { parse } from "cookie";
import { AppProps as NextAppProps } from "next/app";
import React from "react";
import { getSelectorsByUserAgent, isMobile } from "react-device-detect";
import { Chakra } from "features/common";
import theme from "features/layout/theme";
import { Main, PageProps } from "main";
import { wrapper } from "store";
import { getAuthToken, sealOptions, Session } from "utils/auth";
import { isServer } from "utils/isServer";
import { setUserEmail } from "store/userSlice";
import { setSession } from "store/sessionSlice";

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
          isMobile={pageProps.isMobile || isMobile}
          {...pageProps}
        />
      </Chakra>
    );
  }
);

App.getInitialProps = wrapper.getInitialAppProps(
  (store) =>
    async ({ Component, ctx }) => {
      const headers = ctx.req?.headers;
      const email = ctx.query.email;
      if (typeof email === "string") {
        store.dispatch(setUserEmail(email));
      }
      const cookies = headers?.cookie;
      let userAgent = headers?.["user-agent"];
      if (!userAgent && !isServer()) userAgent = navigator.userAgent;
      let pageProps: AppProps["pageProps"] = {
        isMobile:
          typeof userAgent === "string"
            ? getSelectorsByUserAgent(userAgent).isMobile
            : false
      };

      if (cookies) {
        const p = parse(cookies);
        //console.log("App.getInitialProps: parsed cookies", p);
        const authToken = getAuthToken(p);

        if (authToken) {
          //console.log("App.getInitialProps: authToken", authToken);
          const user = await Iron.unseal(
            authToken,
            process.env.SECRET,
            sealOptions
          );

          if (user) store.dispatch(setSession({ user }));
        }
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
    }
);

export default App;

{
  /*
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
  //console.log("App.getInitialProps: cookies", cookies);
  let session: Session | null = null;
  let userAgent = headers?.["user-agent"];
  if (!userAgent && !isServer()) userAgent = navigator.userAgent;

  if (cookies) {
    const p = parse(cookies);
    //console.log("App.getInitialProps: parsed cookies", p);
    const authToken = getAuthToken(p);

    if (authToken) {
      //console.log("App.getInitialProps: authToken", authToken);
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
  //#endregion

  //#region page props
  let pageProps: AppProps["pageProps"] = {
    isMobile:
      typeof userAgent === "string"
        ? getSelectorsByUserAgent(userAgent).isMobile
        : false
  };
  if (session) pageProps.session = session;
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
*/
}
