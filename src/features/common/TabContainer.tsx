import { Flex, FlexProps, Heading, useColorMode } from "@chakra-ui/react";
import React from "react";

export const TabContainer = ({
  children
}: {
  children: React.ReactNode | React.ReactNodeArray;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Flex flexDirection="column" borderTopRadius="lg" mb={5}>
      {children}
    </Flex>
  );
};

export const TabContainerHeader = ({
  children,
  heading
}: {
  children?: React.ReactNode | React.ReactNodeArray;
  heading: string;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Flex bg={isDark ? "gray.700" : "orange.300"} borderTopRadius="lg">
      <Heading size="sm" pl={3} py={3}>
        {heading}
      </Heading>

      {children}
    </Flex>
  );
};

export const TabContainerContent = ({
  children,
  ...props
}: FlexProps & {
  children: React.ReactNode | React.ReactNodeArray;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Flex
      flexDirection="column"
      bg={isDark ? "gray.600" : "orange.100"}
      {...props}
    >
      {children}
    </Flex>
  );
};
