import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Tooltip,
  useColorMode,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { ChevronUpIcon, HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
//import { css } from "twin.macro";
import { DarkModeSwitch, IconFooter, OfflineIcon } from "features/common";
import { ContactFormModal } from "features/modals/ContactFormModal";
import { selectIsOffline } from "store/sessionSlice";
import { NavButtonsList } from "features/layout/NavButtonsList";
import { PaypalButton } from "features/common/forms/PaypalButton";

interface customWindow extends Window {
  console: { [key: string]: (...args: any[]) => void };
}

declare const window: customWindow;

export interface PageProps {
  isMobile: boolean;
}

let isNotified = false;

export const Main = ({
  Component,
  ...props
}: PageProps & { Component: NextPage<PageProps> }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const toast = useToast({ position: "top" });

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose
  } = useDisclosure();

  const isOffline = useSelector(selectIsOffline);
  const [isNetworksModalOpen, setIsNetworksModalOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    function handleScrollButtonVisibility() {
      setShowButton(window.scrollY > 200);
    }

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

    function notify(title: string) {
      if (!isNotified) {
        isNotified = true;
        toast({
          status: "error",
          title
        });
      }
    }

    ["error"].forEach(intercept);
    window.addEventListener("scroll", handleScrollButtonVisibility);
    return () => {
      window.removeEventListener("scroll", handleScrollButtonVisibility);
    };
  }, []);

  return (
    <>
      {/* Right Top */}
      {isOffline && (
        <Box
          position="fixed"
          right={3}
          top={props.isMobile ? 14 : 3}
          bg={isDark ? "whiteAlpha.400" : "blackAlpha.300"}
          borderRadius="lg"
        >
          <OfflineIcon />
        </Box>
      )}

      {/* Right Top */}
      {props.isMobile && (
        <Box
          position="fixed"
          right={3}
          top={3}
          // css={css`
          //   transform: translate(0, 0);
          //   transform: translate3d(0, 0, 0);
          //   z-index: 9999;
          // `}
        >
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
              <DrawerHeader d="flex" justifyContent="space-evenly">
                <IconButton
                  aria-label="Rechercher"
                  icon={<SearchIcon />}
                  onClick={() => setIsNetworksModalOpen(true)}
                  //{...buttonProps}
                />
                <DarkModeSwitch mr={3} />
              </DrawerHeader>
              <DrawerBody>
                <NavButtonsList
                  direction="column"
                  isNetworksModalOpen={isNetworksModalOpen}
                  onClose={() => {
                    setIsNetworksModalOpen(false);
                    onDrawerClose();
                  }}
                />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Box>
      )}

      {/* Right Bottom */}
      <Box
        position="fixed"
        right={props.isMobile ? "12px" : "93px"}
        bottom={props.isMobile ? "62px" : 1}
      >
        <Flex flexDirection="column" alignItems="center">
          {showButton && (
            <ChevronUpIcon
              background={isDark ? "white" : "black"}
              borderRadius={20}
              boxSize={10}
              color={isDark ? "black" : "white"}
              cursor="pointer"
              mb={3}
              _hover={{
                background: isDark ? "whiteAlpha.800" : "blackAlpha.500"
              }}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
        </Flex>
      </Box>

      {/* GlobalModals */}
      <ContactFormModal />

      <Component {...props} />
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
