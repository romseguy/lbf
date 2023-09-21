import { TabList, TabListProps, useColorMode } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { scrollbarCss } from "features/layout/theme";
import { selectIsMobile } from "store/uiSlice";

export const EntityPageTabList = ({ children, ...props }: TabListProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);

  return (
    <TabList
      as="nav"
      aria-hidden
      bgColor={isDark ? "gray.700" : "lightblue"}
      borderRadius="xl"
      {...(isMobile
        ? {}
        : {
            css: scrollbarCss,
            overflowX: "auto",
            p: 3
          })}
      {...props}
    >
      {children}
    </TabList>
  );
};
