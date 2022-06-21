import { CalendarIcon, ChatIcon } from "@chakra-ui/icons";
import { Button, Flex, useColorMode } from "@chakra-ui/react";
import { Link, LinkProps } from "features/common";
import { useRouter } from "next/router";
import React from "react";
import { FaHome } from "react-icons/fa";
import { css } from "twin.macro";

export const NavButtonsList = ({
  direction = "row",
  isMobile,
  onClose
}: {
  direction?: "row" | "column";
  isMobile: boolean;
  onClose?: () => void;
}) => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const linkProps: Partial<LinkProps> = {
    "aria-hidden": true,
    alignSelf: "flex-start",
    variant: "no-underline"
  };
  const CSSObject = {
    colorScheme: isDark ? "gray" : "cyan",
    my: isMobile ? 2 : undefined
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
          {...CSSObject}
        >
          Accueil
        </Button>
      </Link>

      <Link
        {...linkProps}
        onClick={() => {
          router.push("/evenements", "/evenements", { shallow: true });
          onClose && onClose();
        }}
      >
        <Button
          leftIcon={<CalendarIcon />}
          isActive={router.asPath === "/evenements"}
          {...CSSObject}
        >
          Événements
        </Button>
      </Link>

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
          {...CSSObject}
        >
          Forum
        </Button>
      </Link>
    </Flex>
  );
};
