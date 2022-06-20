import {
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Flex,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";
import Creatable from "react-select/creatable";
import { ErrorMessageText, MultiSelect, RTEditor } from "features/common";
import { useEditEventMutation } from "features/api/eventsApi";
import { useEditOrgMutation } from "features/api/orgsApi";
import {
  AddTopicPayload,
  useAddTopicMutation,
  useEditTopicMutation
} from "features/api/topicsApi";
import { useSession } from "hooks/useSession";
import { useLeaveConfirm } from "hooks/useLeaveConfirm";
import { isEvent } from "models/Entity";
import type { IEvent } from "models/Event";
import { IOrg, orgTypeFull } from "models/Org";
import { ISubscription } from "models/Subscription";
import { ITopic } from "models/Topic";
import { hasItems } from "utils/array";
import { handleError } from "utils/form";
import { defaultErrorMessage } from "utils/string";
import { AppQuery, AppQueryWithData, Optional } from "utils/types";

export const TopicForm = ({
  query,
  subQuery,
  ...props
}: {
  query: AppQueryWithData<IEvent | IOrg>;
  subQuery: AppQuery<ISubscription>;
  topic?: ITopic;
  isCreator?: boolean;
  isFollowed?: boolean;
  onCancel?: () => void;
  onSubmit?: (topic?: ITopic) => void;
}) => {
  const { data: session } = useSession();
  const toast = useToast({ position: "top" });

  const [addTopic, addTopicMutation] = useAddTopicMutation();
  const [editTopic, editTopicMutation] = useEditTopicMutation();
  const [editEvent] = useEditEventMutation();
  const [editOrg] = useEditOrgMutation();
  const entity = query.data;
  const isE = isEvent(entity);
  const edit = isE ? editEvent : editOrg;
  const topicCategories = isE
    ? entity.eventTopicCategories
    : entity.orgTopicCategories;

  //#region local state
  const [isLoading, setIsLoading] = useState(false);
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
    watch,
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
  let topicMessageDefaultValue: string | undefined;
  const formData = localStorage.getItem("storageKey");
  if (formData) {
    topicMessageDefaultValue = JSON.parse(formData).topicMessage;
  }

  const topicVisibility = watch("topicVisibility");

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: {
    topicName: string;
    topicMessage?: string;
    topicCategory?: { label: string; value: string } | null;
    topicVisibility?: [{ label: string; value: string }];
  }) => {
    console.log("submitted", form);
    if (!session) return;

    setIsLoading(true);

    let topic: Omit<
      Optional<ITopic, "topicMessages">,
      "_id" | "createdBy" | "topicNotifications"
    > = {
      topicCategory: form.topicCategory ? form.topicCategory.value : null,
      topicName: form.topicName,
      topicVisibility: (form.topicVisibility || []).map(
        ({ label, value }) => value
      )
    };

    try {
      if (props.topic) {
        const payload = {
          topic
        };

        await editTopic({
          payload,
          topicId: props.topic._id
        }).unwrap();

        toast({
          title: "La discussion a été modifiée",
          status: "success"
        });

        setIsLoading(false);
        props.onSubmit && props.onSubmit(props.topic);
        localStorage.removeItem("storageKey");
      } else {
        if (typeof form.topicMessage === "string" && form.topicMessage !== "") {
          topic.topicMessages = [
            {
              message: form.topicMessage,
              messageHtml: form.topicMessage,
              createdBy: session.user.userId
            }
          ];
        }

        let payload: AddTopicPayload = {
          topic
        };

        if (isE) payload.event = entity;
        else payload.org = entity;

        const newTopic = await addTopic({
          payload
        }).unwrap();

        toast({
          title: "La discussion a été ajoutée !",
          status: "success"
        });

        setIsLoading(false);
        props.onSubmit && props.onSubmit(newTopic);
      }
    } catch (error: any) {
      setIsLoading(false);
      handleError(error, (message, field) =>
        field
          ? setError(field, { type: "manual", message })
          : setError("formErrorMessage", { type: "manual", message })
      );
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

      <FormControl isRequired isInvalid={!!errors["topicName"]} mb={3}>
        <FormLabel>Objet de la discussion</FormLabel>
        <Input
          name="topicName"
          ref={register({
            required: "Veuillez saisir l'objet de la discussion"
          })}
          autoComplete="off"
          defaultValue={props.topic ? props.topic.topicName : ""}
          placeholder="Objet"
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="topicName" />
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors["topicCategory"]} mb={3}>
        <FormLabel>Catégorie</FormLabel>
        <Controller
          name="topicCategory"
          control={control}
          defaultValue={
            props.topic && props.topic.topicCategory
              ? {
                  label: props.topic.topicCategory,
                  value: props.topic.topicCategory
                }
              : null
          }
          render={(renderProps) => {
            return (
              <Creatable
                value={renderProps.value}
                onChange={renderProps.onChange}
                options={
                  topicCategories.map(({ catId: value, label }) => ({
                    label,
                    value
                  })) || []
                }
                allowCreateWhileLoading
                formatCreateLabel={(inputValue: string) =>
                  `Ajouter la catégorie "${inputValue}"`
                }
                onCreateOption={async (inputValue: string) => {
                  if (!props.isCreator) {
                    toast({
                      status: "error",
                      title: `Vous n'avez pas la permission ${
                        isE ? "de l'événement" : orgTypeFull(entity.orgType)
                      } pour ajouter une catégorie`
                    });
                    return;
                  }

                  // if (
                  //   entity.orgTopicCategories.find(
                  //     (orgTopicsCategory) =>
                  //       orgTopicsCategory === normalize(inputValue, false)
                  //   )
                  // ) {
                  //   toast({
                  //     status: "error",
                  //     title: `Ce nom de catégorie n'est pas disponible`,
                  //                         //   });
                  //   return;
                  // }

                  try {
                    //if (isE) {
                    //todo
                    //} else {
                    const catId = "" + topicCategories.length;
                    await edit({
                      [isE ? "eventId" : "orgId"]: entity._id,
                      payload: {
                        [isE ? "eventTopicCategories" : "orgTopicCategories"]: [
                          ...topicCategories,
                          {
                            catId,
                            label: inputValue
                          }
                        ]
                      }
                    }).unwrap();
                    //}

                    setValue("topicCategory", {
                      label: inputValue,
                      value: catId
                    });
                    toast({
                      status: "success",
                      title: "La catégorie a été ajoutée !"
                    });
                  } catch (error) {
                    console.error(error);
                    toast({
                      status: "error",
                      title: defaultErrorMessage
                    });
                  }
                }}
                isClearable
                placeholder="Rechercher ou ajouter une catégorie"
                noOptionsMessage={() => "Aucun résultat"}
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (defaultStyles: any) => {
                    return {
                      ...defaultStyles,
                      borderColor: "#e2e8f0"
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
          <ErrorMessage errors={errors} name="topicCategory" />
        </FormErrorMessage>
      </FormControl>

      {!props.topic && (
        <FormControl isInvalid={!!errors["topicMessage"]} mb={3}>
          <FormLabel>Message (optionnel)</FormLabel>
          <Controller
            name="topicMessage"
            control={control}
            defaultValue={topicMessageDefaultValue}
            render={(renderProps) => {
              return (
                <RTEditor
                  defaultValue={topicMessageDefaultValue}
                  placeholder="Contenu de votre message"
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

      {!isE && (
        <FormControl mb={3}>
          <FormLabel>Visibilité</FormLabel>
          <Controller
            name="topicVisibility"
            control={control}
            defaultValue={
              props.topic?.topicVisibility.map((listName) => ({
                label: listName,
                value: listName
              })) || []
            }
            render={(renderProps) => {
              return (
                <MultiSelect
                  value={renderProps.value}
                  onChange={renderProps.onChange}
                  options={
                    entity.orgLists.map(({ listName }) => ({
                      label: listName,
                      value: listName
                    })) || []
                  }
                  allOptionLabel="Toutes les listes"
                  //closeMenuOnSelect={false}
                  placeholder="Sélectionner une ou plusieurs listes"
                  noOptionsMessage={() => "Aucun résultat"}
                  isClearable
                  isSearchable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (defaultStyles: any) => {
                      return {
                        ...defaultStyles,
                        borderColor: "#e2e8f0"
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
        </FormControl>
      )}

      {hasItems(topicVisibility) && (
        <Alert status="warning" mb={3}>
          <AlertIcon />
          La discussion ne sera visible que par les membres des listes
          sélectionnées.
        </Alert>
      )}

      <Flex justifyContent="space-between">
        {props.onCancel && (
          <Button colorScheme="red" onClick={props.onCancel}>
            Annuler
          </Button>
        )}

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
          {props.topic ? "Modifier" : "Ajouter"}
        </Button>
      </Flex>
    </form>
  );
};
