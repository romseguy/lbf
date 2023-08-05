import { ArrowBackIcon, EditIcon, Icon } from "@chakra-ui/icons";
import { Flex, Input, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, DeleteButton } from "features/common";
import { IEvent } from "models/Event";
import { AppQueryWithData } from "utils/types";
import {
  useDeleteEventMutation,
  useEditEventMutation
} from "features/api/eventsApi";
import { EventConfigVisibility } from "./EventConfigPanel";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";

export const EventConfigButtons = ({
  isEdit,
  eventQuery,
  setIsEdit,
  toggleVisibility
}: EventConfigVisibility & {
  isEdit: boolean;
  eventQuery: AppQueryWithData<IEvent>;
  setIsEdit: (isEdit: boolean) => void;
}) => {
  const [deleteEvent, deleteQuery] = useDeleteEventMutation();
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const toast = useToast({ position: "top" });
  const event = eventQuery.data;
  const [isDisabled, setIsDisabled] = useState(true);

  return (
    <Flex flexDirection={isMobile ? "column" : "row"}>
      <Flex mb={isMobile ? 3 : 3}>
        <Button
          colorScheme="teal"
          leftIcon={<Icon as={isEdit ? ArrowBackIcon : EditIcon} />}
          mr={3}
          onClick={() => {
            setIsEdit(true);
            toggleVisibility();
          }}
          data-cy="eventEdit"
        >
          Modifier
        </Button>
      </Flex>

      <Flex mb={isMobile ? 3 : 0}>
        <DeleteButton
          isDisabled={isDisabled}
          isLoading={deleteQuery.isLoading}
          label="Supprimer l'événement"
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
                eventId: event._id
              }).unwrap();

              if (deletedEvent) {
                await router.push(`/`);
                toast({
                  title: `L'événement ${deletedEvent.eventName} a été supprimé !`,
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
      </Flex>
    </Flex>
  );
};
