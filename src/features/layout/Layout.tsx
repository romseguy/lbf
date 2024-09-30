import {
  Box,
  BoxProps,
  Flex,
  FlexProps,
  useColorMode,
  VStack
} from "@chakra-ui/react";
import { AppHeading, ContactLink, DiskUsage, Link } from "features/common";
import { Nav } from "features/layout";
import theme, { breakpoints } from "features/layout/theme";
import { PageProps } from "main";
import { EEntityTab, IEntity, isEvent, isOrg, isUser } from "models/Entity";
import { OrgTypes } from "models/Org";
import { IUser } from "models/User";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { css } from "twin.macro";
import { ServerError } from "utils/errors";
import { Base64Image } from "utils/image";
import { capitalize, normalize } from "utils/string";

export interface LayoutProps extends PageProps, BoxProps {
  banner?: Base64Image & { mode: "dark" | "light" };
  entity?: IEntity | IUser;
  logo?: Base64Image;
  mainContainer?: boolean;
  noHeader?: boolean;
  pageHeader?: React.ReactNode;
  pageTitle?: string;
  tab?: string;
  tabItem?: string;
}

export const Layout = ({
  banner,
  children,
  entity,
  isMobile,
  logo,
  mainContainer = false,
  noHeader,
  pageHeader,
  pageTitle,
  tab,
  tabItem,
  ...props
}: React.PropsWithChildren<LayoutProps>) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();

  let subtitle = "";
  const isE = isEvent(entity);
  const isO = isOrg(entity);
  if (isO) {
    if (tab === EEntityTab.TOPICS) {
      if (tabItem && ["ajouter", "a"].includes(tabItem)) {
        subtitle = `– Ajouter une discussion`;
      } else {
        const { topicName } =
          entity.orgTopics.find(
            ({ topicName }) => tabItem === normalize(topicName)
          ) || {};
        if (topicName) {
          subtitle = `– ${topicName}`;
        }
      }
    }
  }
  const isU = isUser(entity);
  const title = `${
    isO
      ? `${OrgTypes[entity.orgType]} – ${entity.orgName}${subtitle}`
      : isE
      ? `Événement – ${entity.eventName}`
      : isU
      ? `Utilisateur – ${entity.userName}`
      : pageTitle
      ? capitalize(pageTitle)
      : "Merci de patienter..."
  } – ${process.env.NEXT_PUBLIC_SHORT_URL}`;

  const main = (node: ReactNode) =>
    mainContainer ? (
      <Box
        as="main"
        //bg={isDark ? "gray.700" : "lightblue"}
        bg={isDark ? "gray.700" : "blackAlpha.100"}
        borderRadius="lg"
        //flex="1 0 auto"
        m={isMobile ? 0 : 3}
        mt={0}
        p={isMobile ? 3 : 5}
        pt={isMobile ? 4 : 5}
      >
        {node}
      </Box>
    ) : (
      node
    );

  const page = (node: ReactNode) => (
    <Box
      css={css`
        ${isMobile && !!entity
          ? `
          margin: 0px 3px 30px 3px;
          max-height: calc(100% - 80px);
          overflow-y: scroll;
          `
          : `
          min-height: 100%;
          `}

        @media (min-width: ${breakpoints["2xl"]}) {
          background-color: ${isDark
            ? theme.colors.blackAlpha["900"]
            : "rgba(255,255,255,0.97)"};
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
        entity={entity}
        isMobile={isMobile}
        pageTitle={pageTitle}
        //borderTopRadius={isMobile ? 0 : undefined}
        p={3}
      />

      {/* Main */}
      {main(node)}

      {/* Footer */}
      {!isMobile && (
        <VStack as="footer" spacing={0} fontSize="smaller" pb={3}>
          <DiskUsage />
          <Link href="/contact" variant="underline">
            Besoin de plus d'espace de stockage ?
          </Link>
        </VStack>
      )}
    </Box>
  );

  const Fallback = ({
    error,
    resetErrorBoundary,
    ...props
  }: FallbackProps & { error: ServerError }) => {
    return page(
      <>
        Une erreur est survenue, <ContactLink label="merci de nous contacter" />{" "}
        avec une description du scénario.
      </>
    );
  };

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

      <ErrorBoundary fallbackRender={Fallback}>{page(children)}</ErrorBoundary>
    </>
  );
};

export const SimpleLayout = ({
  title,
  children,
  isMobile,
  ...props
}: React.PropsWithChildren<PageProps & FlexProps & { title: string }>) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
      </Head>

      <Flex
        as="main"
        css={css`
          background-color: ${isDark ? "#2D3748" : "lightblue"};
          flex-direction: column;
          @media (min-width: ${breakpoints["2xl"]}) {
            background-color: ${isDark
              ? theme.colors.blackAlpha["900"]
              : "rgba(255,255,255,0.97)"};
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
        {...props}
      >
        <AppHeading m="0 auto" mt={5}>
          {title}
        </AppHeading>

        <Box m="0 auto" my="5">
          {children}
        </Box>
      </Flex>
    </>
  );
};
