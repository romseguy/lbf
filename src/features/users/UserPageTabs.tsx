import { Tabs, useColorMode } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaHome, FaImages, FaTools } from "react-icons/fa";
import { EntityPageTab, EntityPageTabList } from "features/common";
import { AppIcon } from "utils/types";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";

export const defaultTabs: UserPageTabsType = {
  Accueil: { icon: FaHome, url: "" },
  // Projets: { icon: FaTools, url: "/projets" },
  Galerie: { icon: FaImages, url: "/galerie" }
};

export type UserPageTabsType = {
  [key: string]: { icon: AppIcon; url: string };
};

export const UserPageTabs = ({
  children,
  height = "60px",
  tabs = defaultTabs,
  ...props
}: {
  children: React.ReactNode | React.ReactNodeArray;
  height?: string;
  tab?: string;
  tabs?: UserPageTabsType;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);

  let defaultTabIndex = 0;
  Object.keys(tabs).reduce((index, tab) => {
    if (tab.toLowerCase() === props.tab?.toLowerCase()) defaultTabIndex = index;
    return index + 1;
  }, 0);
  const [currentTabIndex, setCurrentTabIndex] = useState(defaultTabIndex || 0);

  if (Object.keys(tabs).length === 0 || Object.keys(tabs).length === 1)
    return <Tabs>{children}</Tabs>;

  return (
    <Tabs
      defaultIndex={defaultTabIndex}
      index={currentTabIndex}
      isFitted
      isLazy
      isManual
      lazyBehavior="keepMounted"
      variant="solid-rounded"
      background={isDark ? "black" : "lightcyan"}
      borderWidth={1}
      borderColor={isDark ? "gray.600" : "gray.200"}
      borderRadius="lg"
      p={3}
      pb={0}
      onChange={(index) => setCurrentTabIndex(index)}
    >
      <EntityPageTabList aria-hidden>
        {Object.keys(tabs).map((tabLabel, tabIndex) => {
          const tab = tabs[tabLabel];
          return (
            <EntityPageTab
              key={`userTab-${tabIndex}`}
              currentTabIndex={currentTabIndex}
              tab={tab}
              tabIndex={tabIndex}
              data-cy={`userTab-${tabLabel}`}
            >
              {tabLabel}
            </EntityPageTab>
          );
        })}
      </EntityPageTabList>
      {children}
    </Tabs>
  );
};
