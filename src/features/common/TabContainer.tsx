import { Flex, FlexProps, Heading, useColorMode } from "@chakra-ui/react";
import React from "react";

export const TabContainer = ({
  children,
  mb = 5,
  ...props
}: FlexProps & {
  children: React.ReactNode | React.ReactNodeArray;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Flex flexDirection="column" borderTopRadius="lg" mb={mb} {...props}>
      {children}
    </Flex>
  );
};

export const TabContainerHeader = ({
  children,
  heading
}: {
  children?: React.ReactNode | React.ReactNodeArray;
  heading: string | React.ReactNode;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Flex bg={isDark ? "gray.700" : "lightblue"} borderTopRadius="lg">
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
      bg={isDark ? "gray.600" : "cyan.100"}
      {...props}
    >
      {children}
    </Flex>
  );
};
