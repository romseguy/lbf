import { QuestionIcon } from "@chakra-ui/icons";
import {
  Alert,
  Badge,
  BadgeProps,
  Box,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  useColorMode
} from "@chakra-ui/react";
import { isBefore, parseISO, subDays } from "date-fns";
import { useEditOrgMutation } from "features/api/orgsApi";
import {
  Column,
  ColumnProps,
  EntityPageTab,
  EntityPageTabList
} from "features/common";
import { EventsList } from "features/events/EventsList";
import { GalleriesList } from "features/galleries/GalleriesList";
import theme, { scrollbarCss } from "features/layout/theme";
import { useSession } from "hooks/useSession";
import {
  defaultTabs,
  getCurrentTab,
  getDefaultTab,
  IOrg,
  IOrgTabWithMetadata
} from "models/Org";
import { ISubscription } from "models/Subscription";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";
import { css } from "twin.macro";
import { hasItems, sortOn } from "utils/array";
import { belongs } from "utils/belongs";
import { normalize } from "utils/string";
import { AppQuery, AppQueryWithData } from "utils/types";
import { IsEditConfig } from "./OrgPage";
import { OrgPageHomeTabPanel } from "./OrgPageHomeTabPanel";
import { OrgPageTopicsTabPanel } from "./OrgPageTopicsTabPanel";

export const OrgPageTabs = ({
  currentItemName,
  currentTabLabel = "Accueil",
  isCreator,
  isFollowed = false,
  orgQuery,
  isConfig,
  setIsConfig,
  isEdit,
  setIsEdit,
  subQuery
}: {
  currentItemName?: string;
  currentTabLabel?: string;
  isCreator: boolean;
  isFollowed?: boolean;
  orgQuery: AppQueryWithData<IOrg>;
  isConfig: boolean;
  setIsConfig: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit: boolean;
  setIsEdit: (arg: boolean | IsEditConfig) => void;
  subQuery: AppQuery<ISubscription>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const { data: session } = useSession();

  const org = orgQuery.data;
  const orgEventsToCome = org.orgEvents.filter((event) => {
    if (isBefore(new Date(), parseISO(event.eventMinDate))) return true;
  });
  const fiveDaysAgo = subDays(new Date(), 5);
  const orgGalleriesLast = org.orgGalleries.filter((gallery) => {
    if (isBefore(parseISO(gallery.createdAt || ""), fiveDaysAgo)) {
      return false;
    }
    return true;
  });
  const orgTopicsLast = org.orgTopics.filter((topic) => {
    if (isBefore(parseISO(topic.createdAt || ""), fiveDaysAgo)) {
      return false;
    }
    return true;
  });
  const orgTabs = [...(org.orgTabs || defaultTabs)];

  //#region tabs
  const tabs: IOrgTabWithMetadata[] = orgTabs
    //.sort(sortOn("order", ["0", "1", "2", "3", "4", "5"]))
    .map((tab) => {
      let url = tab.url;

      if (tab.url === "") {
        if (tab.label === "") url = "/parametres";
        if (tab.label === "Accueil") url = "/";
      }
      const dt = getDefaultTab({ url });
      const metadata: {} = {};

      return {
        ...tab,
        ...dt,
        ...metadata
      };
    });
  const sortedTabs = tabs.sort(sortOn("order", ["0", "1", "2", "3", "4", "5"]));
  //#endregion

  //#region currentTab
  const currentTab = getCurrentTab({ org, currentTabLabel });
  // const currentTabUrl = currentTab
  //   ? Array.isArray(currentTab.url)
  //     ? currentTab.url[0]
  //     : currentTab.url
  //   : "";
  //#endregion

  //#region currentTabIndex
  const getCurrentTabIndex = () => {
    if (currentTab) {
      for (let tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
        const tab = tabs[tabIndex];
        if (belongs(tab.url, currentTab.url)) return tabIndex;
      }
    }

    return 0;
  };
  const [currentTabIndex, setCurrentTabIndex] = useState(getCurrentTabIndex());

  useEffect(() => {
    setCurrentTabIndex(getCurrentTabIndex());
  }, [router.asPath]);

  //#endregion

  //#region events TabPanel
  const [title = "Agenda", setTitle] = useState<string | undefined>();
  //#endregion

  //#region parameters TabPanel
  const [tabsState, setTabsState] = useState<
    (IOrgTabWithMetadata & { checked: boolean })[]
  >(tabs.map((t) => ({ ...t, checked: true })));
  //#endregion

  const badgeProps: BadgeProps = {
    colorScheme: "teal",
    variant: "solid",
    ml: 1
  };

  const columnProps: ColumnProps = {
    bg: isDark ? "gray.700" : "lightblue"
  };

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
    >
      <EntityPageTabList
        aria-hidden
        bgColor={isDark ? "gray.800" : "blackAlpha.50"}
        //borderRadius="xl"
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
        {sortedTabs.map((tab, tabIndex) => {
          let label = typeof tab.label === "string" ? tab.label : tab.label[0];

          if (label === "") return null;

          const key = `org-${normalize(
            Array.isArray(tab.label) ? tab.label[0] : tab.label
          )}-tab`;
          const url = Array.isArray(tab.url) ? tab.url[0] : tab.url;
          const isCurrent = tabIndex === currentTabIndex;
          return (
            <EntityPageTab
              key={key}
              currentTabIndex={currentTabIndex}
              tab={tab}
              tabIndex={tabIndex}
              // {...(url === "/galeries" &&
              // Array.isArray(documentsQuery.data) &&
              // documentsQuery.data.length > 0
              //   ? {}
              //   : {})}
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
                    ? theme.colors.purple[500]
                    : isDark
                    ? "white"
                    : !isDark && isCurrent
                    ? theme.colors.whiteAlpha[900]
                    : !isDark //&& url !== "/"
                    ? "black"
                    : "none"};
                }
              `}
              {...(isMobile ? {} : {})}
              onClick={() => {
                router.push(`/${org.orgUrl}${url}`, `/${org.orgUrl}${url}`, {
                  shallow: true
                });
              }}
              data-cy={key}
            >
              {label}
              {url === "/agenda" && hasItems(orgEventsToCome) && (
                <Tooltip
                  label={`${orgEventsToCome.length} date${
                    orgEventsToCome.length !== 1 ? "s" : ""
                  } à venir`}
                >
                  <Badge {...badgeProps}>{orgEventsToCome.length}</Badge>
                </Tooltip>
              )}

              {(url === "/discussions" || url === "/d") &&
                hasItems(orgTopicsLast) && (
                  <Tooltip
                    label={`${orgTopicsLast.length} nouvelle${
                      orgTopicsLast.length !== 1 ? "s" : ""
                    } discussion${
                      orgTopicsLast.length !== 1 ? "s" : ""
                    } dans les 5 dernier jours`}
                  >
                    <Badge {...badgeProps}>{orgTopicsLast.length}</Badge>
                  </Tooltip>
                )}

              {url === "/galeries" && hasItems(orgGalleriesLast) && (
                <Tooltip
                  label={`${orgGalleriesLast.length} nouvelle${
                    orgGalleriesLast.length !== 1 ? "s" : ""
                  } galeries dans les 5 dernier jours`}
                >
                  <Badge {...badgeProps}>{orgGalleriesLast.length}</Badge>
                </Tooltip>
              )}
            </EntityPageTab>
          );
        })}
      </EntityPageTabList>

      {!isConfig && !isEdit && (
        <TabPanels
          css={css`
            & > * {
              padding: 12px !important;
            }
          `}
        >
          {!!tabs.find(({ url }) => belongs(url, "/")) && (
            <TabPanel aria-hidden>
              <OrgPageHomeTabPanel
                isCreator={isCreator}
                orgQuery={orgQuery}
                session={session}
                setIsEdit={setIsEdit}
                subQuery={subQuery}
              />
            </TabPanel>
          )}

          {!!tabs.find(({ label }) => belongs(label, "Discussions")) && (
            <TabPanel aria-hidden>
              <Column bg={isDark ? "gray.700" : "lightblue"}>
                <OrgPageTopicsTabPanel
                  currentTopicName={currentItemName}
                  isCreator={isCreator}
                  isFollowed={isFollowed}
                  query={orgQuery}
                  subQuery={subQuery}
                />
              </Column>

              {/* <AppHeading>Discussions des ateliers passés</AppHeading> */}
              {/* <VStack spacing={3}>
                {org.orgEvents.map((event) => (
                  <Column key={event._id}>
                    <VStack spacing={3}>
                      <EntityButton event={event} />
                      {!event.eventTopics.length ? (
                        <Alert status="info">
                          <AlertIcon />
                          Aucune discussions pour cet atelier.
                        </Alert>
                      ) : (
                        event.eventTopics.map((topic) => (
                          <EntityButton
                            colorScheme="blue"
                            event={event}
                            topic={topic}
                          />
                        ))
                      )}
                    </VStack>
                  </Column>
                ))}
              </VStack> */}
            </TabPanel>
          )}

          {!!tabs.find(({ label }) => belongs(label, "Agenda")) && (
            <TabPanel aria-hidden>
              {/* <Flex alignItems="center" mb={3}>
                <CalendarIcon boxSize={6} mr={3} />
                <AppHeading>{title}</AppHeading>
              </Flex> */}

              <Column {...columnProps}>
                <EventsList
                  events={org.orgEvents}
                  orgQuery={orgQuery}
                  isCreator={isCreator}
                  setTitle={setTitle}
                />
              </Column>
            </TabPanel>
          )}

          {!!tabs.find(({ label }) => belongs(label, "Galeries")) && (
            <TabPanel aria-hidden>
              <Column bg={isDark ? "gray.700" : "lightblue"}>
                <Alert
                  colorScheme="white"
                  status="info"
                  m="0 auto"
                  w={isMobile ? undefined : "50%"}
                  mb={3}
                >
                  <QuestionIcon />
                  <Box ml={5}>
                    Pour déposer vos photos, ajoutez ou sélectionnez une galerie
                    ci-dessous :
                  </Box>
                </Alert>

                <GalleriesList
                  query={orgQuery}
                  currentGalleryName={currentItemName}
                  isCreator={isCreator}
                />
              </Column>
            </TabPanel>
          )}
        </TabPanels>
      )}
    </Tabs>
  );
};
