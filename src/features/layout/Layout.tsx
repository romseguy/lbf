import {
  Flex,
  BoxProps,
  useColorMode,
  Box,
  Icon,
  Tooltip
} from "@chakra-ui/react";
import Head from "next/head";
import { Session } from "next-auth";
import NextNprogress from "nextjs-progressbar";
import React, { useEffect, useState } from "react";
import { Offline } from "react-detect-offline";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { css } from "twin.macro";
import { DarkModeSwitch } from "features/common";
import { PaypalButton } from "features/common/forms/PaypalButton";
import { Header, Main, Nav, Footer } from "features/layout";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { breakpoints } from "theme/theme";
import type { Base64Image } from "utils/image";
import { isMobile } from "react-device-detect";

const defaultTitle = process.env.NEXT_PUBLIC_TITLE;

export interface LayoutProps {
  logo?: Base64Image;
  banner?: Base64Image & { mode: "dark" | "light" };
  children: React.ReactNode | React.ReactNodeArray;
  isLogin?: number;
  pageHeader?: React.ReactNode | React.ReactNodeArray;
  org?: IOrg;
  event?: IEvent;
  pageTitle?: string;
  pageSubTitle?: React.ReactNode;
  session?: Session | null;
}

export const Layout = ({
  logo,
  banner,
  children,
  isLogin,
  pageHeader,
  pageTitle,
  pageSubTitle,
  session,
  org,
  event,
  ...props
}: BoxProps & LayoutProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const [hasVerticalScrollbar, setHasVerticalScrollbar] = useState(false);
  const handleResize = () => {
    let scrollHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );

    if (scrollHeight >= window.innerHeight) {
      setHasVerticalScrollbar(true);
    }
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          {org || event || pageTitle
            ? `${defaultTitle} – ${
                org ? org.orgName : event ? event.eventName : pageTitle
              }`
            : defaultTitle}
        </title>
      </Head>

      <Flex
        css={css`
          flex-direction: column;
          flex-grow: 1;

          @media (min-width: ${breakpoints["2xl"]}) {
            margin: 0 auto;
            width: 1180px;
            ${isDark
              ? `
            border-left: 12px solid transparent;
            border-right: 12px solid transparent;
            border-image: linear-gradient(to bottom right, #b827fc 0%, #2c90fc 25%, #b8fd33 50%, #fec837 75%, #fd1892 100%);
            border-image-slice: 1;
            `
              : `
            border-left: 12px solid transparent;
            border-right: 12px solid transparent;
            border-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E %3ClinearGradient id='g' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23cffffe' /%3E%3Cstop offset='25%25' stop-color='%23f9f7d9' /%3E%3Cstop offset='50%25' stop-color='%23fce2ce' /%3E%3Cstop offset='100%25' stop-color='%23ffc1f3' /%3E%3C/linearGradient%3E %3Cpath d='M1.5 1.5 l97 0l0 97l-97 0 l0 -97' stroke-linecap='square' stroke='url(%23g)' stroke-width='3'/%3E %3C/svg%3E") 1;
            `};
          }
        `}
      >
        <NextNprogress
          color="#29D"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow={true}
        />

        {!isMobile && (
          <Box position="fixed" right={3} bottom={2}>
            <Tooltip
              placement="top-start"
              label={`Basculer vers le thème ${isDark ? "clair" : "sombre"}`}
              hasArrow
            >
              <Box>
                <DarkModeSwitch />
              </Box>
            </Tooltip>
          </Box>
        )}

        {!isMobile && /*true ||*/ process.env.NODE_ENV === "production" && (
          <Box position="fixed" left={3} bottom={3}>
            <Flex alignItems="center">
              <Tooltip
                hasArrow
                label="Un moyen simple de remercier le développeur de ce logiciel libre ♥"
                placement="top-end"
              >
                <Box>
                  <PaypalButton />
                </Box>
              </Tooltip>

              <Tooltip
                hasArrow
                label="Contacter le développeur  ͡❛ ͜ʖ ͡❛"
                placement="top-end"
              >
                <Box>
                  <a href="https://twitter.com/romseguy" target="_blank">
                    <Icon as={FaTwitter} boxSize={6} color="cyan.600" ml={3} />
                  </a>
                </Box>
              </Tooltip>
            </Flex>
          </Box>
        )}

        {process.env.NODE_ENV === "production" && (
          <Offline
            polling={{
              enabled: true,
              interval: 10000,
              timeout: 5000,
              url: `${process.env.NEXT_PUBLIC_API}/check`
            }}
          >
            <Box
              position="fixed"
              right={3}
              top={3}
              bg={isDark ? "whiteAlpha.400" : "blackAlpha.300"}
              borderRadius="lg"
            >
              <Tooltip
                label="Vérifiez votre connexion à internet pour continuer à utiliser l'application dans de bonnes conditions."
                placement="top-start"
                hasArrow
              >
                <Icon viewBox="0 0 256 256" boxSize={8}>
                  <line
                    x1="48"
                    x2="208"
                    y1="40"
                    y2="216"
                    fill="none"
                    stroke="red"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                  />
                  <path
                    fill="none"
                    stroke={isDark ? "#fff" : "#000"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="16"
                    d="M107.12984 57.47077a148.358 148.358 0 0 1 20.86235-1.46787 145.90176 145.90176 0 0 1 102.9284 42.17662M25.06379 98.17952A145.88673 145.88673 0 0 1 72.42537 66.8671M152.11967 106.95874a97.88568 97.88568 0 0 1 44.88614 25.1619M58.97857 132.12064a97.89874 97.89874 0 0 1 49.03639-26.105M92.91969 166.06177a50.81565 50.81565 0 0 1 67.576-2.317"
                  />
                  <circle
                    cx="128"
                    cy="200"
                    r="12"
                    fill={isDark ? "#fff" : "#000"}
                  />
                </Icon>
              </Tooltip>
            </Box>
          </Offline>
        )}

        <Header
          defaultTitle={defaultTitle}
          org={org}
          event={event}
          pageTitle={pageTitle}
          pageSubTitle={pageSubTitle}
        />

        <Nav
          minH="96px"
          isLogin={isLogin}
          session={session}
          // css={css`
          //   @media (min-width: 700px) {
          //     ${hasVerticalScrollbar && "padding: 28px 0;"}
          //   }
          // `}
        />

        <Main {...props}>{children}</Main>

        <Footer display="flex" alignItems="center" pl={5} pr={5} pb={3}>
          {isMobile && (true || process.env.NODE_ENV === "production") && (
            <Flex alignItems="center" flexGrow={1}>
              <Tooltip
                label="Un moyen simple de remercier le développeur de ce logiciel libre ♥"
                placement="top-end"
                hasArrow
              >
                <div>
                  <PaypalButton />
                </div>
              </Tooltip>

              <Tooltip
                label="Ce projet est open-source, financé par son seul créateur."
                placement="top-end"
                hasArrow
              >
                <a href="https://github.com/romseguy">
                  <Icon as={FaGithub} boxSize={6} ml={3} />
                </a>
              </Tooltip>
            </Flex>
          )}

          {isMobile && (
            <Flex alignItems="center">
              <Tooltip
                placement="top-start"
                label={`Basculer vers le thème ${isDark ? "clair" : "sombre"}`}
                hasArrow
              >
                <Box mt={3}>
                  <DarkModeSwitch />
                </Box>
              </Tooltip>
            </Flex>
          )}
        </Footer>
      </Flex>
    </>
  );
};
