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
import { devSession, testSession, getAuthToken, sealOptions } from "utils/auth";
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
      let email = ctx.query.email || "";
      const cookies = headers?.cookie;
      let userAgent = headers?.["user-agent"];
      if (!userAgent && !isServer()) userAgent = navigator.userAgent;
      const isMobile =
        typeof userAgent === "string"
          ? getSelectorsByUserAgent(userAgent).isMobile
          : rddIsMobile;
      store.dispatch(setIsMobile(isMobile));

      let pageProps: AppProps["pageProps"] = { isMobile };

      if (devSession && getEnv() === "development") {
        console.log("🚀 ~ file: _app.tsx:63 ~ devSession:", devSession);
        store.dispatch(setSession(devSession));
        //@ts-ignore
        email = devSession.user.email;
      } else if (testSession && getEnv() === "test") {
        console.log("🚀 ~ file: _app.tsx:67 ~ testSession:", testSession);
        store.dispatch(setSession(testSession));
        email = testSession.user.email;
      } else if (cookies) {
        const p = parse(cookies);
        console.log("App.getInitialProps: parsed cookies", p);
        const authToken = getAuthToken(p);

        if (authToken) {
          //console.log("App.getInitialProps: authToken", authToken);
          const user = await unseal(authToken, process.env.SECRET, sealOptions);

          if (user) {
            store.dispatch(setSession({ user }));
            email = user.email;
          }
        }
      }

      if (typeof email === "string") {
        store.dispatch(setUserEmail(email));
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
