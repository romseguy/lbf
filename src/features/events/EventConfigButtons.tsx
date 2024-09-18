import { ArrowBackIcon, EditIcon, Icon, SettingsIcon } from "@chakra-ui/icons";
import { Flex, FlexProps, Input, Text } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, DeleteButton } from "features/common";
import { IEvent } from "models/Event";
import { AppQueryWithData } from "utils/types";
import { useDeleteEventMutation } from "features/api/eventsApi";
import { EventConfigVisibility } from "./EventConfigPanel";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";
import { getErrorMessageString } from "utils/query";

export const EventConfigButtons = ({
  eventQuery,
  isConfig,
  setIsConfig,
  isEdit,
  setIsEdit,
  toggleVisibility,
  ...props
}: FlexProps &
  Omit<EventConfigVisibility, "isVisible"> & {
    eventQuery: AppQueryWithData<IEvent>;
    isConfig: boolean;
    setIsConfig: (isConfig: boolean) => void;
    isEdit: boolean;
    setIsEdit: (isEdit: boolean) => void;
  }) => {
  const [deleteEvent, deleteQuery] = useDeleteEventMutation();
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const toast = useToast({ position: "top" });
  const event = eventQuery.data;
  const [isDisabled, setIsDisabled] = useState(true);

  return (
    <Flex
      flexDirection={isMobile ? "column" : "row"}
      mb={!isMobile ? 3 : 0}
      {...props}
    >
      {!isConfig && (
        <Flex my={isMobile ? 3 : 0}>
          <Button
            colorScheme="teal"
            leftIcon={<Icon as={isEdit ? ArrowBackIcon : EditIcon} />}
            mr={3}
            onClick={() => {
              setIsConfig(false);
              setIsEdit(!isEdit);
              toggleVisibility();
            }}
            data-cy="eventEdit"
          >
            {!isEdit ? "Modifier" : "Retour"}
          </Button>
        </Flex>
      )}

      {!isEdit && (
        <Flex mb={isMobile ? 3 : 0}>
          <Button
            colorScheme="orange"
            leftIcon={<Icon as={isConfig ? ArrowBackIcon : SettingsIcon} />}
            mr={3}
            onClick={() => {
              setIsEdit(false);
              setIsConfig(!isConfig);
            }}
          >
            {!isConfig ? "Paramètres" : "Retour"}
          </Button>
        </Flex>
      )}

      {!isConfig && !isEdit && (
        <Flex mb={isMobile ? 3 : 0}>
          <DeleteButton
            isDisabled={isDisabled}
            isLoading={deleteQuery.isLoading}
            label="Supprimer"
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
                  title: getErrorMessageString(
                    error,
                    "L'événement n'a pas pu être supprimé"
                  ),
                  status: "error"
                });
              }
            }}
          />
        </Flex>
      )}
    </Flex>
  );
};
