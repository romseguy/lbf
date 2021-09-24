//@ts-nocheck
import React, { useState } from "react";
import {
  chakra,
  Icon,
  TabList,
  Tabs,
  useColorModeValue,
  useStyles,
  useTab
} from "@chakra-ui/react";
import { isMobile } from "react-device-detect";
import { FaHome, FaTools } from "react-icons/fa";
import { CalendarIcon, ChatIcon, EmailIcon } from "@chakra-ui/icons";

export const EventPageTabs = ({
  children,
  ...props
}: {
  children: React.ReactNode | React.ReactNodeArray;
}) => {
  const StyledTab = chakra("button", { themeKey: "Tabs.Tab" });
  const inactiveTabBg = useColorModeValue("gray.100", "whiteAlpha.300");
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const defaultTabIndex = 0;

  const CustomTab = React.forwardRef(
    (
      {
        icon,
        tabIndex,
        ...props
      }: { children: React.ReactNode | React.ReactNodeArray },
      ref
    ) => {
      const tabProps = useTab(props);

      tabProps.tabIndex = 0;

      if (currentTabIndex === tabIndex) {
        tabProps["aria-selected"] = true;
      }

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
      defaultIndex={defaultTabIndex}
      index={currentTabIndex}
      onChange={(index) => setCurrentTabIndex(index)}
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
        aria-hidden
      >
        {[
          // { name: "Accueil", icon: <FaHome boxSize={6} /> },
          { name: "Accueil", icon: FaHome },
          { name: "Discussions", icon: ChatIcon },
          { name: "Invitations", icon: EmailIcon }
        ].map(({ name, icon }, tabIndex) => (
          <CustomTab
            key={`eventTab-${tabIndex}`}
            tabIndex={tabIndex}
            icon={icon}
            data-cy={`eventTab-${name}`}
          >
            {name}
          </CustomTab>
        ))}
      </TabList>
      {children}
    </Tabs>
  );
};
