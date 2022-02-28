import { TabList, TabListProps, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { css } from "twin.macro";
import { scrollbarStyles } from "theme/theme";

export const EntityPageTabList = ({
  children,
  ...props
}: TabListProps & {
  children: React.ReactElement | (React.ReactElement | null)[];
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();

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
