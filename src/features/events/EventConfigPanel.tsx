import { useRouter } from "next/router";
import React from "react";
import {
  Column,
  EntityConfigBannerPanel,
  EntityConfigCategoriesPanel,
  EntityConfigLogoPanel,
  EntityConfigStyles,
  Heading
} from "features/common";
import { EventForm } from "features/forms/EventForm";
import { IEvent } from "models/Event";
import { Session } from "utils/auth";
import { AppQueryWithData, TypedMap } from "utils/types";

export type EventConfigVisibility = {
  isVisible: TypedMap<string, boolean>;
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
              localStorage.removeItem("storageKey");

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
          <Column mb={3} pt={1}>
            <Heading mb={1}>Apparence</Heading>

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
            <Heading>Discussions</Heading>

            <EntityConfigCategoriesPanel
              fieldName="eventTopicCategories"
              categories={event.eventTopicCategories}
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
