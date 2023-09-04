import { Flex, FlexProps, useColorMode } from "@chakra-ui/react";

export const Column = ({ children, ...props }: FlexProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Flex
      flexDirection="column"
      bg={isDark ? "gray.600" : "lightcyan"}
      borderWidth={1}
      borderColor={isDark ? "gray.600" : "gray.200"}
      borderRadius="lg"
      p={3}
      {...props}
    >
      {children}
    </Flex>
  );
};
