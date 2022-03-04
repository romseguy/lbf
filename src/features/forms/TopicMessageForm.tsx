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
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessageText, RTEditor } from "features/common";
import { useSession } from "hooks/useAuth";
import type { IEvent } from "models/Event";
import type { IOrg } from "models/Org";
import type { ITopic } from "models/Topic";
import type { ITopicMessage } from "models/TopicMessage";
import { handleError } from "utils/form";
import { useAddTopicMutation } from "features/forum/topicsApi";

interface TopicMessageFormProps extends ChakraProps {
  org?: IOrg;
  event?: IEvent;
  formats?: string[];
  topic: ITopic;
  topicMessage?: ITopicMessage;
  isDisabled?: boolean;
  onLoginClick: () => void;
  onCancel?: () => void;
  onSubmit?: (topicMessageName: string) => void;
}

export const TopicMessageForm = ({
  isDisabled,
  ...props
}: TopicMessageFormProps) => {
  const { data: session } = useSession();
  const toast = useToast({ position: "top" });

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
    getValues
  } = useForm({
    mode: "onChange"
  });

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
      org: props.org,
      event: props.event,
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
                //formats={props.formats}
                readOnly={session === null}
                defaultValue={topicMessageDefaultValue}
                onChange={({ html }) => {
                  clearErrors("topicMessage");
                  renderProps.onChange(html);
                }}
                placeholder={
                  isDisabled
                    ? "Les réponses sont désactivées pour cette discussion."
                    : session
                    ? "Cliquez ici pour répondre..."
                    : "Connectez vous pour répondre..."
                }
              />
            );
          }}
        />

        <FormErrorMessage>
          <ErrorMessage errors={errors} name="topicMessage" />
        </FormErrorMessage>
      </FormControl>

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
