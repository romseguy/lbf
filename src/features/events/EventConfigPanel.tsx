import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Text, useToast, Icon, Input } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import tw, { css } from "twin.macro";
import { DeleteButton, PageContainer } from "features/common";
import { useDeleteEventMutation } from "features/events/eventsApi";
import { EventForm } from "features/forms/EventForm";
import { IEvent } from "models/Event";
import { EventConfigBannerPanel } from "./EventConfigBannerPanel";
import { EventConfigLogoPanel } from "./EventConfigLogoPanel";
import { Visibility } from "./EventPage";

export const EventConfigPanel = ({
  session,
  event,
  eventQuery,
  isConfig,
  isEdit,
  isVisible,
  setIsConfig,
  setIsEdit,
  setIsVisible
}: Visibility & {
  session: Session;
  event: IEvent;
  eventQuery: any;
  isConfig: boolean;
  isEdit: boolean;
  setIsConfig: (isConfig: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
}) => {
  const router = useRouter();
  const toast = useToast({ position: "top" });
  const [deleteEvent, deleteQuery] = useDeleteEventMutation();
  const [isDisabled, setIsDisabled] = useState(true);

  return (
    <>
      <Box mb={3}>
        {isConfig && !isEdit && (
          <>
            <Button
              aria-label="Modifier"
              leftIcon={<Icon as={isEdit ? ArrowBackIcon : EditIcon} />}
              mr={3}
              onClick={() => {
                setIsEdit(true);
                setIsVisible({ banner: false, logo: false });
              }}
              css={css`
                &:hover {
                  ${tw`bg-green-300`}
                }
              `}
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
                    await router.push(`/`);
                    toast({
                      title: `${deletedEvent.eventName} a bien été supprimé !`,
                      status: "success",
                      isClosable: true
                    });
                  }
                } catch (error: any) {
                  toast({
                    title: error.data ? error.data.message : error.message,
                    status: "error",
                    isClosable: true
                  });
                }
              }}
            />
          </>
        )}
      </Box>

      {isEdit && (
        <PageContainer>
          <EventForm
            session={session}
            event={event}
            onCancel={() => {
              setIsEdit(false);
              setIsConfig(true);
            }}
            onSubmit={async (eventUrl: string) => {
              if (event && eventUrl !== event.eventUrl) {
                await router.push(`/${eventUrl}`, `/${eventUrl}`, {
                  shallow: true
                });
              } else {
                eventQuery.refetch();
                setIsEdit(false);
              }
            }}
          />
        </PageContainer>
      )}

      {isConfig && !isEdit && (
        <>
          <EventConfigLogoPanel
            event={event}
            eventQuery={eventQuery}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            mb={3}
          />

          <EventConfigBannerPanel
            event={event}
            eventQuery={eventQuery}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            mb={3}
          />
        </>
      )}
    </>
  );
};
