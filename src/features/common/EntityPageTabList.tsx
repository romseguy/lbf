import { TabList, TabListProps, useColorMode } from "@chakra-ui/react";
import React from "react";
import { scrollbarStyles } from "theme/theme";
import { css } from "twin.macro";

export const EntityPageTabList = ({
  children,
  ...props
}: TabListProps & {
  children: React.ReactElement | (React.ReactElement | null)[];
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <TabList
      as="nav"
      bg={isDark ? "gray.700" : "lightblue"}
      borderRadius="xl"
      css={css(scrollbarStyles)}
      display="block"
      overflowX="auto"
      p="8px 0 8px 12px"
      whiteSpace="nowrap"
      {...props}
    >
      {children}
    </TabList>
  );
};
