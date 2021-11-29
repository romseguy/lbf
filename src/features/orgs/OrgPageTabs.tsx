import React, { useState } from "react";
import { TabList, Tabs, useColorModeValue } from "@chakra-ui/react";
import { FaHome, FaImages, FaTools } from "react-icons/fa";
import { CalendarIcon, ChatIcon } from "@chakra-ui/icons";
import { IOrg } from "models/Org";
import { useRouter } from "next/router";
import { EntityPageTab } from "features/common";
import { AppIcon } from "utils/types";

const tabs: { [key: string]: { icon: AppIcon; url: string } } = {
  Accueil: { icon: FaHome, url: "" },
  Événements: { icon: CalendarIcon, url: "/evenements" },
  Projets: { icon: FaTools, url: "/projets" },
  Discussions: { icon: ChatIcon, url: "/discussions" },
  Galerie: { icon: FaImages, url: "/galerie" }
};

export const OrgPageTabs = ({
  children,
  org,
  ...props
}: {
  org: IOrg;
  tab?: string;
  children: React.ReactNode | React.ReactNodeArray;
}) => {
  const router = useRouter();
  const inactiveTabBg = useColorModeValue("gray.100", "whiteAlpha.300");

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
        mx={3}
        css={{
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "-ms-autohiding-scrollbar"
        }}
        aria-hidden
      >
        {Object.keys(tabs).map((name, tabIndex) => {
          const { icon, url } = tabs[name];

          return (
            <EntityPageTab
              key={`orgTab-${tabIndex}`}
              currentTabIndex={currentTabIndex}
              icon={icon}
              tabIndex={tabIndex}
              onClick={() => {
                if (name === "Discussions")
                  router.push(
                    `/${org.orgUrl}/discussions`,
                    `/${org.orgUrl}/discussions`,
                    {
                      shallow: true
                    }
                  );
                else
                  router.push(`/${org.orgUrl}`, `/${org.orgUrl}`, {
                    shallow: true
                  });
              }}
              data-cy={`orgTab-${name}`}
            >
              {name}
            </EntityPageTab>
          );
        })}
      </TabList>
      {children}
    </Tabs>
  );
};
