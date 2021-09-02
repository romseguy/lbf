import type { IEvent } from "models/Event";
import React, { useState } from "react";
import ReactSelect from "react-select";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ModalProps,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Spinner,
  Button,
  Flex,
  Alert,
  AlertIcon,
  useToast
} from "@chakra-ui/react";
import { useGetOrgsQuery } from "features/orgs/orgsApi";
import { AppSession } from "hooks/useAuth";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { IOrg } from "models/Org";
import { useAppDispatch } from "store";
import { useAddEventMutation } from "features/events/eventsApi";
import { handleError } from "utils/form";
import { ErrorMessageText } from "features/common";
import { useRouter } from "next/router";

export const ForwardModal = ({
  defaultIsOpen,
  isOpen,
  ...props
}: {
  session: AppSession;
  event: IEvent;
  defaultIsOpen: boolean;
  isOpen: boolean;
  // isCreator?: boolean;
  // isFollowed?: boolean;
  // isSubscribed?: boolean;
  onCancel?: () => void;
  onClose: () => void;
  onSubmit?: () => void;
}) => {
  const toast = useToast({ position: "top" });
  const [addEvent, addEventMutation] = useAddEventMutation();
  const { /* isOpen, onOpen, */ onClose } = useDisclosure({ defaultIsOpen });
  const [isLoading, setIsLoading] = useState(false);
  const { myOrgs, isLoading: isQueryLoading } = useGetOrgsQuery(
    "orgSubscriptions orgEvents",
    {
      selectFromResult: ({ data, ...rest }): any => {
        if (!data) return { myOrgs: [] };
        return {
          ...rest,
          myOrgs: data
            .filter((org) => {
              return typeof org.createdBy === "object"
                ? org.createdBy._id === props.session.user.userId
                : org.createdBy === props.session.user.userId;
            })
            .filter((org) => {
              if (
                org.orgEvents.find(
                  (orgEvent) => orgEvent._id === props.event._id
                )
              ) {
                return false;
              }

              return true;
            })
        };
      }
    }
  );

  const { control, errors, handleSubmit, setError } = useForm();

  const onSubmit = async ({ orgs }: { orgs: IOrg[] }) => {
    try {
      setIsLoading(true);

      await addEvent({
        ...props.event,
        _id: undefined,
        eventName: props.event._id,
        forwardedFrom: {
          eventId: props.event._id
        },
        eventOrgs: orgs,
        createdBy: props.session.user.userId
      });

      toast({
        title: "L'événement a bien été rediffusé !",
        status: "success",
        isClosable: true
      });

      setIsLoading(false);
      props.onSubmit && props.onSubmit();
    } catch (error) {
      handleError(error, (message, field) => {
        if (field) {
          setError(field, { type: "manual", message });
        } else {
          setError("formErrorMessage", { type: "manual", message });
        }
      });
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        props.onClose && props.onClose();
        onClose();
      }}
      closeOnOverlayClick={false}
    >
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            Rediffuser l'événement : {props.event.eventName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ErrorMessage
                errors={errors}
                name="formErrorMessage"
                render={({ message }) => (
                  <Alert status="error" mb={3}>
                    <AlertIcon />
                    <ErrorMessageText>{message}</ErrorMessageText>
                  </Alert>
                )}
              />

              {isQueryLoading ? (
                <Spinner />
              ) : (
                <>
                  <FormControl
                    mb={3}
                    id="orgs"
                    // isInvalid={!!errors["eventOrgs"]}
                    // isRequired={eventOrgsRules.required}
                  >
                    <Controller
                      name="orgs"
                      rules={{ required: true }}
                      as={ReactSelect}
                      control={control}
                      defaultValue={[]}
                      placeholder="Sélectionner une organisation..."
                      menuPlacement="top"
                      isClearable
                      isMulti
                      isSearchable
                      closeMenuOnSelect
                      styles={{
                        placeholder: () => {
                          return {
                            color: "#A0AEC0"
                          };
                        },
                        control: (defaultStyles: any) => {
                          return {
                            ...defaultStyles,
                            borderColor: "#e2e8f0",
                            paddingLeft: "8px"
                          };
                        }
                      }}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      options={myOrgs}
                      getOptionLabel={(option: IOrg) => `${option.orgName}`}
                      getOptionValue={(option: IOrg) => option._id}
                      onChange={([option]: [option: IOrg]) => option._id}
                    />
                    <FormErrorMessage>
                      <ErrorMessage errors={errors} name="orgs" />
                    </FormErrorMessage>
                  </FormControl>

                  <Flex justifyContent="space-between">
                    <Button onClick={() => props.onCancel && props.onCancel()}>
                      Annuler
                    </Button>
                    <Button
                      colorScheme="green"
                      type="submit"
                      isLoading={isLoading}
                      isDisabled={Object.keys(errors).length > 0}
                    >
                      Rediffuser
                    </Button>
                  </Flex>
                </>
              )}
            </form>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
