import "allsettled-polyfill";
import "polyfill-object.fromentries";
import { unseal } from "@hapi/iron";
import { parse } from "cookie";
import { AppProps as NextAppProps } from "next/app";
//import { useRouter } from "next/router";
import NextNprogress from "nextjs-progressbar";
import React, { useEffect } from "react";
import {
  getSelectorsByUserAgent,
  isMobile as rddIsMobile
} from "react-device-detect";
//import { ProgressBar, ProgressBarProvider } from "react-transition-progress";
import { GlobalConfig } from "features/GlobalConfig";
import { ThemeProvider } from "features/ThemeProvider";
import { Main, PageProps } from "main";
import { wrapper } from "store";
import { setIsMobile } from "store/uiSlice";
import { setUserEmail } from "store/userSlice";
import { setIsSessionLoading, setSession } from "store/sessionSlice";
import {
  devSession,
  getAuthToken,
  sealOptions,
  TOKEN_NAME,
  Session
} from "utils/auth";
import { isServer } from "utils/isServer";
import { useRouter } from "next/router";
import { Spinner } from "@chakra-ui/react";

import { SimpleLayout } from "features/layout";
import { useSession } from "hooks/useSession";
import Script from "next/script";
const { getEnv } = require("utils/env");
if (getEnv === "development") {
  require("../../wdyr");
}

interface AppProps {
  cookies?: string;
  session?: Session;
  pageProps: PageProps;
}

// workaround to invalidate user subscription query
// so there's no need to pass the email in mutation payloads
export let globalEmail: string | undefined;

const App = wrapper.withRedux(
  ({
    Component,
    cookies,
    pageProps,
    ...props
  }: NextAppProps<PageProps> & AppProps) => {
    const { data } = useSession();
    const router = useRouter();
    const session = data || props.session;

    let main = <Main Component={Component} {...pageProps} />;

    useEffect(() => {
      if (!session && router.pathname !== "/callback")
        router.push("/login", "/login", { shallow: false });
    }, [session]);

    if (
      !session &&
      router.pathname !== "/login" &&
      router.pathname !== "/callback"
    )
      main = (
        <SimpleLayout {...pageProps} title="Veuillez patienter...">
          <Spinner />
        </SimpleLayout>
      );

    return (
      <>
        {getEnv() === "production" && (
          <>
            <Script id="yandexmetrika">
              {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date(); for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }} k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)}) (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym"); ym(98009246, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, trackHash:true });`}
            </Script>
          </>
        )}
        <GlobalConfig />
        <NextNprogress
          color="#29D"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow
        />
        <ThemeProvider cookies={cookies} isMobile={pageProps.isMobile}>
          {/* <ProgressBarProvider>
            <ProgressBar className="fixed h-1 shadow-lg shadow-sky-500/20 bg-sky-500 top-0" /> */}
          {main}
          {/* </ProgressBarProvider> */}
        </ThemeProvider>
      </>
    );
  }
);

App.getInitialProps = wrapper.getInitialAppProps(
  (store) =>
    async ({ Component, ctx }): Promise<AppProps> => {
      store.dispatch(setIsSessionLoading(true));
      const headers = ctx.req?.headers;
      const cookies = headers?.cookie;

      //#region browser
      let userAgent = headers?.["user-agent"];
      if (!isServer) {
        if (!userAgent) userAgent = navigator.userAgent;
      }
      //#endregion

      //#region device
      const isMobile =
        typeof userAgent === "string"
          ? getSelectorsByUserAgent(userAgent).isMobile
          : rddIsMobile;
      store.dispatch(setIsMobile(isMobile));
      //#endregion

      //#region email and session handling
      let email = ctx.query.email as string | undefined;
      let session: Session | undefined;
      let authToken: string | null = null;

      if (devSession && getEnv() === "development") {
        const user = devSession.user;
        if (user) {
          email = user.email;

          const isAdmin =
            typeof email === "string" &&
            typeof process.env.NEXT_PUBLIC_ADMIN_EMAILS === "string"
              ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").includes(email)
              : false;

          session = {
            user: {
              ...user,
              isAdmin
            }
          };
        }
      } else {
        if (typeof cookies === "string" && cookies.includes(TOKEN_NAME)) {
          const cookie = parse(cookies);
          authToken = getAuthToken(cookie);

          if (authToken) {
            const user = await unseal(
              authToken,
              process.env.SECRET,
              sealOptions
            );

            if (user) {
              const isAdmin =
                typeof process.env.NEXT_PUBLIC_ADMIN_EMAILS === "string"
                  ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").includes(
                      user.email
                    )
                  : false;

              session = {
                user: {
                  ...user,
                  isAdmin
                }
              };

              email = user.email;
            }
          }
        }
      }

      if (typeof email === "string") {
        globalEmail = email;
        store.dispatch(setUserEmail(email));
      }

      if (session) {
        store.dispatch(setSession({ ...session, [TOKEN_NAME]: authToken }));
      }
      store.dispatch(setIsSessionLoading(false));
      //#endregion

      //#region page
      let pageProps: AppProps["pageProps"] = { isMobile };

      if (Component.getInitialProps)
        pageProps = {
          ...pageProps,
          ...(await Component.getInitialProps(ctx))
        };
      //#endregion

      return {
        cookies,
        session,
        pageProps
      };
    }
);

export default App;
