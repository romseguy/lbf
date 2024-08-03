import { Box, BoxProps, useColorMode } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

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
