import { Button, Flex, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, {} from "react";
import { FaHome } from "react-icons/fa";
import { useSelector } from "react-redux";
import { css } from "twin.macro";
import { Link, LinkProps } from "features/common";
import { useSession } from "hooks/useSession";
import { useToast } from "hooks/useToast";
import { selectIsMobile } from "store/uiSlice";
import { unauthorizedEntityUrls } from "utils/url";

export const NavButtonsList = ({
  direction = "row",
  onClose,
  ...props
}: {
  direction?: "row" | "column";
  isNetworksModalOpen?: boolean;
  onClose?: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const isEntityPage =
    Array.isArray(router.query.name) &&
    !unauthorizedEntityUrls.includes(router.query.name[0]);
  const { data: session } = useSession();
  const createdBy = session ? session.user.userId : undefined;
  const toast = useToast({ position: "top" });

  const buttonProps = {
    // bg: isDark ? "red.300" : "teal.500",
    // color: isDark ? "black" : "white",
    colorScheme: "red",
    borderRadius: "9999px",
    marginRight: "12px",
    my: isMobile ? 2 : undefined
    // _hover: {
    //   bg: isDark ? "blue.400" : "blue.400",
    //   color: isDark ? "white" : undefined
    // }
  };
  const linkProps: Partial<LinkProps> = {
    "aria-hidden": true,
    alignSelf: "flex-start"
  };

  return (
    <Flex
      flexDirection={direction}
      flexWrap="wrap"
      mt={-3}
      css={css`
        button[data-active] {
          color: white;
        }
      `}
    >
      {isMobile && (
        <>
          <Link
            {...linkProps}
            onClick={() => {
              router.push("/", "/", { shallow: true });
              onClose && onClose();
            }}
          >
            <Button
              leftIcon={<FaHome />}
              isActive={router.asPath === "/"}
              {...buttonProps}
            >
              Accueil
            </Button>
          </Link>
        </>
      )}

      {/* Événements */}
      {/* {(isMobile || !isEntityPage) && (
        <Link
          {...linkProps}
          onClick={() => {
            router.push("/agenda", "/agenda", { shallow: true });
            onClose && onClose();
          }}
        >
          <Button
            leftIcon={<CalendarIcon />}
            isActive={router.asPath === "/agenda"}
            {...buttonProps}
          >
            Événements
          </Button>
        </Link>
      )} */}
    </Flex>
  );
};

{
  /*
    {(isMobile || !isEntityPage) && (
      <Link
        {...linkProps}
        onClick={() => {
          router.push("/forum", "/forum", { shallow: true });
          onClose && onClose();
        }}
      >
        <Button
          leftIcon={<ChatIcon />}
          isActive={router.asPath === "/forum"}
          {...buttonProps}
        >
          Forum
        </Button>
      </Link>
    )}
  */
}
