import type { IEvent } from "models/Event";
import type { IOrg } from "models/Org";
import type { ITopic } from "models/Topic";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import {
  ChakraProps,
  Input,
  Button,
  FormControl,
  FormLabel,
  Box,
  Stack,
  FormErrorMessage,
  useToast,
  Flex,
  Select,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { ErrorMessageText, RTEditor } from "features/common";
import { useSession } from "hooks/useAuth";
import { Visibility, VisibilityV } from "models/Topic";
import { handleError } from "utils/form";
import { useAddOrgDetailsMutation } from "features/orgs/orgsApi";
import { useAddEventDetailsMutation } from "features/events/eventsApi";

interface TopicFormProps extends ChakraProps {
  org?: IOrg;
  event?: IEvent;
  topic?: ITopic;
  isCreator?: boolean;
  isFollowed?: boolean;
  isSubscribed?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onSubmit?: (topicName: string) => void;
}

export const TopicForm = (props: TopicFormProps) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [addOrgDetails, addOrgDetailsMutation] = useAddOrgDetailsMutation();
  const [addEventDetails, addEventDetailsMutation] =
    useAddEventDetailsMutation();
  const toast = useToast({ position: "top" });
  const visibilityOptions = [];

  if (props.org && props.org.orgName !== "aucourant") {
    visibilityOptions.push(Visibility.PUBLIC);

    if (props.isCreator) {
      visibilityOptions.push(Visibility.FOLLOWERS);
      visibilityOptions.push(Visibility.SUBSCRIBERS);
    } else if (props.isSubscribed) {
      visibilityOptions.push(Visibility.SUBSCRIBERS);
    }
  }

  const {
    control,
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    watch,
    setValue,
    getValues
  } = useForm({
    mode: "onChange"
  });

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: {
    topicName: string;
    topicMessage: string;
  }) => {
    console.log("submitted", form);
    let topic: ITopic | undefined = undefined;

    if (!props.topic) {
      topic = {
        ...form,
        topicMessages: form.topicMessage
          ? [{ message: form.topicMessage, createdBy: session.user.userId }]
          : [],
        createdBy: session.user.userId
      };
    }

    const payload = {
      topic
    };

    try {
      if (props.org) {
        await addOrgDetails({ payload, orgName: props.org.orgName }).unwrap();
      } else if (props.event) {
        await addEventDetails({
          payload,
          eventName: props.event.eventName
        }).unwrap();
      }

      toast({
        title: "Votre sujet de discussion a bien été ajouté !",
        status: "success",
        isClosable: true
      });

      props.onSubmit && props.onSubmit(form.topicName);
      props.onClose && props.onClose();
    } catch (error) {
      handleError(error, (message, field) => {
        if (field) {
          setError(field, { type: "manual", message });
        } else {
          setError("formErrorMessage", { type: "manual", message });
        }
      });
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

      <FormControl
        id="topicName"
        isRequired
        isInvalid={!!errors["topicName"]}
        mb={3}
      >
        <FormLabel>Titre du sujet de discussion</FormLabel>
        <Input
          name="topicName"
          placeholder="Cliquez ici pour saisir le titre..."
          ref={register({
            required: "Veuillez saisir le titre du sujet de discussion"
          })}
          defaultValue={props.topic && props.topic.topicName}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="topicName" />
        </FormErrorMessage>
      </FormControl>

      <FormControl
        id="topicMessage"
        isInvalid={!!errors["topicMessage"]}
        mb={3}
      >
        <FormLabel>Message (facultatif)</FormLabel>
        <Controller
          name="topicMessage"
          control={control}
          defaultValue={""}
          render={(p) => {
            return (
              <RTEditor
                defaultValue={""}
                onChange={p.onChange}
                placeholder="Contenu de votre message"
              />
            );
          }}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="topicMessage" />
        </FormErrorMessage>
      </FormControl>

      {visibilityOptions.length > 0 && (
        <FormControl
          id="topicVisibility"
          isRequired
          isInvalid={!!errors["topicVisibility"]}
          mb={3}
        >
          <FormLabel>Visibilité</FormLabel>
          <Select
            name="topicVisibility"
            ref={register({
              required:
                "Veuillez sélectionner la visibilité du sujet de discussion"
            })}
            placeholder="Sélectionnez la visibilité du sujet de discussion..."
            color="gray.400"
          >
            {visibilityOptions.map((key) => {
              return (
                <option key={key} value={key}>
                  {VisibilityV[key]}
                </option>
              );
            })}
          </Select>
          <FormErrorMessage>
            <ErrorMessage errors={errors} name="topicVisibility" />
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
          isLoading={isLoading || addOrgDetailsMutation.isLoading}
          isDisabled={Object.keys(errors).length > 0}
        >
          {props.topic ? "Modifier" : "Ajouter"}
        </Button>
      </Flex>
    </form>
  );
};
