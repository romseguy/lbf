import {
  ChakraProps,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Flex,
  Alert,
  AlertIcon,
  Checkbox
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessageText, RTEditor } from "features/common";
import {
  useAddTopicMutation,
  useEditTopicMutation
} from "features/forum/topicsApi";
import { useSession } from "hooks/useAuth";
import type { IEvent } from "models/Event";
import { getSubscriptions, IOrg, IOrgList } from "models/Org";
import { ITopic } from "models/Topic";
import { handleError } from "utils/form";
import { ITopicMessage } from "models/TopicMessage";
import { MultiSelect } from "features/common/forms/MultiSelect";
import { SubscriptionTypes } from "models/Subscription";
import { hasItems } from "utils/array";

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

  const [addTopic, addTopicMutation] = useAddTopicMutation();
  const [editTopic, editTopicMutation] = useEditTopicMutation();

  //#region local state
  const [isLoading, setIsLoading] = useState(false);
  let lists: IOrgList[] | undefined;
  if (org) {
    lists = (org.orgLists || []).concat([
      {
        listName: "Abonnés",
        subscriptions: getSubscriptions(org, SubscriptionTypes.FOLLOWER)
      },
      {
        listName: "Adhérents",
        subscriptions: getSubscriptions(org, SubscriptionTypes.SUBSCRIBER)
      }
    ]);
  }
  const [messageHtml, setMessageHtml] = useState<string>();
  //#endregion

  //#region form
  const {
    control,
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    setValue,
    watch
  } = useForm({
    mode: "onChange"
  });

  const topicVisibility = watch("topicVisibility");
  const topicNotif = watch("topicNotif");

  if (topicNotif && org && !hasItems(topicVisibility))
    setValue("topicNotif", false);

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: {
    topicName: string;
    topicMessage: string;
    topicVisibility?: [{ label: string; value: string }];
    topicNotif?: boolean;
  }) => {
    console.log("submitted", form);
    if (!session) return;

    setIsLoading(true);

    const topicMessages: ITopicMessage[] = form.topicMessage
      ? [
          {
            message: form.topicMessage,
            messageHtml,
            createdBy: session.user.userId
          }
        ]
      : [];

    try {
      const payload = {
        org,
        event,
        topic: {
          topicName: form.topicName,
          topicMessages,
          topicVisibility: form.topicVisibility?.map(
            ({ label, value }) => value
          ),
          createdBy: session.user.userId
        }
      };

      if (props.topic) {
        await editTopic({
          payload: {
            ...payload.topic,
            topicMessages: payload.topic.topicMessages.concat(
              props.topic.topicMessages
            )
          },
          topicId: props.topic._id
        }).unwrap();

        toast({
          title: "Votre discussion a bien été modifiée",
          status: "success",
          isClosable: true
        });

        setIsLoading(false);
        props.onSubmit && props.onSubmit(props.topic);
      } else {
        const topic = await addTopic({
          payload,
          topicNotif: form.topicNotif
        }).unwrap();

        toast({
          title: "Votre discussion a bien été ajoutée !",
          status: "success",
          isClosable: true
        });

        setIsLoading(false);
        props.onSubmit && props.onSubmit(topic);
      }
    } catch (error: any) {
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
            render={(renderProps) => {
              return (
                <RTEditor
                  defaultValue={""}
                  placeholder="Contenu de votre message"
                  onChange={({ html, quillHtml }) => {
                    setMessageHtml(html);
                    renderProps.onChange(quillHtml);
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

      {!props.topic && props.isCreator && lists && (
        <FormControl
          id="topicVisibility"
          isInvalid={!!errors["topicVisibility"]}
          mb={3}
        >
          <FormLabel>Listes de diffusion</FormLabel>
          <Controller
            name="topicVisibility"
            control={control}
            defaultValue={[]}
            render={(renderProps) => {
              return (
                <MultiSelect
                  value={renderProps.value}
                  onChange={renderProps.onChange}
                  options={
                    lists?.map(({ listName }) => ({
                      label: listName,
                      value: listName
                    })) || []
                  }
                  allOptionLabel="Toutes les listes"
                  placeholder="Sélectionner une ou plusieurs listes"
                  noOptionsMessage={() => "Aucun résultat"}
                  isClearable
                  isSearchable={false}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (defaultStyles: any) => {
                      return {
                        ...defaultStyles,
                        borderColor: "#e2e8f0",
                        paddingLeft: "8px"
                      };
                    },
                    placeholder: () => {
                      return {
                        color: "#A0AEC0"
                      };
                    }
                  }}
                />
              );
            }}
          />
          <FormErrorMessage>
            <ErrorMessage errors={errors} name="topicVisibility" />
          </FormErrorMessage>
        </FormControl>
      )}

      {hasItems(topicVisibility) && (
        <Alert status="info" mb={3}>
          <AlertIcon />
          La discussion ne sera visible que par les membres des listes de
          diffusion sélectionnées.
        </Alert>
      )}

      {!props.topic &&
        (lists ? (
          <Checkbox
            ref={register()}
            name="topicNotif"
            mb={3}
            isChecked={topicNotif}
            isDisabled={!hasItems(topicVisibility)}
          >
            Notifier les membres des listes de diffusions sélectionnées
          </Checkbox>
        ) : (
          <Checkbox
            ref={register()}
            name="topicNotif"
            mb={3}
            isChecked={topicNotif}
          >
            Notifier les personnes abonnées à l'événement
          </Checkbox>
        ))}

      <Flex justifyContent="space-between">
        <Button onClick={() => props.onCancel && props.onCancel()}>
          Annuler
        </Button>

        <Button
          colorScheme="green"
          type="submit"
          isLoading={
            isLoading ||
            addTopicMutation.isLoading ||
            editTopicMutation.isLoading
          }
          isDisabled={Object.keys(errors).length > 0}
          data-cy="addTopic"
        >
          {props.topic
            ? "Modifier"
            : `Ajouter ${topicNotif ? "& Notifier" : ""}`}
        </Button>
      </Flex>
    </form>
  );
};
