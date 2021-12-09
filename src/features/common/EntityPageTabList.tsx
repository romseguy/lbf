import { TabList, TabListProps, useColorMode } from "@chakra-ui/react";
import React from "react";
import { scrollbarStyles } from "theme/theme";
import { css } from "twin.macro";

export const EntityPageTabList = ({
  children,
  ...props
}: TabListProps & {
  children: React.ReactElement | React.ReactElement[];
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <TabList
      as="nav"
      bg={isDark ? "gray.700" : "lightblue"}
      borderRadius="xl"
      p="12px 0 8px 12px"
      css={css`
        // https://stackoverflow.com/a/66926531
        ${scrollbarStyles}
        overflow-x: auto;
        display: block;
        white-space: nowrap;
      `}
      {...props}
    >
      {children}
    </TabList>
  );
};
