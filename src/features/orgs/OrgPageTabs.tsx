import { QuestionIcon } from "@chakra-ui/icons";
import {
  Flex,
  Input,
  Switch,
  TabPanel,
  TabPanels,
  Tabs,
  useColorMode
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { css } from "twin.macro";
import {
  Column,
  EntityPageTab,
  EntityPageTabList,
  Heading
} from "features/common";
import { DocumentsList } from "features/documents/DocumentsList";
import { EventsList } from "features/events/EventsList";
import { TopicsList } from "features/forum/TopicsList";
import { ProjectsList } from "features/projects/ProjectsList";
import { defaultTabs, IOrg, IOrgTabWithIcon } from "models/Org";
import { ISubscription } from "models/Subscription";
import { sortOn } from "utils/array";
import { normalize } from "utils/string";
import { AppQuery, AppQueryWithData } from "utils/types";
import { OrgPageHomeTabPanel } from "./OrgPageHomeTabPanel";
import { useEditOrgMutation } from "./orgsApi";

export const OrgPageTabs = ({
  currentItemName,
  currentTabLabel = "Accueil",
  isCreator,
  isFollowed,
  isLogin,
  isSubscribed,
  isMobile,
  orgQuery,
  session,
  setIsEdit,
  setIsLogin,
  subQuery
}: {
  currentItemName?: string;
  currentTabLabel?: string;
  isCreator: boolean;
  isFollowed: boolean;
  isLogin: number;
  isSubscribed: boolean;
  isMobile: boolean;
  orgQuery: AppQueryWithData<IOrg>;
  session: Session | null;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLogin: React.Dispatch<React.SetStateAction<number>>;
  subQuery: AppQuery<ISubscription>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const columnProps = {
    bg: isDark ? "gray.700" : "lightblue"
  };
  const router = useRouter();
  const editOrgMutation = useEditOrgMutation();
  const org = orgQuery.data;

  //#region tabs
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const tabs: IOrgTabWithIcon[] = useMemo(() => {
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

        if (defaultTab) {
          return {
            ...tab,
            ...defaultTab
          };
        }

        return tab;
      });
  }, [org.orgTabs]);
  const [tabsState, setTabsState] = useState<
    (IOrgTabWithIcon & { checked: boolean })[]
  >(tabs.map((t) => ({ ...t, checked: true })));
  useEffect(() => {
    setTabsState(
      tabs.map((t) => ({
        ...t,
        checked: true
      }))
    );
  }, [org]);
  //#endregion

  //#region events tab
  const [title = "Événements des 7 prochains jours", setTitle] = useState<
    string | undefined
  >();
  //#endregion

  //#region componentDidMount
  useEffect(() => {
    tabs.forEach((tab, tabIndex) => {
      if (
        normalize(tab.label) ===
        normalize(currentTabLabel === "parametres" ? "" : currentTabLabel)
      )
        setCurrentTabIndex(tabIndex);
    });
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
      <EntityPageTabList>
        {tabs.map((tab, tabIndex) => {
          return (
            <EntityPageTab
              key={`org-${tab.label}-tab`}
              currentTabIndex={currentTabIndex}
              icon={
                defaultTabs.find(({ label }) => label === tab.label)?.icon ||
                QuestionIcon
              }
              isMobile={isMobile}
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
              data-cy={`orgTab-${normalize(tab.label)}`}
            >
              {isMobile && tab.label === "" ? "Configuration" : tab.label}
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
        {!!tabs.find(({ label }) => label === "Accueil") && (
          <TabPanel aria-hidden>
            <OrgPageHomeTabPanel
              isCreator={isCreator}
              orgQuery={orgQuery}
              subQuery={subQuery}
              setIsEdit={setIsEdit}
            />
          </TabPanel>
        )}

        {!!tabs.find(({ label }) => label === "Discussions") && (
          <TabPanel aria-hidden>
            {/* <Alert status="info" mb={5}>
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
            </Alert> */}

            <Heading mb={3}>Discussions</Heading>

            <Column {...columnProps}>
              <TopicsList
                org={org}
                query={orgQuery}
                mutation={editOrgMutation}
                isCreator={isCreator}
                subQuery={subQuery}
                isFollowed={isFollowed}
                isSubscribed={isSubscribed}
                isLogin={isLogin}
                setIsLogin={setIsLogin}
                currentTopicName={currentItemName}
              />
            </Column>

            {/* {process.env.NODE_ENV === "development" &&
                      session?.user.isAdmin && (
                        <Box mb={5}>
                          <Button
                            onClick={async () => {
                              await editOrg({
                                orgUrl: org.orgUrl,
                                payload: { orgTopics: [] }
                              }).unwrap();
                              orgQuery.refetch();
                            }}
                          >
                            RAZ
                          </Button>
                        </Box>
                      )} */}
          </TabPanel>
        )}

        {!!tabs.find(({ label }) => label === "Événements") && (
          <TabPanel aria-hidden>
            <>
              <Heading mb={3}>{title}</Heading>
              <Column {...columnProps}>
                <EventsList
                  events={org.orgEvents}
                  org={org}
                  orgQuery={orgQuery}
                  isCreator={isCreator}
                  isSubscribed={isSubscribed}
                  isLogin={isLogin}
                  setIsLogin={setIsLogin}
                  setTitle={setTitle}
                />
              </Column>
            </>
          </TabPanel>
        )}

        {!!tabs.find(({ label }) => label === "Projets") && (
          <TabPanel aria-hidden>
            <Heading mb={3}>Projets</Heading>

            <Column {...columnProps}>
              <ProjectsList
                org={org}
                orgQuery={orgQuery}
                subQuery={subQuery}
                isCreator={isCreator}
                isFollowed={isFollowed}
                isSubscribed={isSubscribed}
                isLogin={isLogin}
                setIsLogin={setIsLogin}
              />
            </Column>
          </TabPanel>
        )}

        {!!tabs.find(({ label }) => label === "Galerie") && (
          <TabPanel aria-hidden>
            <Heading mb={3}>Galerie</Heading>

            <Column {...columnProps}>
              <DocumentsList
                org={org}
                isCreator={isCreator}
                isSubscribed={isSubscribed}
                isLogin={isLogin}
                setIsLogin={setIsLogin}
              />
            </Column>
          </TabPanel>
        )}

        {session && isCreator && (
          <TabPanel aria-hidden>
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

                        await editOrgMutation[0]({
                          orgUrl: org.orgUrl,
                          payload: { orgTabs }
                        });
                        orgQuery.refetch();
                      }}
                    />
                    <Input
                      defaultValue={defaultTab.label}
                      isDisabled={defaultTabs
                        .map(({ label }) => label)
                        .includes(defaultTab.label)}
                      onChange={(e) => {
                        let changed = false;
                        const newTabs = tabsState.map((t) => {
                          if (t.label === defaultTab.label) {
                            if (e.target.value !== t.label) changed = true;
                            return {
                              ...t,
                              label: e.target.value
                            };
                          }
                          return t;
                        });

                        if (changed) setTabsState(newTabs);
                      }}
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
