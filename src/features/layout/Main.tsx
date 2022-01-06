import { useColorMode } from "@chakra-ui/color-mode";
import { Box, BoxProps } from "@chakra-ui/react";
import { PageProps } from "pages/_app";
import { breakpoints } from "theme/theme";
import tw, { css } from "twin.macro";

export const Main = ({
  isMobile,
  p = 5,
  session,
  ...props
}: PageProps & BoxProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const styles = css`
    @media (min-width: ${breakpoints["2xl"]}) {
    }
  `;

  return (
    <Box
      as="main"
      bg={isDark ? "gray.700" : "lightblue"}
      borderRadius="lg"
      flex="1 0 auto"
      m={3}
      mt={0}
      p={p}
      css={styles}
      {...props}
    />
  );
};
