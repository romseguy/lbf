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
import Creatable from "react-select/creatable";
import { ErrorMessageText, MultiSelect, RTEditor } from "features/common";
import {
  useAddTopicMutation,
  useEditTopicMutation
} from "features/forum/topicsApi";
import { useSession } from "hooks/useAuth";
import type { IEvent } from "models/Event";
import {
  getSubscriptions,
  IOrg,
  IOrgList,
  orgTypeFull,
  orgTypeFull4
} from "models/Org";
import {
  getFollowerSubscription,
  getSubscriberSubscription,
  IEventSubscription,
  IOrgSubscription,
  SubscriptionTypes
} from "models/Subscription";
import { ITopic } from "models/Topic";
import { ITopicMessage } from "models/TopicMessage";
import { handleError } from "utils/form";
import { hasItems } from "utils/array";

export const TopicForm = ({
  org,
  event,
  query,
  mutation,
  subQuery,
  ...props
}: ChakraProps & {
  org?: IOrg;
  event?: IEvent;
  query: any;
  mutation: any;
  subQuery: any;
  topic: ITopic | null;
  isCreator?: boolean;
  isFollowed?: boolean;
  isSubscribed?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onSubmit?: (topic: ITopic | null) => void;
}) => {
  const { data: session } = useSession();
  const toast = useToast({ position: "top" });

  const [addTopic, addTopicMutation] = useAddTopicMutation();
  const [editTopic, editTopicMutation] = useEditTopicMutation();
  const [editEntity, _] = mutation;

  //#region local state
  const [isLoading, setIsLoading] = useState(false);

  let categories: string[] | undefined;
  let lists: IOrgList[] | undefined;
  let followerSubscription: IOrgSubscription | IEventSubscription | undefined;
  let subscriberSubscription: IOrgSubscription | undefined;

  if (org) {
    categories = org.orgTopicsCategories || [];
    lists =
      org.orgLists?.filter((orgList) => {
        if (
          props.isSubscribed &&
          !orgList.subscriptions?.find(
            (subscription) => subscription._id === subQuery.data?._id
          )
        )
          return false;

        return true;
      }) || [];

    followerSubscription = getFollowerSubscription({ org, subQuery });
    subscriberSubscription = getSubscriberSubscription({ org, subQuery });

    if (props.isCreator || followerSubscription)
      lists.push({
        listName: "Abonnés",
        subscriptions: getSubscriptions(org, SubscriptionTypes.FOLLOWER)
      });

    if (props.isCreator || subscriberSubscription)
      lists.push({
        listName: "Adhérents",
        subscriptions: getSubscriptions(org, SubscriptionTypes.SUBSCRIBER)
      });
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

  // if (topicNotif && org && !hasItems(topicVisibility))
  //   setValue("topicNotif", false);

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: {
    topicName: string;
    topicMessage: string;
    topicCategory?: { label: string; value: string } | null;
    topicVisibility?: [{ label: string; value: string }];
    topicNotif?: boolean;
  }) => {
    console.log("submitted", form);
    if (!session) return;

    setIsLoading(true);

    try {
      const payload = {
        org,
        event,
        topic: {
          topicName: form.topicName,
          topicMessages: form.topicMessage
            ? [
                {
                  message: form.topicMessage,
                  messageHtml,
                  createdBy: session.user.userId
                }
              ]
            : [],
          topicCategory: form.topicCategory ? form.topicCategory.value : null,
          topicVisibility: form.topicVisibility?.map(
            ({ label, value }) => value
          )
        }
      };

      if (props.topic) {
        await editTopic({
          payload: {
            topic: {
              ...payload.topic,
              topicMessages: [
                ...props.topic.topicMessages,
                ...payload.topic.topicMessages
              ]
            }
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

      {org && (
        <FormControl
          id="topicCategory"
          isInvalid={!!errors["topicCategory"]}
          mb={3}
        >
          <FormLabel>Catégories</FormLabel>
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
                    categories?.map((label) => ({
                      label,
                      value: label
                    })) || []
                  }
                  allowCreateWhileLoading
                  formatCreateLabel={(inputValue: string) =>
                    `Créer la catégorie "${inputValue}"`
                  }
                  onCreateOption={async (inputValue: string) => {
                    if (org && !props.isSubscribed && !props.isCreator) {
                      toast({
                        status: "error",
                        title: `Vous devez être adhérent ${orgTypeFull(
                          org.orgType
                        )} ${org.orgName} pour créer une catégorie`,
                        isClosable: true
                      });
                      return;
                    }

                    try {
                      if (org)
                        await editEntity({
                          orgUrl: org.orgUrl,
                          payload: {
                            orgTopicsCategories: [
                              ...(org.orgTopicsCategories || []),
                              inputValue
                            ]
                          }
                        });

                      query.refetch();
                      setValue("topicCategory", {
                        label: inputValue,
                        value: inputValue
                      });
                      toast({
                        status: "success",
                        title: "La catégorie a bien été ajoutée !",
                        isClosable: true
                      });
                    } catch (error) {
                      console.error(error);
                      toast({
                        status: "error",
                        title: "La catégorie n'a pas pu être ajoutée",
                        isClosable: true
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

      {(props.isCreator || props.isSubscribed) &&
        lists &&
        org?.orgName !== "aucourant" && (
          <FormControl
            id="topicVisibility"
            isInvalid={!!errors["topicVisibility"]}
            mb={3}
          >
            <FormLabel>Listes de diffusion</FormLabel>
            <Controller
              name="topicVisibility"
              control={control}
              defaultValue={
                props.topic?.topicVisibility?.map((listName) => ({
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
                      lists?.map(({ listName }) => ({
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
        (event ||
          props.isSubscribed ||
          (org && org.orgName === "aucourant")) && (
          <FormControl id="topicNotif" mb={3}>
            <FormLabel>Notifications</FormLabel>

            {hasItems(topicVisibility) ? (
              <Checkbox
                ref={register()}
                name="topicNotif"
                mb={3}
                isChecked={topicNotif}
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
                Notifier les personnes abonnées{" "}
                {org && org.orgName === "aucourant"
                  ? "au forum"
                  : org
                  ? `à ${orgTypeFull4(org.orgType)}`
                  : "à cet événement"}
              </Checkbox>
            )}
          </FormControl>
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
          {props.topic
            ? "Modifier"
            : `Ajouter ${topicNotif ? "& Notifier" : ""}`}
        </Button>
      </Flex>
    </form>
  );
};
