import type { IEvent } from "models/Event";
import type { IOrg } from "models/Org";
import type { ITopic } from "models/Topic";
import type { ITopicMessage } from "models/TopicMessage";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import {
  ChakraProps,
  Button,
  FormControl,
  Box,
  Stack,
  FormErrorMessage,
  useToast,
  Flex,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { ErrorMessageText, RTEditor } from "features/common";
import { useSession } from "hooks/useAuth";
import { handleError } from "utils/form";
import { useAddOrgDetailsMutation } from "features/orgs/orgsApi";
import { useAddEventDetailsMutation } from "features/events/eventsApi";

interface TopicMessageFormProps extends ChakraProps {
  org?: IOrg;
  event?: IEvent;
  topic: ITopic;
  topicMessage?: ITopicMessage;
  onLoginClick: () => void;
  onClose?: () => void;
  onCancel?: () => void;
  onSubmit?: (topicMessageName: string) => void;
}

export const TopicMessageForm = (props: TopicMessageFormProps) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [addOrgDetails, addOrgDetailsMutation] = useAddOrgDetailsMutation();
  const [addEventDetails, addEventDetailsMutation] =
    useAddEventDetailsMutation();
  const toast = useToast({ position: "top" });
  const [topicMessageDefaultValue, setTopicMessageDefaultValue] = useState<
    string | undefined
  >();

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
    console.log("!");

    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: { topicMessage: string }) => {
    console.log("submitted", form);
    // console.log(
    //   "TMF: DEFAULT VALUE",
    //   typeof topicMessageDefaultValue,
    //   topicMessageDefaultValue
    // );
    setTopicMessageDefaultValue(
      topicMessageDefaultValue === undefined ? "" : undefined
    );

    const payload = {
      topic: {
        ...props.topic,
        topicMessages: [
          { message: form.topicMessage, createdBy: session.user.userId }
        ]
      }
    };

    try {
      if (props.org && props.org.orgName) {
        await addOrgDetails({
          payload,
          orgName: props.org.orgName
        }).unwrap();
      } else if (props.event && props.event.eventName) {
        await addEventDetails({
          payload,
          eventName: props.event.eventName
        }).unwrap();
      }

      toast({
        title: "Votre message a bien été ajouté !",
        status: "success",
        isClosable: true
      });

      clearErrors("topicMessage");
      props.onSubmit && props.onSubmit(form.topicMessage);
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
        id="topicMessage"
        isRequired
        isInvalid={!!errors["topicMessage"]}
        p={3}
        pb={3}
      >
        <Controller
          name="topicMessage"
          control={control}
          defaultValue={topicMessageDefaultValue || ""}
          rules={{ required: "Veuillez saisir un message" }}
          render={(p) => {
            return (
              <RTEditor
                readOnly={session === null}
                defaultValue={topicMessageDefaultValue}
                onChange={(html: string) => {
                  clearErrors("topicMessage");
                  p.onChange(html === "<p><br></p>" ? "" : html);
                }}
                placeholder={
                  session
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

        {session ? (
          <Button
            colorScheme="green"
            type="submit"
            isLoading={isLoading || addOrgDetailsMutation.isLoading}
            isDisabled={Object.keys(errors).length > 0}
            mr={props.onCancel ? 0 : 3}
          >
            {props.topicMessage ? "Modifier" : "Répondre"}
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
