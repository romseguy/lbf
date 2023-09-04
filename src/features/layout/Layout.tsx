import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Box,
  BoxProps,
  Flex,
  Image,
  Tooltip,
  useColorMode,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { css } from "twin.macro";
import { DarkModeSwitch, IconFooter, Link, OfflineIcon } from "features/common";
import { Header, Nav } from "features/layout";
import theme, { breakpoints } from "features/layout/theme";
import { ContactFormModal } from "features/modals/ContactFormModal";
import { PageProps } from "main";
import { IEntity, isEvent, isOrg, isUser } from "models/Entity";
import { OrgTypes } from "models/Org";
import { selectIsOffline } from "store/sessionSlice";
import { Base64Image } from "utils/image";
import { capitalize } from "utils/string";
import { ChevronUpIcon } from "@chakra-ui/icons";
import { IUser } from "models/User";
import { Delimiter } from "features/common/Delimiter";
import { NavButtonsList } from "./NavButtonsList";

const PAYPAL_BUTTON_WIDTH = 108;
let isNotified = false;

interface customWindow extends Window {
  console: { [key: string]: (...args: any[]) => void };
}

declare const window: customWindow;

export interface LayoutProps extends PageProps, BoxProps {
  children: React.ReactNode | React.ReactNodeArray;
  banner?: Base64Image & { mode: "dark" | "light" };
  logo?: Base64Image;
  entity?: IEntity | IUser;
  pageHeader?: React.ReactNode;
  pageTitle?: string;
}

export const Layout = ({
  banner,
  children,
  entity,
  isMobile,
  logo,
  pageHeader,
  pageTitle,
  ...props
}: LayoutProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const toast = useToast({ position: "top" });
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose
  } = useDisclosure();
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
  const title = `${process.env.NEXT_PUBLIC_SHORT_URL} – ${
    isO
      ? `${OrgTypes[entity.orgType]} – ${entity.orgName}`
      : isE
      ? `Événement – ${entity.eventName}`
      : isU
      ? entity.userName
      : pageTitle
      ? capitalize(pageTitle)
      : "Merci de patienter..."
  }`;

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
      </Head>

      <Box
        css={css`
          /* ${!isMobile &&
          `
            display: flex;
            flex-direction: column;
            flex-grow: 1;
          `} */

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
          bg={isMobile ? "transparent" : isDark ? "gray.700" : "lightblue"}
          borderRadius="lg"
          flex="1 0 auto"
          m={isMobile ? 0 : 3}
          mt={0}
          p={isMobile ? 0 : 5}
        >
          {children}
        </Box>

        {/* Footer */}
        <Box as="footer" pb={3} mt={3}>
          <Image src="/images/bg.png" height="100px" m="0 auto" />
          <Box fontSize="smaller" textAlign="center">
            <Link href="/a_propos" variant="underline">
              À propos
            </Link>
            <Delimiter />
            <Link href="/contact" variant="underline">
              Contact
            </Link>
            <Delimiter />
            <Link href="/privacy" variant="underline">
              CGU
            </Link>
          </Box>
        </Box>

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
      </Box>

      {isMobile && (
        <Box position="fixed" right={3} top={3}>
          <IconButton
            aria-label="Ouvrir le menu"
            colorScheme="cyan"
            bg="lightcyan"
            icon={<HamburgerIcon />}
            border="1px solid black"
            onClick={onDrawerOpen}
          />
          <Drawer
            placement="left"
            isOpen={isDrawerOpen}
            onClose={onDrawerClose}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>{/* <Heading>{title}</Heading> */}</DrawerHeader>
              <DrawerBody>
                <NavButtonsList
                  direction="column"
                  onClose={() => {
                    if (isMobile) onDrawerClose();
                  }}
                />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Box>
      )}

      {/*Right Floating Header*/}
      {!isMobile && isOffline && (
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
      <Box position="fixed" left={4} bottom={2}>
        {isMobile ? (
          isOffline ? (
            <Box
              bg={isDark ? "whiteAlpha.400" : "blackAlpha.300"}
              borderRadius="lg"
            >
              <OfflineIcon />
            </Box>
          ) : null
        ) : (
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
        )}
      </Box>

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
