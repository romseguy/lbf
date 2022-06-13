import {
  ChakraProps,
  Button,
  FormControl,
  FormErrorMessage,
  useToast,
  Flex,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessageText, RTEditor } from "features/common";
import { useAddTopicMutation } from "features/forum/topicsApi";
import { useSession } from "hooks/useAuth";
import { useLeaveConfirm } from "hooks/useLeaveConfirm";
import useFormPersist from "react-hook-form-persist";
import { isEvent } from "models/Entity";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { ITopic } from "models/Topic";
import { ITopicMessage } from "models/TopicMessage";
import { handleError } from "utils/form";
import { AppQueryWithData } from "utils/types";

interface TopicMessageFormProps extends ChakraProps {
  formats?: string[];
  isDisabled?: boolean;
  query: AppQueryWithData<IEvent | IOrg>;
  topic: ITopic;
  topicMessage?: ITopicMessage;
  onLoginClick: () => void;
  onCancel?: () => void;
  onSubmit?: (topicMessageName: string) => void;
}

export const TopicMessageForm = ({
  isDisabled,
  query,
  ...props
}: TopicMessageFormProps) => {
  const { data: session } = useSession();
  const toast = useToast({ position: "top" });
  const event = isEvent(query.data) ? query.data : undefined;
  const org = isEvent(query.data) ? undefined : query.data;

  const [addTopic, addTopicMutation] = useAddTopicMutation();

  //#region local state
  const [isLoading, setIsLoading] = useState(false);
  const [topicMessageDefaultValue, setTopicMessageDefaultValue] = useState<
    string | undefined
  >();
  //#endregion

  //#region form
  const {
    control,
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    watch,
    setValue,
    getValues,
    formState
  } = useForm({
    mode: "onChange"
  });
  useLeaveConfirm({ formState });
  useFormPersist("storageKey", {
    watch,
    setValue,
    storage: window.localStorage // default window.sessionStorage
  });
  const formData = localStorage.getItem("storageKey");
  useEffect(() => {
    if (formData) {
      setTopicMessageDefaultValue(JSON.parse(formData).topicMessage);
    }
  }, [formData]);

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: { topicMessage: string }) => {
    console.log("submitted", form);
    if (!session) return;

    setIsLoading(true);
    setTopicMessageDefaultValue(
      topicMessageDefaultValue === undefined ? "" : undefined
    );

    const payload = {
      org,
      event,
      topic: {
        ...props.topic,
        topicMessages: [
          {
            message: form.topicMessage,
            messageHtml: form.topicMessage,
            createdBy: session.user.userId
          }
        ]
      }
    };

    try {
      await addTopic({
        payload
      }).unwrap();

      toast({
        title: "Votre message a été ajouté !",
        status: "success"
      });

      setIsLoading(false);
      clearErrors("topicMessage");
      props.onSubmit && props.onSubmit(form.topicMessage);
    } catch (error) {
      setIsLoading(false);
      handleError(error, (message, field) => {
        if (field) {
          setError(field, { type: "manual", message });
        } else {
          setError("formErrorMessage", { type: "manual", message });
        }
      });
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

      {!isDisabled && (
        <FormControl
          isDisabled={isDisabled}
          isRequired
          isInvalid={!!errors["topicMessage"]}
          p={3}
          pt={0}
        >
          <Controller
            name="topicMessage"
            control={control}
            defaultValue={topicMessageDefaultValue || ""}
            rules={{ required: "Veuillez saisir un message" }}
            render={(renderProps) => {
              return (
                <RTEditor
                  readOnly={session === null}
                  defaultValue={topicMessageDefaultValue}
                  placeholder={
                    session
                      ? "Cliquez ici pour répondre..."
                      : "Connectez vous pour répondre..."
                  }
                  onChange={({ html }) => {
                    renderProps.onChange(html);
                  }}
                />
              );
            }}
          />

          <FormErrorMessage>
            <ErrorMessage errors={errors} name="topicMessage" />
          </FormErrorMessage>
        </FormControl>
      )}

      <Flex justifyContent={props.onCancel ? "space-between" : "flex-end"}>
        {props.onCancel && (
          <Button onClick={() => props.onCancel && props.onCancel()}>
            Annuler
          </Button>
        )}

        {session || isDisabled ? (
          <Button
            colorScheme="green"
            type="submit"
            isLoading={isLoading}
            isDisabled={isDisabled || Object.keys(errors).length > 0}
            mr={props.onCancel ? 0 : 3}
          >
            {isDisabled
              ? "Réponses désactivées"
              : props.topicMessage
              ? "Modifier"
              : "Répondre"}
          </Button>
        ) : (
          <Button variant="outline" onClick={props.onLoginClick} mr={3}>
            Connexion
          </Button>
        )}
      </Flex>
    </form>
  );
};
