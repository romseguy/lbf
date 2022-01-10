import { Box, BoxProps, useColorMode } from "@chakra-ui/react";
import tw, { css } from "twin.macro";

export const Footer = ({
  children,
  ...props
}: BoxProps & { children: React.ReactNode }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Box as="footer" bg="transparent" {...props}>
      {children}
    </Box>
  );
};
