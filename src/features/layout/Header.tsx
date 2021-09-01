import type { Base64Image } from "utils/image";
import React from "react";
import { useRouter } from "next/router";
import tw, { css } from "twin.macro";
import { Flex, Text, useColorMode } from "@chakra-ui/react";
import { SpaceProps } from "@chakra-ui/system";
import { breakpoints } from "theme/theme";
import { Link } from "features/common";

type HeaderProps = SpaceProps & {
  headerBg?: Base64Image;
  defaultTitle: string;
  defaultTitleColor: string;
  pageTitle?: string;
  pageSubTitle?: React.ReactNode;
};

export const Header = ({
  headerBg,
  defaultTitle,
  defaultTitleColor,
  pageTitle,
  pageSubTitle,
  ...props
}: HeaderProps) => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const styles = css`
    height: ${headerBg ? headerBg.height + "px" : "auto"};
    background-image: ${headerBg ? `url("${headerBg.base64}")` : ""};
    background-size: cover;
    background-repeat: no-repeat;
    ${isDark ? tw`bg-gray-800` : tw`bg-white`}
    @media (min-width: ${breakpoints["2xl"]}) {
    }
  `;

  return (
    <Flex
      as="header"
      alignItems="center"
      justifyContent="space-between"
      css={styles}
      {...props}
    >
      <Flex direction="column" ml={5}>
        <Link href="/" variant="no-underline">
          <Text
            fontFamily="Aladin"
            fontSize="x-large"
            fontStyle="italic"
            mt={5}
            color={defaultTitleColor}
          >
            {defaultTitle}
          </Text>
        </Link>

        <Link href={router.asPath} variant="no-underline">
          <Text
            as="h1"
            className="rainbow-text"
            fontSize={["3xl", "3xl", "6xl"]}
            py={3}
            pt={0}
          >
            {pageTitle}
          </Text>
        </Link>
        {pageSubTitle && <Text as="h3">{pageSubTitle}</Text>}
      </Flex>
    </Flex>
  );
};
