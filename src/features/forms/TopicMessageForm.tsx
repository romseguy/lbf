import {
  ChakraProps,
  Button,
  FormControl,
  FormErrorMessage,
  useToast,
  Flex,
  Alert,
  AlertIcon,
  Skeleton
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useFormPersist from "hooks/useFormPersist";
import { AddTopicPayload, useAddTopicMutation } from "features/api/topicsApi";
import { ErrorMessageText, RTEditor } from "features/common";
import { useLeaveConfirm } from "hooks/useLeaveConfirm";
import { useSession } from "hooks/useSession";
import { IEntity, isEvent, isOrg } from "models/Entity";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { ITopic } from "models/Topic";
import { ITopicMessage } from "models/TopicMessage";
import { handleError } from "utils/form";
import { AppQueryWithData } from "utils/types";

interface TopicMessageFormProps extends ChakraProps {
  formats?: string[];
  isDisabled?: boolean;
  query: AppQueryWithData<IEntity>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  topic: ITopic;
  topicMessage?: ITopicMessage;
  onCancel?: () => void;
  onSubmit?: (topicMessageName: string) => void;
}

export const TopicMessageForm = ({
  isDisabled,
  isLoading,
  setIsLoading,
  query,
  ...props
}: TopicMessageFormProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const toast = useToast({ position: "top" });
  const entity = query.data;
  const isE = isEvent(entity);
  const isO = isOrg(entity);
  const event = isE ? (query.data as IEvent) : undefined;
  const org = isO ? (query.data as IOrg) : undefined;

  const [addTopic, addTopicMutation] = useAddTopicMutation();

  //#region local state
  //const [isLoading, setIsLoading] = useState(true);
  // const [topicMessageDefaultValue, setTopicMessageDefaultValue] =
  //   useState<string>("");
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
  } = useFormPersist(
    useForm<{ formErrorMessage: string; topicMessage: string }>({
      mode: "onChange",
      defaultValues: { topicMessage: "" }
    })
  );
  useLeaveConfirm({ formState });

  // const formData = localStorage.getItem("storageKey");
  // useEffect(() => {
  //   if (formData) {
  //     const parsed = JSON.parse(formData);

  //     if (parsed) {
  //       const value = parsed.topicMessage;

  //       if (typeof value === "string") {
  //         setTopicMessageDefaultValue(value);
  //         //setValue("topicMessage", value);
  //       }
  //     }
  //   }
  // }, [formData]);

  // useEffect(() => {
  //   if (formData) {
  //     const parsed = JSON.parse(formData);

  //     if (parsed) {
  //       const value = parsed.topicMessage;
  //       setValue("topicMessage", value);
  //       setTopicMessageDefaultValue(value);
  //       console.log("storage changed!", value);
  //     }
  //   } else {
  //     console.log("nothing stored");
  //     setValue("topicMessage", "");
  //     setTopicMessageDefaultValue("");
  //   }
  // }, [formData]);

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: { topicMessage: string }) => {
    console.log("submitted", form);

    setIsLoading(true);

    const payload: AddTopicPayload = {
      org,
      event,
      topic: {
        ...props.topic,
        topicMessages: [
          {
            message: form.topicMessage,
            messageHtml: form.topicMessage,
            createdBy: session!.user.userId
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
      setValue("topicMessage", "");
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

      {!isDisabled && session && (
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
            //defaultValue={topicMessageDefaultValue}
            rules={{ required: "Veuillez saisir un message" }}
            render={(renderProps) => {
              return (
                <RTEditor
                  //defaultValue={topicMessageDefaultValue}
                  value={renderProps.value}
                  placeholder={"Cliquez ici pour répondre..."}
                  setIsLoading={setIsLoading}
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

        {!session && (
          <Button
            variant="outline"
            onClick={() => {
              router.push("/login", "/login", { shallow: true });
            }}
            mr={3}
          >
            Se connecter pour répondre
          </Button>
        )}

        {session && (
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
        )}
      </Flex>
    </form>
  );
};
