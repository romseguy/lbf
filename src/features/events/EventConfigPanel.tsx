import { useRouter } from "next/router";
import React from "react";
import {
  Column,
  EntityConfigBannerPanel,
  EntityConfigCategoriesPanel,
  EntityConfigLogoPanel,
  EntityConfigStyles,
  AppHeading
} from "features/common";
import { EventForm } from "features/forms/EventForm";
import { IEvent } from "models/Event";
import { Session } from "utils/auth";
import { AppQueryWithData } from "utils/types";
import { EventConfigButtons } from "./EventConfigButtons";
import { useSelector } from "react-redux";
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
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const event = eventQuery.data;

  return (
    <>
      {isEdit && (
        <Column>
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
      )}

      {!isEdit && (
        <>
          <EventConfigButtons
            isEdit={isEdit}
            isVisible={isVisible}
            eventQuery={eventQuery}
            setIsEdit={setIsEdit}
            toggleVisibility={toggleVisibility}
          />

          <Column mb={3} pt={1}>
            <AppHeading mb={1}>Apparence</AppHeading>

            <EntityConfigStyles query={eventQuery} mb={3} />

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

          <Column pt={1}>
            <AppHeading>Discussions</AppHeading>

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
