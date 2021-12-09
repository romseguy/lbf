import { CalendarIcon, ChatIcon } from "@chakra-ui/icons";
import { Tabs, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaHome, FaImages, FaTools } from "react-icons/fa";
import { EntityPageTab, EntityPageTabList } from "features/common";
import { IOrg } from "models/Org";
import { normalize } from "utils/string";
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
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  let defaultTabIndex = 0;
  Object.keys(tabs).reduce((index, tab) => {
    if (normalize(tab) === normalize(props.tab || "")) defaultTabIndex = index;
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
                else if (name === "Événements")
                  router.push(
                    `/${org.orgUrl}/evenements`,
                    `/${org.orgUrl}/evenements`,
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
      </EntityPageTabList>
      {children}
    </Tabs>
  );
};
