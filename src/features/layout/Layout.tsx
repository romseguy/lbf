import {
  Box,
  BoxProps,
  Flex,
  Image,
  Text,
  Tooltip,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { css } from "twin.macro";
import {
  Column,
  DarkModeSwitch,
  IconFooter,
  Link,
  OfflineIcon
} from "features/common";
import { Header, Nav, Footer } from "features/layout";
import theme, { breakpoints } from "features/layout/theme";
import { ContactFormModal } from "features/modals/ContactFormModal";
import { PageProps } from "main";
import { IEntity, isEvent, isOrg, isUser } from "models/Entity";
import { OrgTypes } from "models/Org";
import { selectIsOffline } from "store/sessionSlice";
import { selectUserEmail } from "store/userSlice";
import { Base64Image } from "utils/image";
import { isServer } from "utils/isServer";
import { capitalize } from "utils/string";
import { ChevronUpIcon } from "@chakra-ui/icons";

const PAYPAL_BUTTON_WIDTH = 108;
let isNotified = false;

interface customWindow extends Window {
  console: { [key: string]: (...args: any[]) => void };
}

declare const window: customWindow;

export interface LayoutProps extends Partial<PageProps>, BoxProps {
  children: React.ReactNode | React.ReactNodeArray;
  banner?: Base64Image & { mode: "dark" | "light" };
  logo?: Base64Image;
  entity?: IEntity;
  pageHeader?: React.ReactNode;
  pageTitle?: string;
}

export const Layout = ({
  banner,
  children,
  entity,
  logo,
  pageHeader,
  pageTitle,
  ...props
}: LayoutProps) => {
  const { isMobile } = props;
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const toast = useToast({ position: "top" });
  const isOffline = useSelector(selectIsOffline);
  const [showButton, setShowButton] = useState(false);

  const notify = (title: string) => {
    if (!isNotified) {
      isNotified = true;
      toast({
        status: "error",
        title
      });
    }
  };

  useEffect(() => {
    ["error"].forEach(intercept);

    function intercept(method: string) {
      const original = window.console[method];
      window.console[method] = function (...args: any[]) {
        if (
          typeof args[0] === "string" &&
          args[0].includes("quota") &&
          args[0].includes("maps")
        )
          notify(
            "Vous avez dépassé le quota de chargement de cartes, veuillez réessayer plus tard."
          );
        original.apply
          ? original.apply(window.console, args)
          : original(Array.prototype.slice.apply(args).join(" "));
      };
    }

    function handleScrollButtonVisibility() {
      setShowButton(window.scrollY > 200);
    }

    window.addEventListener("scroll", handleScrollButtonVisibility);
    return () => {
      window.removeEventListener("scroll", handleScrollButtonVisibility);
    };
  }, []);

  const isE = isEvent(entity);
  const isO = isOrg(entity);
  const isU = isUser(entity);
  const title = isO
    ? ` ${OrgTypes[entity.orgType]} – ${entity.orgName}`
    : isE
    ? ` Événement – ${entity.eventName}`
    : isU
    ? ` ${entity.userName}`
    : pageTitle
    ? ` ${capitalize(pageTitle)}`
    : "Merci de patienter...";

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          {process.env.NEXT_PUBLIC_SHORT_URL} – {title}
        </title>
      </Head>

      <Flex
        css={css`
          flex-direction: column;
          flex-grow: 1;

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
        {/*Right Floating Header*/}
        {isOffline && (
          <Box
            position="fixed"
            right={3}
            top={3}
            bg={isDark ? "whiteAlpha.400" : "blackAlpha.300"}
            borderRadius="lg"
          >
            <OfflineIcon />
          </Box>
        )}

        <Nav
          {...props}
          title={title}
          borderTopRadius={isMobile ? 0 : undefined}
          m={isMobile ? 1 : 3}
          mt={isMobile ? 0 : undefined}
        />

        {router.pathname !== "/" && (
          <Header
            entity={entity}
            defaultTitle="Merci de patienter..."
            pageHeader={pageHeader}
            pageTitle={pageTitle}
            m={isMobile ? 1 : 3}
            mt={0}
          />
        )}

        <Box
          as="main"
          bg={isDark ? "gray.700" : "lightblue"}
          borderRadius="lg"
          flex="1 0 auto"
          m={isMobile ? 1 : 3}
          mt={0}
          p={isMobile ? 3 : 5}
        >
          {children}
        </Box>

        {/*Footer*/}
        <Column
          bg="transparent"
          border={0}
          borderBottomRadius={0}
          fontSize="smaller"
          p={0}
          pb={3}
          m="0 auto"
        >
          <Image
            src="/images/bg.png"
            height="100px"
            alignSelf="flex-start"
            mt={1}
            ml={1}
          />
          <Flex>
            <Link href="/a_propos" variant="underline">
              À propos
            </Link>
            <Text mx={1}>|</Text>
            <Link href="/contact" variant="underline">
              Contact
            </Link>
            <Text mx={1}>|</Text>
            <Link href="/privacy" variant="underline">
              CGU
            </Link>
          </Flex>
        </Column>

        {/*Right Floating Footer*/}
        <Box position="fixed" right={4} bottom={1}>
          <Flex flexDirection="column" alignItems="center">
            {showButton && (
              <ChevronUpIcon
                background={isDark ? "whiteAlpha.300" : "blackAlpha.400"}
                borderRadius={20}
                boxSize={10}
                cursor="pointer"
                mb={3}
                _hover={{
                  background: isDark ? "whiteAlpha.400" : "blackAlpha.500"
                }}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            <Tooltip
              placement="top-start"
              label={`Basculer vers le thème ${isDark ? "clair" : "sombre"}`}
              hasArrow
            >
              <Box>
                <DarkModeSwitch />
              </Box>
            </Tooltip>
          </Flex>
        </Box>

        {/*Left Floating Footer*/}
        {!isMobile && (
          <Box position="fixed" left={4} bottom={2}>
            <Flex alignItems="center">
              <IconFooter mr={2} />

              {/* <Tooltip
                hasArrow
                label="Pour nous remercier d'avoir créé ce logiciel libre ♥"
                placement="top-end"
              >
                <Box mt={1}>
                  <PaypalButton />
                </Box>
              </Tooltip> */}
            </Flex>
          </Box>
        )}

        {/* {isMobile && (
          <Footer display="flex" alignItems="center" pl={3} pb={1}>
            <IconFooter
              minWidth={
                isServer()
                  ? "34%"
                  : `${
                      (window.innerWidth - 28) / 2 - PAYPAL_BUTTON_WIDTH / 2
                    }px`
              }
            />
          </Footer>
        )} */}
      </Flex>

      <ContactFormModal />
    </>
  );
};

{
  /*
    {isLoginModalOpen && (
      <LoginFormModal
        onClose={() => {
          setIsLoginModalOpen(false);
          const path = localStorage.getItem("path") || "/";
          const protectedRoutes = [
            "/arbres/ajouter",
            "/evenements/ajouter",
            "/planetes/ajouter"
          ];
          if (protectedRoutes.includes(path))
            router.push("/", "/", { shallow: true });
          else router.push(path, path, { shallow: true });
        }}
        onSubmit={async () => {
          dispatch(resetUserEmail());
        }}
      />
    )}
  */
}

{
  /* 
    <Tooltip
      hasArrow
      label="Pour nous remercier d'avoir créé ce logiciel libre ♥"
      placement="top-end"
    >
      <Box>
        <PaypalButton />
      </Box>
    </Tooltip>
  */
}
