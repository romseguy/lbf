import {
  Badge,
  HStack,
  Icon,
  Tabs,
  Text,
  Tooltip,
  useColorMode,
  TabPanel,
  TabPanels,
  Spinner
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

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

import { css } from "twin.macro";
import { Column } from "features/common";
import theme, { scrollbarCss } from "features/layout/theme";
import { ISubscription } from "models/Subscription";
import { AppQuery, AppQueryWithData } from "utils/types";
import { EventPageHomeTabPanel } from "./EventPageHomeTabPanel";
import { isBefore, parseISO } from "date-fns";
import { GalleriesListItem } from "features/galleries/GalleriesListItem";
import { FaImages } from "react-icons/fa";
import { useGetGalleryQuery } from "features/api/galleriesApi";
import { hasItems } from "utils/array";
import { GalleryFormModal } from "features/modals/GalleryFormModal";
import { CalendarIcon, ChatIcon } from "@chakra-ui/icons";
import { IGallery } from "models/Gallery";
import { EventPageTopicsTabPanel } from "./EventPageTopicsTabPanel";

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
  const galleryQuery = useGetGalleryQuery({
    galleryId: event._id
  }) as AppQuery<IGallery>;
  const gallery = galleryQuery.data;
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
                ${
                  isCurrent &&
                  `
                border: 5px solid ${
                  isDark ? theme.colors.teal[200] : theme.colors.teal[400]
                };
                backgroundcolor: white;
                  `
                }
                path {
                  fill: ${
                    isDark && isCurrent
                      ? theme.colors.red[400]
                      : isDark
                        ? "white"
                        : !isDark && isCurrent
                          ? theme.colors.red[200]
                          : !isDark //&& url !== "/"
                            ? "black"
                            : "none"
                  };
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
              ) : url === "/discussions" && hasItems(event.eventTopics) ? (
                <Badge ml={2}>{event.eventTopics.length}</Badge>
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
          <HStack mb={3}>
            <Icon as={CalendarIcon} boxSize={10} />
            <Text fontSize="3xl">{eventQuery.data.eventName}</Text>
          </HStack>
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

          <Column bg={isDark ? "gray.700" : "lightblue"}>
            <EventPageTopicsTabPanel
              currentTopicName={currentItemName}
              isCreator={isCreator}
              isFollowed={isFollowed}
              query={eventQuery}
              subQuery={subQuery}
            />
          </Column>
        </TabPanel>

        <TabPanel aria-hidden>
          <HStack
            mb={3}
            {...(isMobile
              ? {
                  // bg: isDark ? "#63B3ED" : "#2B6CB0",
                  // borderTopRadius: "12px",
                  // p: 3
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
            {...(isMobile ? { px: 0 } : {})}
          >
            {gallery ? (
              <GalleriesListItem
                gallery={gallery}
                query={eventQuery}
                galleryIndex={0}
                isCreator={isCreator}
                isCurrent
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
            ) : (
              <Spinner />
            )}

            <GalleryFormModal
              query={eventQuery}
              gallery={gallery}
              isOpen={galleryModalState.isOpen}
              onCancel={() => {
                onClose();
              }}
              onClose={onClose}
              onSubmit={(gallery) => {
                onClose();
              }}
            />
          </Column>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
