import { ChatIcon, EmailIcon } from "@chakra-ui/icons";
import { Tabs, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { EntityPageTab, EntityPageTabList } from "features/common";
import { IEvent } from "models/Event";
import { AppIcon } from "utils/types";

const tabs: { [key: string]: { icon: AppIcon; url: string } } = {
  Accueil: { icon: FaHome, url: "" },
  Discussions: { icon: ChatIcon, url: "/discussions" }
};

export const EventPageTabs = ({
  children,
  event,
  isCreator,
  ...props
}: {
  event: IEvent;
  tab?: string;
  isCreator?: boolean;
  children: React.ReactNode | React.ReactNodeArray;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  let defaultTabIndex = 0;
  Object.keys(tabs).reduce((index, tab) => {
    if (tab.toLowerCase() === props.tab?.toLowerCase()) defaultTabIndex = index;
    return index + 1;
  }, 0);
  const [currentTabIndex, setCurrentTabIndex] = useState(defaultTabIndex);

  if (isCreator)
    tabs["Participants"] = {
      icon: EmailIcon,
      url: "/invitations"
    };

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
              key={`eventTab-${tabIndex}`}
              currentTabIndex={currentTabIndex}
              icon={icon}
              tabIndex={tabIndex}
              onClick={() => {
                if (name === "Discussions")
                  router.push(
                    `/${event.eventUrl}/discussions`,
                    `/${event.eventUrl}/discussions`,
                    {
                      shallow: true
                    }
                  );
                else
                  router.push(`/${event.eventUrl}`, `/${event.eventUrl}`, {
                    shallow: true
                  });
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
