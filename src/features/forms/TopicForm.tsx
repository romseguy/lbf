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
import Creatable from "react-select/creatable";
import { ErrorMessageText, MultiSelect, RTEditor } from "features/common";
import {
  useAddTopicMutation,
  useEditTopicMutation
} from "features/forum/topicsApi";
import { useSession } from "hooks/useAuth";
import type { IEvent } from "models/Event";
import { IOrg, orgTypeFull } from "models/Org";
import { ISubscription } from "models/Subscription";
import { ITopic } from "models/Topic";
import { hasItems } from "utils/array";
import { handleError } from "utils/form";
import { AppQuery, Optional } from "utils/types";
import { normalize } from "utils/string";

export const TopicForm = ({
  org,
  event,
  query,
  mutation,
  subQuery,
  setIsTouched,
  ...props
}: {
  org?: IOrg;
  event?: IEvent;
  query: AppQuery<IEvent | IOrg>;
  mutation: any;
  subQuery: AppQuery<ISubscription>;
  setIsTouched: React.Dispatch<React.SetStateAction<boolean>>;
  topic?: ITopic;
  isCreator?: boolean;
  isFollowed?: boolean;
  isSubscribed?: boolean;
  onCancel?: () => void;
  onSubmit?: (topic?: ITopic) => void;
}) => {
  const { data: session } = useSession();
  const toast = useToast({ position: "top" });

  const [addTopic, addTopicMutation] = useAddTopicMutation();
  const [editTopic, editTopicMutation] = useEditTopicMutation();
  const [editEntity] = mutation;

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
    watch
  } = useForm({
    mode: "onChange"
  });

  const topicVisibility = watch("topicVisibility");

  const onChange = () => {
    setIsTouched(true);
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
          title: "La discussion a bien été modifiée",
          status: "success"
        });

        setIsLoading(false);
        props.onSubmit && props.onSubmit(props.topic);
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

        const payload = {
          org,
          event,
          topic
        };

        const newTopic = await addTopic({
          payload
        }).unwrap();

        toast({
          title: "La discussion a bien été ajoutée !",
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
          placeholder="Objet"
          ref={register({
            required: "Veuillez saisir l'objet de la discussion"
          })}
          defaultValue={props.topic ? props.topic.topicName : ""}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="topicName" />
        </FormErrorMessage>
      </FormControl>

      {org && (
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
                    org.orgTopicsCategories?.map((label) => ({
                      label,
                      value: label
                    })) || []
                  }
                  allowCreateWhileLoading
                  formatCreateLabel={(inputValue: string) =>
                    `Créer la catégorie "${inputValue}"`
                  }
                  onCreateOption={async (inputValue: string) => {
                    if (!org) return; // for TS

                    if (!props.isSubscribed && !props.isCreator) {
                      toast({
                        status: "error",
                        title: `Vous devez être adhérent ou créateur ${orgTypeFull(
                          org.orgType
                        )} ${org.orgName} pour créer une catégorie`
                      });
                      return;
                    }

                    // if (
                    //   org.orgTopicsCategories.find(
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
                      await editEntity({
                        orgUrl: org.orgUrl,
                        payload: {
                          orgTopicsCategories: [
                            ...org.orgTopicsCategories,
                            inputValue
                          ]
                        }
                      }).unwrap();

                      query.refetch();
                      setValue("topicCategory", {
                        label: inputValue,
                        value: inputValue
                      });
                      toast({
                        status: "success",
                        title: "La catégorie a bien été ajoutée !"
                      });
                    } catch (error) {
                      console.error(error);
                      toast({
                        status: "error",
                        title: "La catégorie n'a pas pu être ajoutée"
                      });
                    }
                  }}
                  isClearable
                  placeholder="Créer ou rechercher une catégorie"
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
      )}

      {!props.topic && (
        <FormControl isInvalid={!!errors["topicMessage"]} mb={3}>
          <FormLabel>Message (optionnel)</FormLabel>
          <Controller
            name="topicMessage"
            control={control}
            defaultValue=""
            render={(renderProps) => {
              return (
                <RTEditor
                  placeholder="Contenu de votre message"
                  onBlur={(html) => setIsTouched(html !== "")}
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

      {org && (
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
                    org.orgLists.map(({ listName }) => ({
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
          {props.topic ? "Modifier" : "Ajouter"}
        </Button>
      </Flex>
    </form>
  );
};
