import { ChatIcon, EmailIcon, CalendarIcon } from "@chakra-ui/icons";
import { Tabs, useColorMode, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaHome, FaImages } from "react-icons/fa";
import {
  EntityPageDocuments,
  EntityPageTab,
  EntityPageTabList
} from "features/common";
import { IEvent } from "models/Event";
import { normalize } from "utils/string";
import { AppIcon } from "utils/types";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";

import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Flex, TabPanel, TabPanels } from "@chakra-ui/react";
import { css } from "twin.macro";
import {
  AppHeading,
  Button,
  Column,
  EmailPreview,
  EntityButton,
  EntityPageTopics,
  EntityNotified
} from "features/common";
import { EventNotifForm } from "features/forms/EventNotifForm";
import { scrollbarCss } from "features/layout/theme";
import { useSession } from "hooks/useSession";
import { ISubscription } from "models/Subscription";
import { AppQuery, AppQueryWithData } from "utils/types";
import { EventPageHomeTabPanel } from "./EventPageHomeTabPanel";
import { compareAsc, isBefore, parseISO } from "date-fns";

let defaultTabs: { [key: string]: { icon: AppIcon; url: string } } = {
  Accueil: { icon: CalendarIcon, url: "/" },
  Discussions: { icon: ChatIcon, url: "/discussions" },
  Galerie: { icon: FaImages, url: "/galerie" }
};

export const EventPageTabs = ({
  currentItemName,
  currentTabLabel = "Accueil",
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
                else
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
              {tab.url !== "/" && tabLabel}
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
          <EntityPageTopics
            currentTopicName={currentItemName}
            isCreator={isCreator}
            isFollowed={isFollowed}
            query={eventQuery}
            subQuery={subQuery}
          />
        </TabPanel>

        <TabPanel aria-hidden>
          <EntityPageDocuments isCreator={isCreator} query={eventQuery} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

{
  /* {session && isCreator && (
          <TabPanel aria-hidden>
            <AppHeading mb={3}>Invitations</AppHeading>

            <Column {...columnProps}>
              {!showNotifForm && (
                <Flex>
                  <Button
                    as="div"
                    colorScheme="teal"
                    cursor="pointer"
                    leftIcon={<ArrowForwardIcon />}
                    size={isMobile ? "xs" : undefined}
                    onClick={() => {
                      if (!event.isApproved)
                        alert(
                          "L'événement doit être vérifié par un modérateur avant de pouvoir envoyer des invitations."
                        );
                      else setShowNotifForm(!showNotifForm);
                    }}
                  >
                    Envoyer des invitations à{" "}
                    {isMobile ? (
                      "l'événement"
                    ) : (
                      <EntityButton
                        event={event}
                        bg={"whiteAlpha.500"}
                        ml={2}
                        py={isMobile ? 3 : undefined}
                        onClick={null}
                      />
                    )}
                  </Button>
                </Flex>
              )}

               {showNotifForm && (
                    <Flex>
                      <Button
                        colorScheme="teal"
                        leftIcon={<ArrowBackIcon />}
                        onClick={() => setShowNotifForm(false)}
                      >
                        Revenir à la liste des invitations envoyées
                      </Button>
                    </Flex>
                  )} *

              {showNotifForm && (
                <>
                  <AppHeading>Aperçu de l'e-mail d'invitation</AppHeading>
                  <EmailPreview
                    entity={event}
                    event={event}
                    session={session}
                    mt={5}
                  />

                  <EventNotifForm
                    event={event}
                    eventQuery={eventQuery}
                    session={session}
                    onCancel={() => setShowNotifForm(false)}
                    onSubmit={() => setShowNotifForm(false)}
                  />
                </>
              )}
            </Column>

            {!showNotifForm && (
              <>
                <AppHeading my={3}>
                  Historique des invitations envoyées
                </AppHeading>
                <Column {...columnProps}>
                  <EntityNotified entity={event} />
                </Column>
              </>
            )}
          </TabPanel>
        )} */
}
