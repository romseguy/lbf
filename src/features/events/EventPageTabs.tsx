import {
  Badge,
  BadgeProps,
  HStack,
  Icon,
  Tabs,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { EntityPageTab, EntityPageTabList } from "features/common";
import { defaultTabs, IEvent } from "models/Event";
import { normalize } from "utils/string";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";

import { TabPanel, TabPanels } from "@chakra-ui/react";
import { css } from "twin.macro";
import { AppHeading, Column } from "features/common";
import { scrollbarCss } from "features/layout/theme";
import { useSession } from "hooks/useSession";
import { ISubscription } from "models/Subscription";
import { AppQuery, AppQueryWithData } from "utils/types";
import { EventPageHomeTabPanel } from "./EventPageHomeTabPanel";
import { isBefore, parseISO } from "date-fns";
import { GalleriesListItem } from "features/galleries/GalleriesListItem";
import { FaImages } from "react-icons/fa";
import { useGetGalleryQuery } from "features/api/galleriesApi";
import { hasItems } from "utils/array";

export const EventPageTabs = ({
  currentItemName,
  currentTabLabel = "Présentation",
  eventQuery,
  isCreator,
  isFollowed,
  setIsConfig,
  setIsEdit,
  subQuery
}: {
  currentItemName?: string;
  currentTabLabel?: string;
  eventQuery: AppQueryWithData<IEvent>;
  isCreator: boolean;
  isFollowed: boolean;
  setIsConfig: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  subQuery: AppQuery<ISubscription>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const { data: session } = useSession();
  const toast = useToast({ position: "bottom" });

  const event = eventQuery.data;

  const { data } = useGetGalleryQuery({ galleryId: event._id });
  const gallery = data || {
    _id: eventQuery.data._id,
    galleryName: eventQuery.data._id
  };

  const badgeProps: BadgeProps = {
    colorScheme: "teal",
    variant: "solid",
    ml: 1
  };
  const columnProps = {
    bg: isDark ? "gray.700" : "lightblue"
  };
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [showNotifForm, setShowNotifForm] = useState(false);

  // if (isCreator)
  //   defaultTabs["Invitations"] = {
  //     icon: EmailIcon,
  //     url: "/invitations"
  //   };

  const isDisabled = !isBefore(parseISO(event.eventMinDate), new Date());

  useEffect(() => {
    Object.keys(defaultTabs).reduce((index, tab) => {
      if (normalize(tab) === normalize(currentTabLabel))
        setCurrentTabIndex(index);
      return index + 1;
    }, 0);
  }, [currentTabLabel]);

  return (
    <Tabs
      defaultIndex={0}
      index={currentTabIndex}
      isFitted
      isLazy
      isManual
      lazyBehavior="keepMounted"
      variant="solid-rounded"
      background={isDark ? "black" : "blackAlpha.200"}
      borderColor={isDark ? "gray.600" : "gray.200"}
      borderRadius="lg"
      borderWidth={1}
      p={3}
      pb={0}
    >
      <EntityPageTabList
        aria-hidden
        //flexDirection={isMobile ? "column" : "row"}
        bgColor={isDark ? "gray.700" : "blackAlpha.50"}
        borderRadius="xl"
        css={scrollbarCss}
        {...(isMobile
          ? {
              position: "fixed",
              bottom: 0,
              //width: "calc(100% - 28px)",
              width: "100%",
              overflowX: "scroll",
              left: 0,
              pb: 1,
              pl: 1,
              pt: 2,
              pr: 1
            }
          : {
              overflowX: "auto",
              p: 3
            })}
      >
        {Object.keys(defaultTabs).map((tabLabel, tabIndex) => {
          const tab = defaultTabs[tabLabel];
          const url = Array.isArray(tab.url) ? tab.url[0] : tab.url;
          const key = `event-${normalize(tabLabel)}-tab`;

          return (
            <EntityPageTab
              key={key}
              currentTabIndex={currentTabIndex}
              tab={tab}
              tabIndex={tabIndex}
              onClick={() => {
                if (isDisabled && tabIndex > 0)
                  toast({
                    title: "Cet onglet sera accessible après l'atelier"
                  });
                else {
                  const url =
                    tab.url === "/"
                      ? `/${event.eventUrl}`
                      : `/${event.eventUrl}${tab.url}`;
                  router.push(url, url, {
                    shallow: true
                  });
                }
              }}
              data-cy={key}
            >
              {tabLabel}
              {url === "/galerie" && hasItems(gallery.galleryDocuments) ? (
                <Badge>{gallery.galleryDocuments!.length}</Badge>
              ) : null}
            </EntityPageTab>
          );
        })}
      </EntityPageTabList>

      <TabPanels
        css={css`
          & > * {
            padding: 12px 0 !important;
          }
        `}
      >
        <TabPanel aria-hidden>
          <EventPageHomeTabPanel
            eventQuery={eventQuery}
            isCreator={isCreator}
            setIsEdit={setIsEdit}
          />
        </TabPanel>

        <TabPanel aria-hidden>
          <Column bg={isDark ? "gray.700" : "lightblue"}>
            <HStack mb={3}>
              <Icon as={FaImages} boxSize={10} />
              <AppHeading>{eventQuery.data.eventName}</AppHeading>
            </HStack>
            <GalleriesListItem
              query={eventQuery}
              gallery={gallery}
              galleryIndex={0}
              isCreator={true}
              isCurrent={true}
              isLoading={false}
              setIsLoading={() => {}}
              isGalleryCreator={true}
              onClick={() => {}}
              onEditClick={() => {}}
              noHeader
            />
          </Column>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
