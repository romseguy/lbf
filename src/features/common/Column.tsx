import { Flex, FlexProps, useColorMode } from "@chakra-ui/react";
import React, { useState } from "react";
import { ReturnTypeRender } from "utils/types";

export interface ColumnProps extends FlexProps {
  isCollapsable?: boolean;
  children?: ReturnTypeRender | ((isCollapsed: boolean) => any);
}

export const Column = ({
  children,
  isCollapsable = false,
  ...props
}: ColumnProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <Flex
      flexDirection="column"
      bg={isDark ? "gray.600" : "lightcyan"}
      borderWidth={1}
      borderColor={isDark ? "gray.500" : "gray.200"}
      borderRadius="lg"
      p={3}
      {...(isCollapsable
        ? {
            cursor: "pointer",
            _hover: {
              backgroundColor: isDark ? "gray.500" : "blue.50"
            },
            onClick: () => setIsCollapsed(!isCollapsed)
          }
        : {})}
      {...props}
    >
      {typeof children === "function" ? children(isCollapsed) : children}
    </Flex>
  );
};
