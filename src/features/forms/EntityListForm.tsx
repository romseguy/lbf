import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";
import Creatable from "react-select/creatable";
import { ErrorMessageText } from "features/common";
import { useLeaveConfirm } from "hooks/useLeaveConfirm";
import { IOrg, IOrgList } from "models/Org";
import { getFollowerSubscription, ISubscription } from "models/Subscription";
import { hasItems } from "utils/array";
import { handleError } from "utils/form";
import { emailR } from "utils/email";

const subscriptionsToOptions = (subscriptions: ISubscription[]) =>
  subscriptions.map((subscription) => {
    let label = subscription.email || subscription.phone || "";
    if (label === "" && typeof subscription.user === "object")
      label = subscription.user.email;

    return {
      label,
      value: subscription
    };
  });

export const EntityListForm = ({
  allOptionLabel,
  org,
  onCancel,
  ...props
}: {
  allOptionLabel?: string;
  list?: IOrgList;
  org: IOrg;
  onCancel?: () => void;
  onSubmit: (form: IOrgList) => Promise<void>;
}) => {
  const toast = useToast({ position: "top" });
  const [isLoading, setIsLoading] = useState(false);

  //#region form
  const {
    control,
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    formState,
    watch,
    setValue
  } = useForm({
    mode: "onChange"
  });
  useLeaveConfirm({ formState });
  useFormPersist("storageKey", {
    watch,
    setValue,
    storage: window.localStorage // default window.sessionStorage
  });

  const defaultSubscriptions = props.list?.subscriptions || [];
  //const subscriptions: ISubscription[] = watch("subscriptions") || defaultSubscriptions;

  const onSubmit = async (form: {
    listName: string;
    subscriptions?: { label: string; value: ISubscription }[];
  }) => {
    console.log("submitted", form);

    if (props.onSubmit) {
      setIsLoading(true);

      try {
        await props.onSubmit({
          ...form,
          subscriptions: form.subscriptions
            ? form.subscriptions.map(({ value }) => {
                return value;
              })
            : []
        });
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        handleError(error, (message, field) => {
          setError(field || "formErrorMessage", { type: "manual", message });
        });
      }
    }
  };
  //#endregion

  return (
    <form
      onChange={() => clearErrors("formErrorMessage")}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormControl isInvalid={!!errors.listName} isRequired mb={3}>
        <FormLabel>Nom de la liste</FormLabel>
        <Input
          name="listName"
          ref={register({
            required: "Veuillez saisir un nom de liste"
          })}
          defaultValue={props.list?.listName}
          //placeholder="Nom de la liste"
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="listName" />
        </FormErrorMessage>
      </FormControl>

      <FormControl mb={3}>
        <FormLabel>Koalas</FormLabel>

        <Controller
          name="subscriptions"
          control={control}
          defaultValue={subscriptionsToOptions(defaultSubscriptions)}
          render={(renderProps) => {
            return (
              <Creatable
                options={subscriptionsToOptions(
                  org.orgSubscriptions.filter((subscription) => {
                    if (
                      defaultSubscriptions.find(
                        ({ _id }) => _id === subscription._id
                      )
                    )
                      return false;

                    return subscription.orgs?.find(
                      (orgSubscription) => orgSubscription.orgId === org._id
                    );
                  })
                )}
                value={renderProps.value}
                onChange={renderProps.onChange}
                onCreateOption={async (inputValue: string) => {
                  try {
                    if (!emailR.test(inputValue))
                      throw new Error("Adresse e-mail invalide");

                    //TODO
                    toast({
                      status: "info",
                      title: "En cours de développement"
                    });
                    // await addSubscription({
                    //   email,
                    //   orgs: [
                    //     {
                    //       org,
                    //       orgId: org._id,
                    //       type,
                    //       tagTypes: [
                    //         { type: "Events", emailNotif: true, pushNotif: true },
                    //         { type: "Projects", emailNotif: true, pushNotif: true },
                    //         { type: "Topics", emailNotif: true, pushNotif: true }
                    //       ]
                    //     }
                    //   ]
                    // });
                  } catch (error: any) {
                    console.error(error);
                    toast({
                      status: "error",
                      title: error.message
                    });
                  }
                }}
                //#region ui
                closeMenuOnSelect={false}
                placeholder="Sélectionner ou créer un koala..."
                menuPlacement="top"
                isClearable
                isMulti
                isSearchable
                noOptionsMessage={() => "Aucun résultat"}
                //#endregion
                //#region styling
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
                  multiValue: (defaultStyles: any, option: any) => {
                    const subscription: ISubscription = option.data.value;
                    const followerSubscription = getFollowerSubscription({
                      org,
                      subscription
                    });

                    return {
                      ...defaultStyles,
                      backgroundColor: `${
                        !!followerSubscription ? "green" : "purple"
                      } !important`
                    };
                  },
                  placeholder: () => {
                    return {
                      color: "#A0AEC0"
                    };
                  }
                }}
                //#endregion
              />
            );
          }}
        />
      </FormControl>

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

      <Flex justifyContent="space-between">
        {onCancel && (
          <Button colorScheme="red" onClick={onCancel} mr={3}>
            Annuler
          </Button>
        )}

        <Button
          colorScheme="green"
          type="submit"
          isDisabled={Object.keys(errors).length > 0}
          isLoading={isLoading}
        >
          {props.list ? "Modifier" : "Ajouter"}
        </Button>
      </Flex>
    </form>
  );
};
