import { EditIcon, SettingsIcon } from "@chakra-ui/icons";
import { Icon, Text, useColorMode } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import {
  AppHeading,
  Column,
  EntityConfigBannerPanel,
  EntityConfigCategoriesPanel,
  EntityConfigLogoPanel
} from "features/common";
import { EventForm } from "features/forms/EventForm";
import { IEvent } from "models/Event";
import { Session } from "utils/auth";
import { AppQueryWithData } from "utils/types";
import { EventConfigButtons } from "./EventConfigButtons";
import { selectIsMobile } from "store/uiSlice";
import { EEntityCategoryKey } from "models/Entity";

export type EventConfigVisibility = {
  isVisible: Record<string, boolean>;
  toggleVisibility: (
    key?: keyof EventConfigVisibility["isVisible"],
    bool?: boolean
  ) => void;
};

export const EventConfigPanel = ({
  session,
  eventQuery,
  isEdit,
  isVisible,
  setIsConfig,
  setIsEdit,
  toggleVisibility
}: EventConfigVisibility & {
  session: Session;
  eventQuery: AppQueryWithData<IEvent>;
  isEdit: boolean;
  setIsConfig: (isConfig: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const event = eventQuery.data;

  return (
    <>
      {!isEdit && (
        <>
          <AppHeading mx={3} mb={3}>
            <Icon
              as={SettingsIcon}
              color={isDark ? "white" : "black"}
              boxSize={10}
              mb={1}
              mr={3}
            />
            Paramètres de l'événement
          </AppHeading>
        </>
      )}

      {isEdit && (
        <>
          <AppHeading mx={3} mb={3}>
            <Icon
              as={EditIcon}
              color={isDark ? "white" : "black"}
              boxSize={10}
              mb={1}
              mr={3}
            />
            Modifier l'événement
          </AppHeading>

          <Column mx={3}>
            <EventForm
              session={session}
              event={event}
              onCancel={() => {
                setIsEdit(false);
                setIsConfig(true);
              }}
              onSubmit={async (eventUrl: string) => {
                if (eventUrl !== event.eventUrl)
                  await router.push(`/${eventUrl}`, `/${eventUrl}`, {
                    shallow: true
                  });
                else {
                  setIsEdit(false);
                  setIsConfig(false);
                }
              }}
            />
          </Column>
        </>
      )}

      {!isEdit && (
        <>
          <Column mx={3} mb={3} pt={1}>
            <Text fontSize="3xl" mb={3}>
              Apparence
            </Text>

            {/* <EntityConfigStyles query={eventQuery} mb={3} /> */}

            <EntityConfigLogoPanel
              query={eventQuery}
              isVisible={isVisible}
              toggleVisibility={toggleVisibility}
              mb={3}
            />

            <EntityConfigBannerPanel
              query={eventQuery}
              isVisible={isVisible}
              toggleVisibility={toggleVisibility}
            />
          </Column>

          <Column mx={3} pt={1}>
            <Text fontSize="3xl" mb={3}>
              Discussions
            </Text>

            <EntityConfigCategoriesPanel
              categories={event.eventTopicCategories}
              categoryKey={EEntityCategoryKey.eventTopicCategories}
              query={eventQuery}
              isVisible={isVisible}
              toggleVisibility={toggleVisibility}
              mb={3}
            />
          </Column>
        </>
      )}
    </>
  );
};
