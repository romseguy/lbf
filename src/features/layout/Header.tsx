import type { Base64Image } from "utils/image";
import React from "react";
import { useColorMode } from "@chakra-ui/color-mode";
import { Flex } from "@chakra-ui/layout";
import tw, { css } from "twin.macro";
import { SpaceProps } from "@chakra-ui/system";
import { breakpoints } from "theme/theme";

type HeaderProps = SpaceProps & {
  headerBg?: Base64Image;
  children: React.ReactNode | React.ReactNodeArray;
};

export const Header = ({ headerBg, ...props }: HeaderProps) => {
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
    />
  );
};
