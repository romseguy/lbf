import type { Visibility } from "./EventPage";
import type { IEvent } from "models/Event";
import React from "react";
import { useRouter } from "next/router";
import {
  Box,
  Text,
  Heading,
  useToast,
  IconButton,
  Icon,
  Grid,
  AlertIcon,
  Alert
} from "@chakra-ui/react";
import { useDeleteEventMutation } from "features/events/eventsApi";
import { Button, DeleteButton, Input } from "features/common";
import { EditIcon, WarningIcon } from "@chakra-ui/icons";
import tw, { css } from "twin.macro";
import { EventForm } from "features/forms/EventForm";
import { useState } from "react";
import { EventConfigBannerPanel } from "./EventConfigBannerPanel";

export const EventConfigPanel = ({
  event,
  eventQuery,
  isConfig,
  isEdit,
  isVisible,
  setIsConfig,
  setIsEdit,
  setIsVisible
}: Visibility & {
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
        <Button
          aria-label="Modifier"
          leftIcon={<Icon as={EditIcon} />}
          mr={3}
          onClick={() => {
            setIsEdit(!isEdit);
            setIsVisible({ ...isVisible, banner: false });
          }}
          css={css`
            &:hover {
              ${tw`bg-green-300`}
            }
            ${isEdit && tw`bg-green-300`}
          `}
          data-cy="eventEdit"
        >
          {isEdit ? "Annuler" : "Modifier"}
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
                onChange={(e) =>
                  setIsDisabled(e.target.value !== event.eventName)
                }
              />
            </>
          }
          onClick={async () => {
            try {
              const deletedEvent = await deleteEvent(event.eventName).unwrap();

              if (deletedEvent) {
                await router.push(`/`);
                toast({
                  title: `${deletedEvent.eventName} a bien été supprimé !`,
                  status: "success",
                  isClosable: true
                });
              }
            } catch (error) {
              toast({
                title: error.data ? error.data.message : error.message,
                status: "error",
                isClosable: true
              });
            }
          }}
        />
      </Box>

      {isEdit ? (
        <EventForm
          event={event}
          onCancel={() => setIsEdit(false)}
          onSubmit={async (eventName) => {
            if (event && eventName !== event.eventName) {
              await router.push(`/${encodeURIComponent(eventName)}`);
            } else {
              eventQuery.refetch();
              setIsEdit(false);
              setIsConfig(false);
            }
          }}
        />
      ) : (
        <Grid gridGap={5}>
          <Grid>
            <EventConfigBannerPanel
              event={event}
              eventQuery={eventQuery}
              isVisible={isVisible}
              setIsVisible={setIsVisible}
            />
          </Grid>

          <Grid>
            {/* <EventConfigSubscribersPanel
              event={event}
              eventQuery={eventQuery}
              isVisible={isVisible}
              setIsVisible={setIsVisible}
            /> */}
          </Grid>
        </Grid>
      )}
    </>
  );
};
