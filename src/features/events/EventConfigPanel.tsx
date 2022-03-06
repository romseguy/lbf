import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Text, useToast, Icon, Input } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  Column,
  DeleteButton,
  EntityConfigBannerPanel,
  EntityConfigLogoPanel,
  EntityConfigStyles,
  Heading
} from "features/common";
import { useDeleteEventMutation } from "features/events/eventsApi";
import { EventForm } from "features/forms/EventForm";
import { refetchOrg } from "features/orgs/orgSlice";
import { IEvent } from "models/Event";
import { useAppDispatch } from "store";
import { AppQueryWithData } from "utils/types";

export type EventConfigVisibility = {
  isVisible: {
    banner?: boolean;
    logo?: boolean;
  };
  setIsVisible: (obj: EventConfigVisibility["isVisible"]) => void;
};

export const EventConfigPanel = ({
  session,
  eventQuery,
  isConfig,
  isEdit,
  isVisible,
  setIsConfig,
  setIsEdit,
  setIsVisible
}: EventConfigVisibility & {
  session: Session;
  eventQuery: AppQueryWithData<IEvent>;
  isConfig: boolean;
  isEdit: boolean;
  setIsConfig: (isConfig: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const toast = useToast({ position: "top" });
  const event = eventQuery.data;
  const [deleteEvent, deleteQuery] = useDeleteEventMutation();
  const [isDisabled, setIsDisabled] = useState(true);

  return (
    <>
      <Box mb={3}>
        {isConfig && !isEdit && (
          <>
            <Button
              colorScheme="teal"
              leftIcon={<Icon as={isEdit ? ArrowBackIcon : EditIcon} />}
              mr={3}
              onClick={() => {
                setIsEdit(true);
                setIsVisible({ banner: false, logo: false });
              }}
              data-cy="eventEdit"
            >
              Modifier
            </Button>

            <DeleteButton
              isDisabled={isDisabled}
              isLoading={deleteQuery.isLoading}
              header={
                <>
                  Vous êtes sur le point de supprimer l'événement
                  <Text display="inline" color="red" fontWeight="bold">
                    {` ${event.eventName}`}
                  </Text>
                </>
              }
              body={
                <>
                  Saisissez le nom de l'événement pour confimer sa suppression :
                  <Input
                    autoComplete="off"
                    onChange={(e) =>
                      setIsDisabled(e.target.value !== event.eventName)
                    }
                  />
                </>
              }
              onClick={async () => {
                try {
                  const deletedEvent = await deleteEvent({
                    eventUrl: event.eventUrl
                  }).unwrap();

                  if (deletedEvent) {
                    dispatch(refetchOrg());
                    await router.push(`/`);
                    toast({
                      title: `${deletedEvent.eventName} a été supprimé !`,
                      status: "success"
                    });
                  }
                } catch (error: any) {
                  toast({
                    title: error.data ? error.data.message : error.message,
                    status: "error"
                  });
                }
              }}
            />
          </>
        )}
      </Box>

      {isEdit && (
        <Column m="">
          <EventForm
            session={session}
            event={event}
            onCancel={() => {
              setIsEdit(false);
              setIsConfig(true);
            }}
            onSubmit={async (eventUrl: string) => {
              setIsConfig(false);
              setIsEdit(false);
              if (eventUrl !== event.eventUrl)
                await router.push(`/${eventUrl}`, `/${eventUrl}`, {
                  shallow: true
                });
              else {
                eventQuery.refetch();
              }
            }}
          />
        </Column>
      )}

      {isConfig && !isEdit && (
        <Column m="">
          <Heading mb={1} mt={3}>
            Apparence
          </Heading>

          <EntityConfigStyles query={eventQuery} my={3} />

          <EntityConfigLogoPanel
            query={eventQuery}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            mb={3}
          />

          <EntityConfigBannerPanel
            query={eventQuery}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
          />
        </Column>
      )}
    </>
  );
};
