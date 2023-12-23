import { Box, BoxProps, useColorMode } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { css } from "twin.macro";
import { Link } from "features/common";
import { Header, Nav } from "features/layout";
import theme, { breakpoints } from "features/layout/theme";
import { PageProps } from "main";
import { EEntityTab, IEntity, isEvent, isOrg, isUser } from "models/Entity";
import { OrgTypes } from "models/Org";
import { ITopic } from "models/Topic";
import { Base64Image } from "utils/image";
import { capitalize, normalize } from "utils/string";
import { IUser } from "models/User";
import { Delimiter } from "features/common/Delimiter";

export interface LayoutProps extends PageProps, BoxProps {
  children: React.ReactNode | React.ReactNodeArray;
  banner?: Base64Image & { mode: "dark" | "light" };
  logo?: Base64Image;
  entity?: IEntity | IUser;
  tab?: string;
  tabItem?: string;
  pageHeader?: React.ReactNode;
  pageTitle?: string;
}

export const Layout = ({
  banner,
  children,
  entity,
  tab,
  tabItem,
  isMobile,
  logo,
  pageHeader,
  pageTitle,
  ...props
}: LayoutProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();

  const isE = isEvent(entity);
  const isO = isOrg(entity);
  const isU = isUser(entity);
  console.log("🚀 ~ file: Layout.tsx:48 ~ entity:", entity);
  const title = `${
    isO
      ? `${OrgTypes[entity.orgType]} – ${entity.orgName}${
          tabItem
            ? tab === EEntityTab.TOPICS
              ? " – " +
                entity.orgTopics.find(
                  ({ topicName }) => tabItem === normalize(topicName)
                )?.topicName
              : " – " + tabItem
            : ""
        }`
      : isE
      ? `${entity.eventName} – Événement`
      : isU
      ? `${entity.userName} – Utilisateur`
      : pageTitle
      ? capitalize(pageTitle)
      : "Merci de patienter..."
  } – L'arbre du Réseau LEO`;

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1"
        />
        <title>{title}</title>
      </Head>

      <Box
        css={css`
          min-height: 100%;

          ${isMobile && `margin: 3px 3px 0 3px;`}

          @media (min-width: ${breakpoints["2xl"]}) {
            background-color: ${isDark
              ? theme.colors.black
              : theme.colors.gray["50"]};
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
        <Nav
          {...props}
          isMobile={isMobile}
          title={title}
          borderTopRadius={isMobile ? 0 : undefined}
          mt={0}
          p={isMobile ? undefined : 3}
        />

        {/* Header */}
        {router.pathname !== "/" && (
          <Header
            entity={entity}
            defaultTitle="Merci de patienter..."
            pageHeader={pageHeader}
            pageTitle={pageTitle}
            m={isMobile ? 0 : 3}
            mb={isMobile ? 3 : undefined}
            mt={0}
          />
        )}

        {/* Main */}
        <Box
          as="main"
          bg={isDark ? "gray.700" : "lightblue"}
          borderRadius="lg"
          //flex="1 0 auto"
          m={isMobile ? 0 : 3}
          mt={0}
          p={isMobile ? 3 : 5}
          pt={isMobile ? 4 : 5}
        >
          {children}
        </Box>

        {/* Footer */}
        <Box as="footer" pb={3} mt={3}>
          {/* <Image src="/images/bg.png" height="100px" m="0 auto" /> */}
          <Box fontSize="smaller" textAlign="center">
            {/* <Link href="/a_propos" variant="underline">
              À propos
            </Link>
            <Delimiter /> */}
            <Link href="/contact" variant="underline">
              Contact
            </Link>
            <Delimiter />
            {/* <Link href="/privacy" variant="underline">
              CGU
            </Link>
            <Delimiter /> */}
            <Link href="https://github.com/romseguy" variant="underline">
              Github
            </Link>
          </Box>
        </Box>
      </Box>
    </>
  );
};
