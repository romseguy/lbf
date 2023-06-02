import {
  CalendarIcon,
  ChatIcon,
  QuestionIcon,
  SettingsIcon
} from "@chakra-ui/icons";
import {
  Button,
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
import React, { useEffect, useMemo, useState } from "react";
import { FaImages, FaTools } from "react-icons/fa";
import { css } from "twin.macro";
import { useEditOrgMutation } from "features/api/orgsApi";
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
import { defaultTabs, IOrg, IOrgTabWithIcon, orgTypeFull } from "models/Org";
import { ISubscription } from "models/Subscription";
import { sortOn } from "utils/array";
import { Session } from "utils/auth";
import { normalize } from "utils/string";
import { AppQuery, AppQueryWithData } from "utils/types";
import { IsEditConfig } from "./OrgPage";
import { OrgPageHomeTabPanel } from "./OrgPageHomeTabPanel";

export const OrgPageTabs = ({
  currentItemName,
  currentTabLabel = "Accueil",
  isCreator,
  isFollowed,
  isMobile,
  orgQuery,
  session,
  setIsConfig,
  setIsEdit,
  subQuery
}: {
  currentItemName?: string;
  currentTabLabel?: string;
  isCreator: boolean;
  isFollowed: boolean;
  isMobile: boolean;
  orgQuery: AppQueryWithData<IOrg>;
  session: Session | null;
  setIsConfig: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEdit: (arg: boolean | IsEditConfig) => void;
  subQuery: AppQuery<ISubscription>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const columnProps = {
    bg: isDark ? "gray.700" : "lightblue"
  };
  const router = useRouter();
  const [editOrg] = useEditOrgMutation();
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
  }, [router.asPath]);
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
          const key = `org-${normalize(tab.label)}-tab`;

          return (
            <EntityPageTab
              key={key}
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
              data-cy={key}
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
              isMobile={isMobile}
              orgQuery={orgQuery}
              session={session}
              setIsEdit={setIsEdit}
              subQuery={subQuery}
            />
          </TabPanel>
        )}

        {!!tabs.find(({ label }) => label === "Discussions") && (
          <TabPanel aria-hidden>
            <Flex>
              <ChatIcon boxSize={6} mr={3} mt={3} />
              <Heading noContainer mb={3}>
                Discussions
              </Heading>
            </Flex>

            <Column {...columnProps}>
              <TopicsList
                query={orgQuery}
                isCreator={isCreator}
                subQuery={subQuery}
                isFollowed={isFollowed}
                currentTopicName={currentItemName}
              />
            </Column>
          </TabPanel>
        )}

        {!!tabs.find(({ label }) => label === "Événements") && (
          <TabPanel aria-hidden>
            <Flex>
              <CalendarIcon boxSize={6} mr={3} mt={3} />
              <Heading noContainer mb={3}>
                {title}
              </Heading>
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
            <Flex>
              <Icon as={FaTools} boxSize={6} mr={3} mt={3} />
              <Heading noContainer mb={3}>
                Projets
              </Heading>
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
            <Flex>
              <Icon as={FaImages} boxSize={6} mr={3} mt={3} />
              <Heading noContainer mb={3}>
                Galerie
              </Heading>
            </Flex>

            <Column {...columnProps}>
              <DocumentsList
                org={org}
                isCreator={isCreator}
                isMobile={isMobile}
              />
            </Column>
          </TabPanel>
        )}

        {session && isCreator && (
          <TabPanel aria-hidden>
            <Heading mb={3}>Fonctionnalités {orgTypeFull(org.orgType)}</Heading>

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

{
  /*
    {process.env.NODE_ENV === "development" &&
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
