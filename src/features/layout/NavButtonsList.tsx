import { CalendarIcon, ChatIcon } from "@chakra-ui/icons";
import { Button, Flex, useColorMode } from "@chakra-ui/react";
import { Link } from "features/common";
import { useRouter } from "next/router";
import React from "react";
import { FaHome } from "react-icons/fa";
import { IoIosGitNetwork, IoIosPeople } from "react-icons/io";
import { css } from "twin.macro";

export const NavButtonsList = ({
  direction = "row"
}: {
  direction?: "row" | "column";
}) => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const linkProps = { variant: "no-underline", shallow: true };
  const styleProps = { colorScheme: isDark ? "gray" : "cyan", mt: 3 };

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
      <Link href="/" {...linkProps}>
        <Button
          leftIcon={<FaHome />}
          isActive={router.asPath === "/"}
          {...styleProps}
        >
          Accueil
        </Button>
      </Link>

      <Link href="/evenements" {...linkProps}>
        <Button
          leftIcon={<CalendarIcon />}
          isActive={router.asPath === "/evenements"}
          data-cy="homeLink"
          {...styleProps}
        >
          Événements
        </Button>
      </Link>

      <Link href="/reseaux" {...linkProps}>
        <Button
          leftIcon={<IoIosGitNetwork />}
          isActive={router.asPath === "/reseaux"}
          {...styleProps}
        >
          Réseaux
        </Button>
      </Link>

      <Link href="/organisations" {...linkProps}>
        <Button
          leftIcon={<IoIosPeople />}
          isActive={router.asPath === "/organisations"}
          {...styleProps}
        >
          Organisations
        </Button>
      </Link>

      <Link href="/forum" {...linkProps}>
        <Button
          leftIcon={<ChatIcon />}
          isActive={router.asPath === "/forum"}
          {...styleProps}
        >
          Forum
        </Button>
      </Link>
    </Flex>
  );
};
