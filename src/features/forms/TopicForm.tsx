import {
  ChakraProps,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Flex,
  Select,
  Alert,
  AlertIcon,
  Checkbox
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessageText, RTEditor } from "features/common";
import { useAddEventDetailsMutation } from "features/events/eventsApi";
import { useEditTopicMutation } from "features/forum/topicsApi";
import { useAddOrgDetailsMutation } from "features/orgs/orgsApi";
import { useSession } from "hooks/useAuth";
import type { IEvent } from "models/Event";
import type { IOrg } from "models/Org";
import { ITopic, Visibility, VisibilityV } from "models/Topic";
import { handleError } from "utils/form";

interface TopicFormProps extends ChakraProps {
  org?: IOrg;
  event?: IEvent;
  topic: ITopic | null;
  isCreator?: boolean;
  isFollowed?: boolean;
  isSubscribed?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onSubmit?: (topic: ITopic | null) => void;
}

export const TopicForm = ({ org, event, ...props }: TopicFormProps) => {
  const { data: session } = useSession();
  const toast = useToast({ position: "top" });

  const [addOrgDetails, addOrgDetailsMutation] = useAddOrgDetailsMutation();
  const [addEventDetails, addEventDetailsMutation] =
    useAddEventDetailsMutation();
  const [editTopic, editTopicMutation] = useEditTopicMutation();

  const [isLoading, setIsLoading] = useState(false);
  const visibilityOptions: string[] = [];

  if (org && org.orgName !== "aucourant") {
    visibilityOptions.push(Visibility.PUBLIC);

    if (props.isCreator) {
      visibilityOptions.push(Visibility.FOLLOWERS);
      visibilityOptions.push(Visibility.SUBSCRIBERS);
    } else if (props.isSubscribed) {
      visibilityOptions.push(Visibility.SUBSCRIBERS);
    }
  }

  const { control, register, handleSubmit, errors, setError, clearErrors } =
    useForm({
      mode: "onChange"
    });

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: {
    topicName: string;
    topicMessage: string;
    topicVisibility: string;
    topicNotif?: boolean;
  }) => {
    console.log("submitted", form);
    if (!session) return;

    setIsLoading(true);

    const payload = {
      topic: {
        ...form,
        topicMessages: form.topicMessage
          ? [{ message: form.topicMessage, createdBy: session.user.userId }]
          : [],
        org,
        event,
        topicVisibility: !form.topicVisibility
          ? Visibility[Visibility.PUBLIC]
          : form.topicVisibility,
        createdBy: session.user.userId
      }
    };

    try {
      if (props.topic) {
        await editTopic({
          payload: payload.topic,
          topicId: props.topic._id
        }).unwrap();

        toast({
          title: "Votre discussion a bien été modifiée",
          status: "success",
          isClosable: true
        });

        props.onSubmit && props.onSubmit(props.topic);
      } else {
        let topic: ITopic | null = null;

        if (org) {
          topic = await addOrgDetails({
            payload,
            orgUrl: org.orgUrl,
            topicNotif: form.topicNotif
          }).unwrap();
        } else if (event) {
          topic = await addEventDetails({
            payload,
            eventUrl: event.eventUrl,
            topicNotif: form.topicNotif
          }).unwrap();
        }

        toast({
          title: "Votre discussion a bien été ajoutée !",
          status: "success",
          isClosable: true
        });

        props.onSubmit && props.onSubmit(topic);
      }

      props.onClose && props.onClose();
    } catch (error: any) {
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

      <FormControl
        id="topicName"
        isRequired
        isInvalid={!!errors["topicName"]}
        mb={3}
      >
        <FormLabel>Objet de la discussion</FormLabel>
        <Input
          name="topicName"
          placeholder="Objet de la discussion"
          ref={register({
            required: "Veuillez saisir l'objet de la discussion"
          })}
          defaultValue={props.topic ? props.topic.topicName : ""}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="topicName" />
        </FormErrorMessage>
      </FormControl>

      {!props.topic && (
        <FormControl
          id="topicMessage"
          isInvalid={!!errors["topicMessage"]}
          mb={3}
        >
          <FormLabel>Message (optionnel)</FormLabel>
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
      )}

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
            defaultValue={
              props.topic?.topicVisibility || Visibility[Visibility.PUBLIC]
            }
            ref={register({
              required: "Veuillez sélectionner la visibilité de la discussion"
            })}
            placeholder="Sélectionnez la visibilité de la discussion..."
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

      {!props.topic && (props.isCreator || props.isSubscribed) && (
        <Checkbox ref={register()} name="topicNotif" mb={3}>
          Notifier les abonnés
        </Checkbox>
      )}

      <Flex justifyContent="space-between">
        <Button onClick={() => props.onCancel && props.onCancel()}>
          Annuler
        </Button>

        <Button
          colorScheme="green"
          type="submit"
          isLoading={
            isLoading ||
            addOrgDetailsMutation.isLoading ||
            addEventDetailsMutation.isLoading ||
            editTopicMutation.isLoading
          }
          isDisabled={Object.keys(errors).length > 0}
          data-cy="addTopic"
        >
          {props.topic ? "Modifier" : "Ajouter"}
        </Button>
      </Flex>
    </form>
  );
};
