import { Box, BoxProps, useColorMode } from "@chakra-ui/react";
import tw, { css } from "twin.macro";

export const Footer = ({
  children,
  ...props
}: BoxProps & { children: React.ReactNode }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const styles = css`
    ${isDark ? tw`bg-gray-800` : tw`bg-white`}
  `;

  return (
    <Box as="footer" css={styles} {...props}>
      {children}
    </Box>
  );
};
