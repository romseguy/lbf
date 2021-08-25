import NextNprogress from "nextjs-progressbar";
import type { Base64Image } from "utils/image";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { DarkModeSwitch, Link } from "features/common";
import { Header, Main, Nav } from "features/layout";
import { Flex, Spinner, Text, BoxProps, useColorMode } from "@chakra-ui/react";
import { css } from "twin.macro";
import { breakpoints } from "theme/theme";

const defaultTitle = "Au courant de...";

export const Layout = ({
  banner,
  children,
  isLogin,
  pageHeader,
  pageTitle,
  title,
  ...props
}: BoxProps & {
  banner?: Base64Image & { mode: "dark" | "light" };
  children: React.ReactNode | React.ReactNodeArray;
  isLogin?: number;
  pageHeader?: React.ReactNode | React.ReactNodeArray;
  pageTitle?: string;
  title?: string;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  let defaultTitleColor = isDark ? "white" : "black";

  if (banner) {
    defaultTitleColor = banner.mode === "light" ? "white" : "black";
  }

  const [hasVerticalScrollbar, setHasVerticalScrollbar] = useState(false);
  // console.log("hasVerticalScrollbar", hasVerticalScrollbar);
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
          {title
            ? `${defaultTitle} ${title}`
            : pageTitle
            ? `${defaultTitle} ${pageTitle}`
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
        <DarkModeSwitch position="absolute" right="0" top="0" m={3} />
        <Header
          defaultTitle={defaultTitle}
          defaultTitleColor={defaultTitleColor}
          pageTitle={pageTitle}
          headerBg={banner}
        />
        <Nav py={hasVerticalScrollbar ? 7 : 0} minH="96px" isLogin={isLogin} />
        <Main {...props}>{children}</Main>
        {/* <Box position="fixed" bottom="20px" right="20px">
        <IconButton
          aria-label="Aide"
          icon={<Icon as={FaQuestionCircle} h="48px" w="48px" />}
          bg="transparent"
          _hover={{ bg: "transparent" }}
          _focus={{ outline: "none" }}
          w="48px"
          h="48px"
          onClick={() => console.log("todo")}
        />
      </Box> */}
      </Flex>
    </>
  );
};
