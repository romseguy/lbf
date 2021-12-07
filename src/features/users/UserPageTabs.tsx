import { Tabs } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaHome, FaImages, FaTools } from "react-icons/fa";
import { EntityPageTab, EntityPageTabList } from "features/common";
import { AppIcon } from "utils/types";

const defaultTabs: UserPageTabsType = {
  Accueil: { icon: FaHome, url: "" },
  Projets: { icon: FaTools, url: "/projets" },
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
  let defaultTabIndex = 0;
  Object.keys(tabs).reduce((index, tab) => {
    if (tab.toLowerCase() === props.tab?.toLowerCase()) defaultTabIndex = index;
    return index + 1;
  }, 0);
  const [currentTabIndex, setCurrentTabIndex] = useState(defaultTabIndex || 0);

  return (
    <Tabs
      defaultIndex={defaultTabIndex}
      index={currentTabIndex}
      isFitted
      isLazy
      isManual
      lazyBehavior="keepMounted"
      variant="solid-rounded"
      borderWidth={1}
      borderColor="gray.200"
      borderRadius="lg"
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
