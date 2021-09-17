import { useColorMode } from "@chakra-ui/color-mode";
import { Box, BoxProps } from "@chakra-ui/react";
import { breakpoints } from "theme/theme";
import tw, { css } from "twin.macro";

export const Main = ({ p = 5, ...props }: BoxProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const styles = css`
    ${isDark ? tw`bg-gray-800` : tw`bg-white`}
    @media (min-width: ${breakpoints["2xl"]}) {
    }
  `;

  return <Box as="main" flex="1 0 auto" p={p} css={styles} {...props} />;
};
