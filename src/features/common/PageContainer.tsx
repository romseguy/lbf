import { Flex, FlexProps, useColorMode } from "@chakra-ui/react";

export const PageContainer = ({
  id,
  children,
  ...props
}: FlexProps & { id?: string }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Flex
      id={id}
      flexDirection="column"
      bg={isDark ? "gray.600" : "lightcyan"}
      borderWidth={1}
      borderColor={isDark ? "gray.600" : "gray.200"}
      borderRadius="lg"
      m="0 auto"
      maxWidth="4xl"
      p={3}
      {...props}
    >
      {children}
    </Flex>
  );
};
