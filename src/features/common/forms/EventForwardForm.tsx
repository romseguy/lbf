import { ErrorMessage } from "@hookform/error-message";
import {
  FormControl,
  FormErrorMessage,
  Spinner,
  Button,
  Flex,
  Alert,
  AlertIcon,
  useToast,
  FormLabel
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import { useSession } from "hooks/useAuth";
import { ErrorMessageText } from "features/common";
import {
  useAddEventMutation,
  useGetEventQuery
} from "features/events/eventsApi";
import { useGetOrgsQuery } from "features/orgs/orgsApi";
import type { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { handleError } from "utils/form";

export const EventForwardForm = ({
  ...props
}: {
  event: IEvent;
  onCancel?: () => void;
  onClose: () => void;
  onSubmit?: () => void;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const toast = useToast({ position: "top" });

  const [addEvent, addEventMutation] = useAddEventMutation();
  //const { data: forwardedEvent } = useGetEventQuery({eventUrl: props.event._id})

  const [isLoading, setIsLoading] = useState(false);

  //#region form state
  const { control, errors, handleSubmit, setError, clearErrors } = useForm();
  const {
    data: orgs,
    isLoading: isQueryLoading,
    refetch: refetchOrgs
  } = useGetOrgsQuery({
    populate: "orgSubscriptions orgEvents",
    createdBy: session?.user.userId
  });

  const myOrgs = orgs?.filter(
    (org) =>
      org.orgName !== "aucourant" &&
      !org.orgEvents.find(
        (orgEvent) =>
          props.event._id === orgEvent._id ||
          orgEvent.forwardedFrom?.eventId === props.event._id
      )
  );
  useEffect(() => {
    refetchOrgs();
  }, [router.asPath]);

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

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
        createdBy: session?.user.userId
      });

      toast({
        title: "L'événement a bien été rediffusé !",
        status: "success",
        isClosable: true
      });

      refetchOrgs();
      props.onSubmit && props.onSubmit();
    } catch (error) {
      handleError(error, (message, field) => {
        if (field) {
          setError(field, { type: "manual", message });
        } else {
          setError("formErrorMessage", { type: "manual", message });
        }
      });
    } finally {
      setIsLoading(false);
    }
  };
  //#endregion

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
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
        <FormControl mb={3} id="orgs" isInvalid={!!errors.orgs} isRequired>
          <FormLabel>Organisations où l'événement sera rediffusé</FormLabel>
          <Controller
            name="orgs"
            rules={{
              required: "Veuillez sélectionner une ou plusieurs organisations"
            }}
            as={ReactSelect}
            control={control}
            defaultValue={null}
            placeholder="Sélectionner une ou plusieurs organisations"
            menuPlacement="bottom"
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
      )}

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
    </form>
  );
};
