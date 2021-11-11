import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Flex
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import { IOrg, IOrgList } from "models/Org";
import { ISubscription, SubscriptionTypes } from "models/Subscription";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactSelect from "react-select";
// import { MultiSelect } from "react-multi-select-component";
import { handleError } from "utils/form";
import { Input, ErrorMessageText, Button } from ".";

// const overrideStrings = {
//   allItemsAreSelected: "Tous les adhérents sont sélectionnés",
//   clearSearch: "Effacer la recherche",
//   noOptions: "Aucun adhérent",
//   search: "Rechercher un adhérent...",
//   selectAll: "Sélectionner tous les adhérents",
//   selectAllFiltered: "Tout sélectionner (Filtré)",
//   selectSomeItems: "Sélectionner..."
// };

export const EntityListForm = ({
  org,
  onCancel,
  ...props
}: {
  list?: IOrgList;
  org: IOrg;
  onCancel: () => void;
  onSubmit: (payload: IOrgList) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  //#region form state
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
    trigger
  } = useForm({
    mode: "onChange"
  });

  const defaultSubscriptions = props.list?.subscriptions || [];
  const subscriptions: ISubscription[] =
    watch("subscriptions") || defaultSubscriptions;

  const onSubmit = async (form: {
    listName: string;
    subscriptions: ISubscription[];
  }) => {
    console.log("submitted", form);
    setIsLoading(true);

    const payload = {
      ...form
    };

    if (props.list) {
      // todo if (props.list.listName !== list.listName)
    }

    try {
      setIsLoading(false);
      props.onSubmit && props.onSubmit(payload);
    } catch (error) {
      setIsLoading(false);
      handleError(error, (message, field) => {
        setError(field || "formErrorMessage", {
          type: "manual",
          message
        });
      });
    }
  };
  //#endregion

  return (
    <form
      onChange={() => clearErrors("formErrorMessage")}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormControl isInvalid={!!errors.listName} isRequired mb={3}>
        <FormLabel>Nom de la liste de diffusion</FormLabel>
        <Input
          name="listName"
          ref={register({
            required: "Veuillez saisir un nom"
          })}
          defaultValue={props.list?.listName}
          placeholder="Nom de la liste de diffusion"
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="listName" />
        </FormErrorMessage>
      </FormControl>

      <FormControl mb={3}>
        <FormLabel>Adhérents</FormLabel>

        <Controller
          name="subscriptions"
          as={ReactSelect}
          control={control}
          defaultValue={defaultSubscriptions}
          closeMenuOnSelect={false}
          placeholder="Rechercher un adhérent..."
          menuPlacement="top"
          noOptionsMessage={() => "Aucun adhérent trouvé"}
          isClearable
          isMulti
          isSearchable
          styles={{
            placeholder: () => {
              return {
                color: "#A0AEC0"
              };
            },
            control: (defaultStyles: any) => {
              return {
                ...defaultStyles,
                borderColor: "#e2e8f0",
                paddingLeft: "8px"
              };
            }
          }}
          className="react-select-container"
          classNamePrefix="react-select"
          options={org.orgSubscriptions.filter(
            (subscription) =>
              !subscriptions.find(({ _id }) => _id === subscription._id) &&
              subscription.orgs.find(
                (orgSubscription) =>
                  orgSubscription.orgId === org._id &&
                  orgSubscription.type === SubscriptionTypes.SUBSCRIBER
              )
          )}
          getOptionLabel={(subscription: ISubscription) => {
            let label = subscription.email || subscription.phone || "";
            if (label === "" && typeof subscription.user === "object")
              label = subscription.user.email;
            return label;
          }}
          getOptionValue={(option: ISubscription) => option}
          onChange={([option]: [option: ISubscription]) => option}
        />

        {/* <Controller
          name="subscriptions"
          control={control}
          defaultValue={list.subscriptions.map((subscription) => {
            let label = subscription.email || subscription.phone || "";
            if (label === "" && typeof subscription.user === "object")
              label = subscription.user.email;

            return {
              label,
              value: subscription
            };
          })}
          render={({ onChange, value }) => {
            return (
              <MultiSelect
                value={value}
                options={org.orgSubscriptions
                  .filter((subscription) =>
                    subscription.orgs.find(
                      (orgSubscription) =>
                        orgSubscription.orgId === org._id &&
                        orgSubscription.type === SubscriptionTypes.SUBSCRIBER
                    )
                  )
                  .map((subscription) => {
                    let label = subscription.email || subscription.phone || "";
                    if (label === "" && typeof subscription.user === "object")
                      label = subscription.user.email;

                    return {
                      label,
                      value: subscription
                    };
                  })}
                // isCreatable
                labelledBy="Sélectionner un ou plusieurs adhérents"
                overrideStrings={overrideStrings}
                onChange={onChange}
                // onCreateOption={(value: string) => {
                //   return {
                //     label: value,
                //     value: value.toUpperCase()
                //   };
                // }}
              />
            );
          }}
        /> */}
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
        <Button onClick={onCancel} mr={3}>
          Annuler
        </Button>
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
