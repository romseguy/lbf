import type { IEvent } from "models/Event";
import React, { useState } from "react";
import ReactSelect from "react-select";
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
import { useGetOrgsQuery } from "features/orgs/orgsApi";
import { useSession } from "hooks/useAuth";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { IOrg } from "models/Org";
import { useAddEventMutation } from "features/events/eventsApi";
import { handleError } from "utils/form";
import { ErrorMessageText } from "features/common";

export const EventForwardForm = ({
  ...props
}: {
  event: IEvent;
  onCancel?: () => void;
  onClose: () => void;
  onSubmit?: () => void;
}) => {
  const { data: session } = useSession();
  const toast = useToast({ position: "top" });
  const [addEvent, addEventMutation] = useAddEventMutation();

  const [isLoading, setIsLoading] = useState(false);

  //#region form state
  const { control, errors, handleSubmit, setError, clearErrors } = useForm();
  const { data, isLoading: isQueryLoading } = useGetOrgsQuery({
    populate: "orgSubscriptions orgEvents",
    createdBy: session?.user.userId
  });
  const myOrgs = data?.filter((org) => {
    if (org.orgEvents.find((orgEvent) => orgEvent._id === props.event._id)) {
      return false;
    }

    return true;
  });
  //#endregion

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
          <FormLabel>Organisations</FormLabel>
          <Controller
            name="orgs"
            rules={{
              required: "Veuillez sélectionner une ou plusieurs organisations"
            }}
            as={ReactSelect}
            control={control}
            defaultValue={null}
            placeholder="Sélectionner une ou plusieurs organisations"
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
