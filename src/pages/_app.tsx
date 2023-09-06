import "polyfill-object.fromentries";
import { unseal } from "@hapi/iron";
import { parse } from "cookie";
import { AppProps as NextAppProps } from "next/app";
import NextNprogress from "nextjs-progressbar";
import React from "react";
import {
  getSelectorsByUserAgent,
  isMobile as rddIsMobile
} from "react-device-detect";
import { Chakra } from "features/common";
import theme from "features/layout/theme";
import { Main, PageProps } from "main";
import { wrapper } from "store";
import { setIsMobile } from "store/uiSlice";
import { setUserEmail } from "store/userSlice";
import { setSession } from "store/sessionSlice";
import {
  devSession,
  testSession,
  getAuthToken,
  sealOptions,
  TOKEN_NAME
} from "utils/auth";
import { isServer } from "utils/isServer";
const { getEnv } = require("utils/env");

interface AppProps {
  cookies?: string;
  pageProps: Partial<PageProps>;
}

const App = wrapper.withRedux(
  ({ Component, cookies, pageProps }: NextAppProps<PageProps> & AppProps) => {
    //if (getEnv() === "test") return <Component {...pageProps} />;
    return (
      <>
        <NextNprogress
          color="#29D"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow
        />
        <Chakra theme={theme} cookies={cookies}>
          <Main Component={Component} {...pageProps} />
        </Chakra>
      </>
    );
  }
);

App.getInitialProps = wrapper.getInitialAppProps(
  (store) =>
    async ({ Component, ctx }) => {
      const headers = ctx.req?.headers;
      // console.log("🚀 ~ App.getInitialProps ~ headers:", headers);

      //#region device
      let userAgent = headers?.["user-agent"];
      if (!userAgent && !isServer()) userAgent = navigator.userAgent;
      const isMobile =
        typeof userAgent === "string"
          ? getSelectorsByUserAgent(userAgent).isMobile
          : rddIsMobile;
      store.dispatch(setIsMobile(isMobile));
      //#endregion

      //#region email and session handling
      let email = ctx.query.email;
      let session;

      if (devSession && getEnv() === "development") {
        // console.log("🚀 ~ App.getInitialProps ~ devSession:", devSession);
        session = devSession;
        //@ts-ignore
        email = devSession.user.email;
      }

      if (testSession && getEnv() === "test") {
        // console.log("🚀 ~ App.getInitialProps ~ testSession:", testSession);
        session = testSession;
        //@ts-ignore
        email = testSession.user.email;
      }

      const cookies = headers?.cookie;

      if (typeof cookies === "string" && cookies.includes(TOKEN_NAME)) {
        const cookie = parse(cookies);
        // console.log("🚀 ~ App.getInitialProps ~ cookie map:", cookie);
        const authToken = getAuthToken(cookie);

        if (authToken) {
          // console.log("🚀 ~ App.getInitialProps ~ authToken:", authToken);
          const user = await unseal(authToken, process.env.SECRET, sealOptions);

          if (user) {
            session = { user };
            email = user.email;
          }
        }
      }

      if (typeof email === "string") store.dispatch(setUserEmail(email));
      if (session) store.dispatch(setSession(session));
      //#endregion

      let pageProps: AppProps["pageProps"] = { isMobile };

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
