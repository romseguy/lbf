import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Flex,
  Button,
  Input
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessageText, MultiSelect } from "features/common";
import { IOrg, IOrgList } from "models/Org";
import { getFollowerSubscription, ISubscription } from "models/Subscription";
import { handleError } from "utils/form";
import { hasItems } from "utils/array";

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
  org,
  onCancel,
  ...props
}: {
  list?: IOrgList;
  org: IOrg;
  onCancel: () => void;
  onSubmit: (form: IOrgList) => Promise<void>;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  //#region form
  const { control, register, handleSubmit, errors, setError, clearErrors } =
    useForm({
      mode: "onChange"
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
            required: "Veuillez saisir un nom"
          })}
          defaultValue={props.list?.listName}
          placeholder="Nom de la liste"
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="listName" />
        </FormErrorMessage>
      </FormControl>

      {hasItems(org.orgSubscriptions) && (
        <FormControl mb={3}>
          <FormLabel>Membres</FormLabel>

          <Controller
            name="subscriptions"
            control={control}
            defaultValue={subscriptionsToOptions(defaultSubscriptions)}
            render={(renderProps) => {
              return (
                <MultiSelect
                  value={renderProps.value}
                  onChange={renderProps.onChange}
                  options={subscriptionsToOptions(
                    org.orgSubscriptions.filter((subscription) =>
                      subscription.orgs?.find(
                        (orgSubscription) => orgSubscription.orgId === org._id
                      )
                    )
                  )}
                  allOptionLabel="Tous les adhérents et abonnés"
                  closeMenuOnSelect={false}
                  placeholder="Rechercher un e-mail ou un numéro de téléphone..."
                  menuPlacement="top"
                  noOptionsMessage={() => "Aucun résultat"}
                  isClearable
                  isMulti
                  isSearchable
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
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              );
            }}
          />
        </FormControl>
      )}

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

/*
 import { MultiSelect } from "react-multi-select-component";

 const overrideStrings = {
   allItemsAreSelected: "Tous les adhérents sont sélectionnés",
   clearSearch: "Effacer la recherche",
   noOptions: "Aucun adhérent",
   search: "Rechercher un adhérent...",
   selectAll: "Sélectionner tous les adhérents",
   selectAllFiltered: "Tout sélectionner (Filtré)",
   selectSomeItems: "Sélectionner..."
 };

<Controller
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
                orgSubscription.type === ESubscriptionType.SUBSCRIBER
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
/>
*/
