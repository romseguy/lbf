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
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  EntityPageTopics,
  Link
} from "features/common";
import { EventsList } from "features/events/EventsList";
import { ProjectsList } from "features/projects/ProjectsList";
import { useSession } from "hooks/useSession";
import {
  defaultTabs,
  IOrg,
  IOrgTabWithMetadata,
  orgTypeFull
} from "models/Org";
import { ISubscription } from "models/Subscription";
import { sortOn } from "utils/array";
import { normalize } from "utils/string";
import { AppQuery, AppQueryWithData } from "utils/types";
import { IsEditConfig } from "./OrgPage";
import { OrgPageHomeTabPanel } from "./OrgPageHomeTabPanel";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";

export const OrgPageTabs = ({
  currentItemName,
  currentTabLabel = "Accueil",
  isCreator,
  isFollowed,
  orgQuery,
  setIsConfig,
  setIsEdit,
  subQuery
}: {
  currentItemName?: string;
  currentTabLabel?: string;
  isCreator: boolean;
  isFollowed: boolean;
  orgQuery: AppQueryWithData<IOrg>;
  setIsConfig: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEdit: (arg: boolean | IsEditConfig) => void;
  subQuery: AppQuery<ISubscription>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const { data: session } = useSession();
  const badgeProps: BadgeProps = {
    colorScheme: "teal",
    variant: "solid",
    ml: 1
  };
  const columnProps: ColumnProps = {
    bg: isDark ? "gray.700" : "lightblue"
  };
  const router = useRouter();
  const [editOrg] = useEditOrgMutation();
  const org = orgQuery.data;

  //#region tabs
  const documentsQuery = useGetDocumentsQuery({ orgId: org._id });
  const tabs: IOrgTabWithMetadata[] = useMemo(() => {
    return [...(org.orgTabs || defaultTabs)]
      .filter((tab) => (tab.label === "" && !session ? false : true))
      .sort(
        sortOn(
          "label",
          defaultTabs
            .filter(({ label }) => label !== "")
            .map(({ label }) => label)
        )
      )
      .map((tab) => {
        const defaultTab = defaultTabs.find(
          (defaultTab) => defaultTab.label === tab.label
        );
        const metadata: {} = {};

        if (defaultTab) {
          return {
            ...tab,
            ...defaultTab,
            ...metadata
          };
        }

        return { ...tab, ...metadata };
      });
  }, [org]);
  //#endregion

  //#region current tab index
  const getCurrentTabIndex = useCallback(
    (tabs: IOrgTabWithMetadata[]) => {
      for (let tabIndex = 0; tabIndex <= tabs.length; tabIndex++) {
        const tab = tabs[tabIndex];

        if (
          tab &&
          normalize(tab.label) ===
            normalize(currentTabLabel === "parametres" ? "" : currentTabLabel)
        )
          return tabIndex;
      }
      return 0;
    },
    [currentTabLabel]
  );
  const [currentTabIndex, setCurrentTabIndex] = useState(
    getCurrentTabIndex(tabs)
  );
  useEffect(() => {
    setCurrentTabIndex(getCurrentTabIndex(tabs));
  }, [router.asPath]);
  //#endregion

  //#region events TabPanel
  const [title = "Événements des 7 prochains jours", setTitle] = useState<
    string | undefined
  >();
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
      lazyBehavior="keepMounted"
      variant="solid-rounded"
      background={isDark ? "black" : "lightcyan"}
      borderColor={isDark ? "gray.600" : "gray.200"}
      borderRadius="lg"
      borderWidth={1}
      p={3}
      pb={0}
    >
      <EntityPageTabList
        aria-hidden
        flexDirection={isMobile ? "column" : "row"}
      >
        {tabs.map((tab, tabIndex) => {
          const key = `org-${normalize(tab.label)}-tab`;

          return (
            // <Link key={key} href={`/${org.orgUrl}${tab.url}`} shallow>
            <EntityPageTab
              key={key}
              currentTabIndex={currentTabIndex}
              tab={tab}
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
              data-cy={key}
            >
              {isMobile && tab.label === "" ? "Configuration" : tab.label}
              {tab.url === "/galerie"
                ? Array.isArray(documentsQuery.data) &&
                  documentsQuery.data.length > 0 && (
                    <Badge {...badgeProps}>{documentsQuery.data.length}</Badge>
                  )
                : tab.url === "/evenements"
                ? org.orgEvents.length > 0 && (
                    <Badge {...badgeProps}>{org.orgEvents.length}</Badge>
                  )
                : tab.url === "/discussions"
                ? org.orgTopics.length > 0 && (
                    <Badge {...badgeProps}>{org.orgTopics.length}</Badge>
                  )
                : tab.url === "/projets"
                ? org.orgProjects.length > 0 && (
                    <Badge {...badgeProps}>{org.orgProjects.length}</Badge>
                  )
                : ""}
            </EntityPageTab>
            // </Link>
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
        {!!tabs.find(({ label }) => label === "Accueil") && (
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

        {!!tabs.find(({ label }) => label === "Discussions") && (
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

        {!!tabs.find(({ label }) => label === "Événements") && (
          <TabPanel aria-hidden>
            <Flex alignItems="center" mb={3}>
              <CalendarIcon boxSize={6} mr={3} />
              <AppHeading>{title}</AppHeading>
            </Flex>

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

        {!!tabs.find(({ label }) => label === "Projets") && (
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
        )}

        {!!tabs.find(({ label }) => label === "Galerie") && (
          <TabPanel aria-hidden>
            <EntityPageDocuments isCreator={isCreator} query={orgQuery} />
          </TabPanel>
        )}

        {session && isCreator && (
          <TabPanel aria-hidden>
            <AppHeading mb={3}>
              Fonctionnalités {orgTypeFull(org.orgType)}
            </AppHeading>

            {defaultTabs
              .filter((defaultTab) => defaultTab.label !== "")
              .map((defaultTab) => {
                return (
                  <Flex
                    key={"tab-" + defaultTab.label}
                    alignItems="center"
                    mb={1}
                    maxWidth="fit-content"
                  >
                    <Switch
                      isChecked={
                        !!tabsState.find(
                          (t) => t.label === defaultTab.label && t.checked
                        )
                      }
                      isDisabled={defaultTab.label === "Accueil"}
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
                      defaultValue={defaultTab.label}
                      isDisabled={defaultTabs
                        .map(({ label }) => label)
                        .includes(defaultTab.label)}
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
        )}
      </TabPanels>
    </Tabs>
  );
};

{
  /*
const { getEnv } = require("utils/env");
    {getEnv() === "development" &&
      session?.user.isAdmin && (
          <Box mb={5}>
            <Button
              onClick={async () => {
                await editOrg({
                  orgId: org._id,
                  payload: { orgTopics: [] }
                }).unwrap();
              }}
            >
              RAZ
            </Button>
          </Box>
        )}
  */
}

{
  /*
    <Alert status="info" mb={5}>
      <AlertIcon />
      <Box>
        Cette section a pour vocation principale de proposer une
        alternative plus pratique et respectueuse aux{" "}
        <Tooltip label="synonymes : mailing lists, newsletters">
          <Text
            display="inline"
            borderBottom={`1px dotted ${isDark ? "white" : "black"}`}
            cursor="pointer"
          >
            listes de diffusion
          </Text>
        </Tooltip>{" "}
        traditionnelles. Également libre à vous de l'utiliser comme bon
        vous semble, et de faire des suggestions sur le{" "}
        <Link variant="underline" href="/forum">
          forum
        </Link>{" "}
        ou en{" "}
        <Link
          variant="underline"
          onClick={() => {
            dispatch(setIsContactModalOpen(true));
          }}
        >
          nous écrivant un message
        </Link>
        .
      </Box>
    </Alert>
  */
}

{
  /*
  useEffect(() => {
    setTabsState(
      tabs.map((t) => ({
        ...t,
        checked: true
      }))
    );
  }, [org]);
 */
}
