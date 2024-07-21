import { CalendarIcon } from "@chakra-ui/icons";
import {
  Badge,
  BadgeProps,
  Flex,
  Icon,
  Input,
  Switch,
  TabPanel,
  TabPanels,
  Tabs,
  useColorMode
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaTools } from "react-icons/fa";
import { css } from "twin.macro";
import { useGetDocumentsQuery } from "features/api/documentsApi";
import { useEditOrgMutation } from "features/api/orgsApi";
import {
  AppHeading,
  Column,
  ColumnProps,
  EntityPageDocuments,
  EntityPageTab,
  EntityPageTabList,
  EntityPageTopics
} from "features/common";
import { EventsList } from "features/events/EventsList";
import theme, { scrollbarCss } from "features/layout/theme";
import { ProjectsList } from "features/projects/ProjectsList";
import { useSession } from "hooks/useSession";
import {
  defaultTabs,
  getCurrentTab,
  getDefaultTab,
  IOrg,
  IOrgTabWithMetadata,
  orgTypeFull
} from "models/Org";
import { ISubscription } from "models/Subscription";
import { normalize } from "utils/string";
import { AppQuery, AppQueryWithData } from "utils/types";
import { IsEditConfig } from "./OrgPage";
import { OrgPageHomeTabPanel } from "./OrgPageHomeTabPanel";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";
import { belongs } from "utils/belongs";
import { sortOn } from "utils/array";

export const OrgPageTabs = ({
  currentItemName,
  currentTabLabel = "Accueil",
  isCreator,
  isFollowed,
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
  isFollowed: boolean;
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

  const badgeProps: BadgeProps = {
    colorScheme: "teal",
    variant: "solid",
    ml: 1
  };
  const columnProps: ColumnProps = {
    bg: isDark ? "gray.700" : "lightblue"
  };
  const [editOrg] = useEditOrgMutation();
  const org = orgQuery.data;
  console.log("🚀 ~ org:", org);
  const orgTabs = [...(org.orgTabs || defaultTabs)];
  //.filter((tab) => tab.label === "" && !session ? false : true);
  //#region tabs
  const documentsQuery = useGetDocumentsQuery({ orgId: org._id });
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
          if (tab.label === "") return null;

          const key = `org-${normalize(
            Array.isArray(tab.label) ? tab.label[0] : tab.label
          )}-tab`;
          const url = Array.isArray(tab.url) ? tab.url[0] : tab.url;
          const isCurrent = tabIndex === currentTabIndex;
          console.log("🚀 ~ {sortedTabs.map ~ url:", url);

          return (
            <EntityPageTab
              key={key}
              currentTabIndex={currentTabIndex}
              tab={tab}
              tabIndex={tabIndex}
              {...(url === "/galerie" &&
              Array.isArray(documentsQuery.data) &&
              documentsQuery.data.length > 0
                ? {}
                : {})}
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
                    : !isDark && url !== "/"
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
              {url !== "/"
                ? typeof tab.label === "string"
                  ? tab.label
                  : tab.label[0]
                : ""}
              {url === "/galerie"
                ? Array.isArray(documentsQuery.data) &&
                  documentsQuery.data.length > 0 && (
                    <Badge {...badgeProps}>{documentsQuery.data.length}</Badge>
                  )
                : url === "/agenda"
                ? org.orgEvents.length > 0 && (
                    <Badge {...badgeProps}>{org.orgEvents.length}</Badge>
                  )
                : url === "/discussions" || url === "/d"
                ? org.orgTopics.length > 0 && (
                    <Badge {...badgeProps}>{org.orgTopics.length}</Badge>
                  )
                : url === "/projets"
                ? org.orgProjects.length > 0 && (
                    <Badge {...badgeProps}>{org.orgProjects.length}</Badge>
                  )
                : ""}
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
          {!!tabs.find(({ label }) => belongs(label, "Accueil")) && (
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
              <EntityPageTopics
                currentTopicName={currentItemName}
                isCreator={isCreator}
                isFollowed={isFollowed}
                query={orgQuery}
                subQuery={subQuery}
              />
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

          {/* {!!tabs.find(({ label }) => belongs(label, "Projets")) && (
            <TabPanel aria-hidden>
              <Flex alignItems="center" mb={3}>
                <Icon as={FaTools} boxSize={6} mr={3} />
                <AppHeading>Projets</AppHeading>
              </Flex>

              <Column {...columnProps}>
                <ProjectsList
                  org={org}
                  orgQuery={orgQuery}
                  subQuery={subQuery}
                  isCreator={isCreator}
                  isFollowed={isFollowed}
                />
              </Column>
            </TabPanel>
          )} */}

          {!!tabs.find(({ label }) => belongs(label, "Galerie")) && (
            <TabPanel aria-hidden>
              <EntityPageDocuments isCreator={isCreator} query={orgQuery} />
            </TabPanel>
          )}

          {/* {session && isCreator && (
            <TabPanel aria-hidden>
              <AppHeading mb={3}>
                Fonctionnalités {orgTypeFull(org.orgType)}
              </AppHeading>

              {defaultTabs
                .filter((defaultTab) => defaultTab.label !== "")
                .map((defaultTab) => {
                  const label = Array.isArray(defaultTab.label)
                    ? defaultTab.label[0]
                    : defaultTab.label;

                  return (
                    <Flex
                      key={"tab-" + label}
                      alignItems="center"
                      mb={1}
                      maxWidth="fit-content"
                    >
                      <Switch
                        isChecked={
                          !!tabsState.find(
                            (t) =>
                              belongs(t.label, defaultTab.label) && t.checked
                          )
                        }
                        isDisabled={label === "Accueil"}
                        mr={1}
                        onChange={async (e) => {
                          const newTabs = tabsState.map((t) =>
                            t.label === defaultTab.label
                              ? { ...t, checked: e.target.checked }
                              : t
                          );
                          setTabsState(newTabs);

                          let orgTabs;

                          if (
                            e.target.checked &&
                            !org.orgTabs?.find(
                              ({ label }) => label === defaultTab.label
                            )
                          ) {
                            orgTabs = [
                              ...tabs.map(({ label, url }) => ({
                                label,
                                url
                              })),
                              {
                                label: defaultTab.label,
                                url: defaultTab.url
                              }
                            ];
                          } else {
                            orgTabs = newTabs
                              .filter(({ checked }) => !!checked)
                              .map(({ label, url }) => ({ label, url }));
                          }

                          setCurrentTabIndex(orgTabs.length - 1);

                          await editOrg({
                            orgId: org._id,
                            payload: { orgTabs }
                          });
                        }}
                      />
                      <Input
                        defaultValue={label}
                        isDisabled
                        // onChange={(e) => {
                        //   let changed = false;
                        //   const newTabs = tabsState.map((t) => {
                        //     if (t.label === defaultTab.label) {
                        //       if (e.target.value !== t.label) changed = true;
                        //       return {
                        //         ...t,
                        //         label: e.target.value
                        //       };
                        //     }
                        //     return t;
                        //   });

                        //   if (changed) setTabsState(newTabs);
                        // }}
                      />
                    </Flex>
                  );
                })}
            </TabPanel>
          )} */}
        </TabPanels>
      )}
    </Tabs>
  );
};
