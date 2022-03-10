import { ChatIcon, EmailIcon } from "@chakra-ui/icons";
import { Tabs, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { EntityPageTab, EntityPageTabList } from "features/common";
import { IEvent } from "models/Event";
import { normalize } from "utils/string";
import { AppIcon } from "utils/types";

const defaultTabs: { [key: string]: { icon: AppIcon; url: string } } = {
  Accueil: { icon: FaHome, url: "/accueil" },
  Discussions: { icon: ChatIcon, url: "/discussions" }
};

export const EventPageTabs = ({
  children,
  event,
  isCreator,
  isMobile,
  currentTabLabel = "Accueil"
}: {
  event: IEvent;
  currentTabLabel?: string;
  isCreator?: boolean;
  isMobile: boolean;
  children: React.ReactNode | React.ReactNodeArray;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  if (isCreator)
    defaultTabs["Invitations"] = {
      icon: EmailIcon,
      url: "/invitations"
    };

  useEffect(() => {
    Object.keys(defaultTabs).reduce((index, tab) => {
      if (normalize(tab) === normalize(currentTabLabel))
        setCurrentTabIndex(index);
      return index + 1;
    }, 0);
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
        {Object.keys(defaultTabs).map((name, tabIndex) => {
          const tab = defaultTabs[name];

          return (
            <EntityPageTab
              key={`eventTab-${tabIndex}`}
              currentTabIndex={currentTabIndex}
              icon={tab.icon}
              isMobile={isMobile}
              tabIndex={tabIndex}
              onClick={() => {
                router.push(
                  `/${event.eventUrl}${tab.url}`,
                  `/${event.eventUrl}${tab.url}`,
                  {
                    shallow: true
                  }
                );
              }}
              data-cy={`eventTab-${name}`}
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
