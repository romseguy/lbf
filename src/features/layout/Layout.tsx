import { Flex, BoxProps, useColorMode, Box, Tooltip } from "@chakra-ui/react";
import Head from "next/head";
import { Session } from "next-auth";
import NextNprogress from "nextjs-progressbar";
import React from "react";
import { css } from "twin.macro";
import { DarkModeSwitch, IconFooter, OfflineIcon } from "features/common";
import { PaypalButton } from "features/common/forms/PaypalButton";
import { Header, Main, Nav, Footer } from "features/layout";
import { ContactModal } from "features/modals/ContactModal";
import { useSession } from "hooks/useAuth";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { PageProps } from "pages/_app";
import { breakpoints } from "theme/theme";
import { Base64Image } from "utils/image";

const defaultTitle = process.env.NEXT_PUBLIC_TITLE;

export interface LayoutProps {
  logo?: Base64Image;
  banner?: Base64Image & { mode: "dark" | "light" };
  children: React.ReactNode | React.ReactNodeArray;
  isLogin?: number;
  isMobile: boolean;
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
  org,
  event,
  ...props
}: BoxProps & LayoutProps & PageProps) => {
  const { isMobile } = props;
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { data: clientSession } = useSession();
  const session = props.session || clientSession;

  // const [hasVerticalScrollbar, setHasVerticalScrollbar] = useState(false);
  // useEffect(() => {
  //   const handleResize = () => {
  //     let scrollHeight = Math.max(
  //       document.body.scrollHeight,
  //       document.documentElement.scrollHeight,
  //       document.body.offsetHeight,
  //       document.documentElement.offsetHeight,
  //       document.body.clientHeight,
  //       document.documentElement.clientHeight
  //     );

  //     if (scrollHeight >= window.innerHeight) {
  //       setHasVerticalScrollbar(true);
  //     }
  //   };
  //   window.addEventListener("resize", handleResize);
  //   handleResize();
  // }, []);

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

        <Box position="fixed" right={4} bottom={2}>
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

        {!isMobile && (
          <Box position="fixed" left={4} bottom={2}>
            <Flex alignItems="center">
              <Tooltip
                hasArrow
                label="Un moyen simple de remercier le créateur de ce logiciel libre ♥"
                placement="top-end"
              >
                <Box mt={1}>
                  <PaypalButton />
                </Box>
              </Tooltip>

              <Box ml={2}>
                <IconFooter noContainer />
              </Box>
            </Flex>
          </Box>
        )}

        {
          /*process.env.NODE_ENV === "production"*/ true && (
            <Box
              position="fixed"
              right={3}
              top={3}
              bg={isDark ? "whiteAlpha.400" : "blackAlpha.300"}
              borderRadius="lg"
            >
              <OfflineIcon />
            </Box>
          )
        }

        <Header
          defaultTitle={defaultTitle}
          org={org}
          event={event}
          pageTitle={pageTitle}
          pageSubTitle={pageSubTitle}
        />

        <Nav {...props} isLogin={isLogin} session={session} />

        <Main {...props} session={session}>
          {children}
        </Main>

        <Footer display="flex" alignItems="center" pl={5} pr={5} pb={8}>
          {isMobile && (
            <Flex alignItems="center">
              <Tooltip
                hasArrow
                label="Un moyen simple de remercier le créateur de ce logiciel libre ♥"
                placement="top-end"
              >
                <Box>
                  <PaypalButton />
                </Box>
              </Tooltip>

              <IconFooter ml={3} />
            </Flex>
          )}
        </Footer>
      </Flex>

      <ContactModal />
    </>
  );
};
