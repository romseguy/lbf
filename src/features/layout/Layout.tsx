import {
  Box,
  Flex,
  BoxProps,
  useColorMode,
  Tooltip,
  useToast
} from "@chakra-ui/react";
import Head from "next/head";
import NextNprogress from "nextjs-progressbar";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { css } from "twin.macro";
import { DarkModeSwitch, IconFooter, OfflineIcon } from "features/common";
import { Header, Nav, Footer } from "features/layout";
import { ContactFormModal } from "features/modals/ContactFormModal";
import { LoginFormModal } from "features/modals/LoginFormModal";
import { IEvent } from "models/Event";
import { IOrg, OrgTypes } from "models/Org";
import { PageProps } from "main";
import { useAppDispatch } from "store";
import { selectIsOffline } from "store/sessionSlice";
import { resetUserEmail, selectUserEmail } from "store/userSlice";
import { breakpoints } from "features/layout/theme";
import { Base64Image } from "utils/image";
import { isServer } from "utils/isServer";
import { IEntity, isEvent, isOrg, isUser } from "models/Entity";

const PAYPAL_BUTTON_WIDTH = 108;
const defaultTitle = process.env.NEXT_PUBLIC_SHORT_URL;
let isNotified = false;

interface customWindow extends Window {
  console: { [key: string]: (...args: any[]) => void };
}

declare const window: customWindow;

export interface LayoutProps extends Partial<PageProps>, BoxProps {
  children: React.ReactNode | React.ReactNodeArray;
  banner?: Base64Image & { mode: "dark" | "light" };
  logo?: Base64Image;
  isLogin?: number;
  entity?: IEntity;
  pageHeader?: React.ReactNode | React.ReactNodeArray;
  pageSubTitle?: React.ReactNode;
  pageTitle?: string;
}

export const Layout = ({
  banner,
  children,
  entity,
  isLogin = 0,
  logo,
  pageHeader,
  pageSubTitle,
  pageTitle,
  setSession,
  ...props
}: LayoutProps) => {
  const { isMobile } = props;
  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const toast = useToast({ position: "top" });
  const isOffline = useSelector(selectIsOffline);
  const userEmail = useSelector(selectUserEmail);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(
    router.asPath === "/?login" && !props.session
  );

  useEffect(() => {
    if (isLogin !== 0) {
      window.localStorage.setItem("path", router.asPath);
      setIsLoginModalOpen(true);
    }
  }, [isLogin]);

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
  }, []);

  const isE = isEvent(entity);
  const isO = isOrg(entity);
  const isU = isUser(entity);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          {defaultTitle} –{" "}
          {isO
            ? `${OrgTypes[entity.orgType]} – ${entity.orgName}`
            : isE
            ? `Événement – ${entity.eventName}`
            : isU
            ? `${entity.userName}`
            : pageTitle}
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

        <Box position="fixed" right={4} bottom={1}>
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
          email={userEmail}
          setIsLoginModalOpen={setIsLoginModalOpen}
          m={isMobile ? 1 : 3}
        />

        {router.pathname !== "/" && (
          <Header
            entity={entity}
            defaultTitle="Veuillez patienter..."
            pageTitle={pageTitle}
            pageSubTitle={pageSubTitle}
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

        {isMobile && (
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
            {/* <Tooltip
              hasArrow
              label="Pour nous remercier d'avoir créé ce logiciel libre ♥"
              placement="top-end"
            >
              <Box>
                <PaypalButton />
              </Box>
            </Tooltip> */}
          </Footer>
        )}
      </Flex>

      <ContactFormModal />

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
    </>
  );
};
