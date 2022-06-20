import { Tabs, useColorMode } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaHome, FaImages, FaTools } from "react-icons/fa";
import { EntityPageTab, EntityPageTabList } from "features/common";
import { AppIcon } from "utils/types";

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
  isMobile,
  height = "60px",
  tabs = defaultTabs,
  ...props
}: {
  children: React.ReactNode | React.ReactNodeArray;
  isMobile: boolean;
  height?: string;
  tab?: string;
  tabs?: UserPageTabsType;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
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
        {Object.keys(tabs).map((name, tabIndex) => {
          const { icon, url } = tabs[name];

          return (
            <EntityPageTab
              key={`userTab-${tabIndex}`}
              currentTabIndex={currentTabIndex}
              icon={icon}
              isMobile={isMobile}
              tabIndex={tabIndex}
              data-cy={`userTab-${name}`}
            >
              {name}
            </EntityPageTab>
          );
        })}
      </EntityPageTabList>
      {children}
    </Tabs>
  );
};
