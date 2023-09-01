import { ChatIcon, EmailIcon } from "@chakra-ui/icons";
import { Tabs, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { EntityPageTab, EntityPageTabList } from "features/common";
import { IEvent } from "models/Event";
import { normalize } from "utils/string";
import { AppIcon } from "utils/types";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";

const defaultTabs: { [key: string]: { icon: AppIcon; url: string } } = {
  Accueil: { icon: FaHome, url: "/accueil" },
  Discussions: { icon: ChatIcon, url: "/discussions" }
};

export const EventPageTabs = ({
  children,
  event,
  isCreator,
  currentTabLabel = "Accueil"
}: {
  event: IEvent;
  currentTabLabel?: string;
  isCreator?: boolean;
  children: React.ReactNode | React.ReactNodeArray;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  if (isCreator)
    defaultTabs["Invitations"] = {
      icon: EmailIcon,
      url: "/invitations"
    };

  //#region componentDidMount
  useEffect(() => {
    Object.keys(defaultTabs).reduce((index, tab) => {
      if (normalize(tab) === normalize(currentTabLabel))
        setCurrentTabIndex(index);
      return index + 1;
    }, 0);
  }, []);
  //#endregion

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
      borderColor={isDark ? "gray.600" : "gray.200"}
      borderRadius="lg"
      borderWidth={1}
      p={3}
      pb={0}
    >
      <EntityPageTabList aria-hidden>
        {Object.keys(defaultTabs).map((tabLabel, tabIndex) => {
          const tab = defaultTabs[tabLabel];
          const key = `event-${normalize(tabLabel)}-tab`;

          return (
            <EntityPageTab
              key={key}
              currentTabIndex={currentTabIndex}
              tab={tab}
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
              data-cy={key}
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
