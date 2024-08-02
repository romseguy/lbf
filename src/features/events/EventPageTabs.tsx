import {
  Badge,
  BadgeProps,
  HStack,
  Icon,
  Tabs,
  Text,
  Tooltip,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  EditIconButton,
  EntityPageTab,
  EntityPageTabList,
  EntityPageTopics
} from "features/common";
import { defaultTabs, IEvent } from "models/Event";
import { normalize } from "utils/string";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";

import { TabPanel, TabPanels } from "@chakra-ui/react";
import { css } from "twin.macro";
import { AppHeading, Column } from "features/common";
import theme, { scrollbarCss } from "features/layout/theme";
import { useSession } from "hooks/useSession";
import { ISubscription } from "models/Subscription";
import { AppQuery, AppQueryWithData } from "utils/types";
import { EventPageHomeTabPanel } from "./EventPageHomeTabPanel";
import { isBefore, parseISO } from "date-fns";
import { GalleriesListItem } from "features/galleries/GalleriesListItem";
import { FaImages } from "react-icons/fa";
import { useGetGalleryQuery } from "features/api/galleriesApi";
import { hasItems } from "utils/array";
import { GalleryFormModal } from "features/modals/GalleryFormModal";
import { IGallery } from "models/Gallery";
import { ChatIcon } from "@chakra-ui/icons";

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
  const toast = useToast({ position: "top" });
  const event = eventQuery.data;

  //#region tabs
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  useEffect(() => {
    Object.keys(defaultTabs).reduce((index, defaultTabKey) => {
      if (
        "/" +
          normalize(
            currentTabLabel === "Présentation" ? "/" : currentTabLabel
          ) ===
        defaultTabs[defaultTabKey].url
      )
        setCurrentTabIndex(index);
      return index + 1;
    }, 0);
  }, [currentTabLabel]);
  //#endregion

  //#region gallery
  const galleryQuery = useGetGalleryQuery({ galleryId: event._id });
  const [gallery, setGallery] = useState(galleryQuery.data);
  useEffect(() => {
    if (galleryQuery.isSuccess) setGallery(galleryQuery.data);
  }, [galleryQuery.isSuccess, galleryQuery.data]);
  //#endregion

  //#region gallery modal
  const [galleryModalState, setGalleryModalState] = useState({
    isOpen: false
  });
  const onOpen = () =>
    setGalleryModalState({
      ...galleryModalState,
      isOpen: true
    });
  const onClose = () =>
    setGalleryModalState({
      ...galleryModalState,
      isOpen: false
    });
  //#endregion

  return (
    <Tabs
      defaultIndex={0}
      index={currentTabIndex}
      isFitted
      isLazy
      isManual
      lazyBehavior="unmount"
      variant="solid-rounded"
      background={isDark ? "black" : "blackAlpha.200"}
      borderColor={isDark ? "gray.600" : "gray.200"}
      //borderRadius="lg"
      borderWidth={1}
      //p={3}
      //pb={0}
    >
      <EntityPageTabList
        aria-hidden
        bgColor={isDark ? "gray.700" : "blackAlpha.50"}
        //borderRadius="xl"
        css={scrollbarCss}
        {...(isMobile
          ? {
              position: "fixed",
              bottom: 0,
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
          const key = `event-${normalize(tabLabel)}-tab`;
          const tab = defaultTabs[tabLabel];
          const isCurrent = tabIndex === currentTabIndex;
          const url = Array.isArray(tab.url) ? tab.url[0] : tab.url;

          return (
            <EntityPageTab
              key={key}
              currentTabIndex={currentTabIndex}
              tab={tab}
              tabIndex={tabIndex}
              css={css`
                ${isCurrent &&
                `
                border: 5px solid ${
                  isDark ? theme.colors.teal[200] : theme.colors.teal[400]
                };
                backgroundcolor: white;
                  `}
                path {
                  fill: ${isDark && isCurrent
                    ? "white"
                    : isDark
                    ? "white"
                    : !isDark && isCurrent
                    ? "white"
                    : !isDark //&& url !== "/"
                    ? "black"
                    : "none"};
                }
              `}
              {...(isMobile ? {} : {})}
              onClick={() => {
                const url =
                  tab.url === "/"
                    ? `/${event.eventUrl}`
                    : `/${event.eventUrl}${tab.url}`;
                router.push(url, url, {
                  shallow: true
                });
              }}
              data-cy={key}
            >
              {tabLabel}
              {url === "/galerie" && hasItems(gallery?.galleryDocuments) ? (
                <Badge ml={2}>{gallery?.galleryDocuments!.length}</Badge>
              ) : null}
            </EntityPageTab>
          );
        })}
      </EntityPageTabList>

      <TabPanels
        css={css`
          & > * {
            padding: 12px !important;
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
          <HStack mb={3}>
            <Icon as={ChatIcon} boxSize={10} />
            <Text fontSize="3xl">{eventQuery.data.eventName}</Text>
          </HStack>
          <EntityPageTopics
            currentTopicName={currentItemName}
            isCreator={isCreator}
            isFollowed={isFollowed}
            query={eventQuery}
            subQuery={subQuery}
          />
        </TabPanel>

        <TabPanel aria-hidden>
          <HStack
            mb={3}
            {...(isMobile
              ? {
                  bg: isDark ? "#63B3ED" : "#2B6CB0",
                  borderTopRadius: "12px",
                  p: 3
                }
              : {})}
          >
            <Icon as={FaImages} boxSize={10} />
            <Text fontSize="3xl">{eventQuery.data.eventName}</Text>
            {isCreator && (
              <Tooltip
                label={
                  !!gallery?.galleryDescription
                    ? "Modifier la description de la galerie"
                    : "Ajouter une description à la galerie"
                }
                placement="right"
              >
                <span>
                  <EditIconButton
                    aria-label="Modifier la description de la galerie de l'événement"
                    onClick={() => {
                      onOpen();
                    }}
                  />
                </span>
              </Tooltip>
            )}
          </HStack>

          <Column
            bg={isDark ? "gray.700" : "lightblue"}
            {...(isMobile ? { p: 0 } : {})}
          >
            <GalleriesListItem
              query={eventQuery}
              gallery={gallery}
              galleryIndex={0}
              isCreator={isCreator}
              isCurrent
              isGalleryCreator={true}
              noHeader
              {...(isMobile ? { px: 3 } : {})}
              {...(!isBefore(parseISO(event.eventMinDate), new Date())
                ? {
                    //TODO1 if (ne fait pas partie de la liste des participants de l'atelier)
                    onAddDocumentClick: () => {
                      toast({
                        title:
                          "Vous pourrez ajouter des photos seulement après avoir participé à l'atelier"
                      });
                    }
                  }
                : {})}
            />

            <GalleryFormModal
              query={eventQuery}
              gallery={gallery}
              isOpen={galleryModalState.isOpen}
              onCancel={() => {
                onClose();
              }}
              onClose={onClose}
              onSubmit={(gallery) => {
                setGallery(gallery);
                onClose();
              }}
            />
          </Column>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
