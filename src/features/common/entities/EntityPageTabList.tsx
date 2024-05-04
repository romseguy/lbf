import { TabList, TabListProps, useColorMode } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";

export const EntityPageTabList = ({ children, ...props }: TabListProps) => {
  const { colorMode } = useColorMode();

  return (
    <TabList as="nav" aria-hidden {...props}>
      {children}
    </TabList>
  );
};
