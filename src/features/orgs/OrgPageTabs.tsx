import {
  CalendarIcon,
  ChatIcon,
  QuestionIcon,
  SettingsIcon
} from "@chakra-ui/icons";
import { Tabs, useColorMode } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaHome, FaImages, FaTools } from "react-icons/fa";
import { EntityPageTab, EntityPageTabList } from "features/common";
import { IOrg, IOrgTab } from "models/Org";
import { normalize } from "utils/string";
import { AppIcon } from "utils/types";
import { sortOn } from "utils/array";

export const defaultTabs: (IOrgTab & { icon: AppIcon })[] = [
  { label: "Accueil", icon: FaHome, url: "" },
  { label: "Événements", icon: CalendarIcon, url: "/evenements" },
  { label: "Projets", icon: FaTools, url: "/projets" },
  { label: "Discussions", icon: ChatIcon, url: "/discussions" },
  { label: "Galerie", icon: FaImages, url: "/galerie" },
  { label: "", icon: SettingsIcon, url: "" }
];

export const OrgPageTabs = ({
  children,
  org,
  session,
  ...props
}: {
  org: IOrg;
  session: Session | null;
  tab?: string;
  children: React.ReactNode | React.ReactNodeArray;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const tabs = [...(org.orgTabs || defaultTabs)].sort(
    sortOn(
      "label",
      defaultTabs.filter(({ label }) => label !== "").map(({ label }) => label)
    )
  );

  let defaultTabIndex = 0;
  if (props.tab !== undefined)
    tabs.map((tab, tabIndex) => {
      if (normalize(tab.label) === normalize(props.tab || ""))
        defaultTabIndex = tabIndex;
      return tabIndex + 1;
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
        {tabs.map((tab, tabIndex) => {
          if (!session && tab.label === "") return null;

          return (
            <EntityPageTab
              key={`orgTab-${tabIndex}`}
              currentTabIndex={currentTabIndex}
              icon={
                defaultTabs.find(({ label }) => label === tab.label)?.icon ||
                QuestionIcon
              }
              tabIndex={tabIndex}
              onClick={() => {
                if (tab.url)
                  router.push(
                    `/${org.orgUrl}${tab.url}`,
                    `/${org.orgUrl}${tab.url}`,
                    {
                      shallow: true
                    }
                  );
                else
                  router.push(`/${org.orgUrl}`, `/${org.orgUrl}`, {
                    shallow: true
                  });
              }}
              data-cy={`orgTab-${tab.label}`}
            >
              {tab.label}
            </EntityPageTab>
          );
        })}
      </EntityPageTabList>

      {/* TabPanels */}
      {children}
    </Tabs>
  );
};
