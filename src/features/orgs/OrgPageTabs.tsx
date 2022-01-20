import {
  CalendarIcon,
  ChatIcon,
  QuestionIcon,
  SettingsIcon
} from "@chakra-ui/icons";
import { Tabs, useColorMode } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaHome, FaImages, FaTools } from "react-icons/fa";
import { EntityPageTab, EntityPageTabList } from "features/common";
import { IOrg, IOrgTab } from "models/Org";
import { normalize } from "utils/string";
import { AppIcon } from "utils/types";

export const defaultTabs: (IOrgTab & { icon: AppIcon })[] = [
  { label: "Accueil", icon: FaHome, url: "/accueil" },
  { label: "Événements", icon: CalendarIcon, url: "/evenements" },
  { label: "Projets", icon: FaTools, url: "/projets" },
  { label: "Discussions", icon: ChatIcon, url: "/discussions" },
  { label: "Galerie", icon: FaImages, url: "/galerie" },
  { label: "", icon: SettingsIcon, url: "/parametres" }
];

export const OrgPageTabs = ({
  children,
  org,
  session,
  currentTabLabel = "Accueil",
  tabs
}: {
  org: IOrg;
  session: Session | null;
  currentTabLabel?: string;
  tabs: IOrgTab[];
  children: (renderProps: {
    currentTabIndex: number;
    setCurrentTabIndex: React.Dispatch<React.SetStateAction<number>>;
  }) => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  useEffect(() => {
    tabs.forEach((tab, tabIndex) => {
      if (
        normalize(tab.label) ===
        normalize(currentTabLabel === "parametres" ? "" : currentTabLabel)
      )
        setCurrentTabIndex(tabIndex);
    });
  }, []);

  return (
    <Tabs
      defaultIndex={0}
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
                router.push(
                  `/${org.orgUrl}${tab.url}`,
                  `/${org.orgUrl}${tab.url}`,
                  {
                    shallow: true
                  }
                );
              }}
              data-cy={`orgTab-${tab.label}`}
            >
              {tab.label}
            </EntityPageTab>
          );
        })}
      </EntityPageTabList>

      {/* TabPanels */}
      {children({ currentTabIndex, setCurrentTabIndex })}
    </Tabs>
  );
};
