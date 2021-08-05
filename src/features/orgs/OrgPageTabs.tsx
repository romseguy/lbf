//@ts-nocheck
import React, { useCallback } from "react";
import {
  Box,
  Button,
  chakra,
  Flex,
  Icon,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
  useStyles,
  useTab
} from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { useState } from "react";
import { FaHome } from "react-icons/fa";
import { CalendarIcon, ChatIcon } from "@chakra-ui/icons";

export const OrgPageTabs = ({
  children,
  ...props
}: {
  children: React.ReactNode | React.ReactNodeArray;
}) => {
  const StyledTab = chakra("button", { themeKey: "Tabs.Tab" });
  const inactiveTabBg = useColorModeValue("gray.100", "whiteAlpha.300");

  const CustomTab = React.forwardRef(
    (
      { icon, ...props }: { children: React.ReactNode | React.ReactNodeArray },
      ref
    ) => {
      const tabProps = useTab(props);
      tabProps.tabIndex = 0;
      // tabProps.onClick = useCallback(tabProps.onFocus);
      // tabProps.onFocus = () => {};

      const styles = useStyles();

      return (
        <StyledTab
          display="flex"
          flex={isMobile ? "0 0 auto" : "1"}
          //flex="0 0 auto"
          alignItems="center"
          justifyContent="center"
          bg={inactiveTabBg}
          mx={1}
          _focus={{
            boxShadow: "none"
          }}
          {...tabProps}
          __css={styles.tab}
        >
          {/* <Box as="span" mr="2">
            {isSelected ? "😎" : "😶‍🌫️"}
          </Box> */}
          <span
            style={{
              display: "inline-flex",
              flexShrink: "0",
              marginInlineEnd: "0.5rem"
            }}
          >
            <Icon as={icon} boxSize={5} verticalAlign="middle" />
          </span>
          {tabProps.children}
        </StyledTab>
      );
    }
  );

  return (
    <Tabs
      defaultIndex={0}
      isFitted
      variant="solid-rounded"
      borderWidth={1}
      borderColor="gray.200"
      borderRadius="lg"
      isManual
      isLazy
      lazyBehavior="keepMounted"
    >
      <TabList
        as="nav"
        display="flex"
        flexWrap="nowrap"
        alignItems="center"
        height="60px"
        overflowX="auto"
        //borderBottom="0"
        mx={3}
        css={{
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "-ms-autohiding-scrollbar"
        }}
      >
        {[
          // { name: "Accueil", icon: <FaHome boxSize={6} /> },
          { name: "Accueil", icon: FaHome },
          { name: "Événements", icon: CalendarIcon },
          { name: "Discussions", icon: ChatIcon }
        ].map(({ name, icon }, id) => (
          <CustomTab key={`orgTab-${id}`} icon={icon}>
            {name}
          </CustomTab>
        ))}
      </TabList>
      {children}
    </Tabs>
  );
};
