import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { ErrorMessage } from "@hookform/error-message";
import React, { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { ErrorMessageText, MultiSelect } from "features/common";
import { useLeaveConfirm } from "hooks/useLeaveConfirm";
import { defaultLists, IOrg, IOrgList } from "models/Org";
import { getEntitySubscription, ISubscription } from "models/Subscription";
import { handleError } from "utils/form";
import { emailR } from "utils/regex";

const subscriptionsToOptions = (subscriptions: ISubscription[]) =>
  subscriptions.map((subscription) => {
    let label = subscription.email || subscription.phone || "";
    if (label === "" && typeof subscription.user === "object")
      label = subscription.user.email;

    return {
      label,
      value: subscription._id
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
  const defaultSubscriptions = props.list?.subscriptions || [];
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
    defaultValues: {
      listName: props.list?.listName,
      subscriptions: subscriptionsToOptions(defaultSubscriptions)
    },
    mode: "onChange"
  });
  useLeaveConfirm({ formState });

  // const subscriptions = useWatch<ISubscription[]>({
  //   control,
  //   name: "subscriptions"
  // });

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
      <FormControl
        isInvalid={!!errors.listName}
        isRequired
        mb={3}
        display={
          props.list?.listName && defaultLists.includes(props.list.listName)
            ? "none"
            : "block"
        }
      >
        <FormLabel>Nom de la liste</FormLabel>
        <Input
          name="listName"
          ref={register({
            required: "Veuillez saisir un nom de liste"
          })}

          //placeholder="Nom de la liste"
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="listName" />
        </FormErrorMessage>
      </FormControl>

      <FormControl mb={3}>
        <FormLabel>Personnes</FormLabel>

        <Controller
          name="subscriptions"
          control={control}
          render={(renderProps) => {
            return (
              <MultiSelect
                options={subscriptionsToOptions(org.orgSubscriptions)}
                value={renderProps.value}
                onChange={renderProps.onChange}
                // onChange={(newValue, actionMeta) => {
                //   if (
                //     actionMeta.action === "select-option" &&
                //     renderProps.value
                //       .map(({ label }) => label)
                //       .includes(actionMeta.option.label)
                //   ) {
                //     const wtf = {
                //       ...actionMeta,
                //       action: "deselect-option"
                //     };
                //     const wtff = newValue.slice(0, -1);
                //     console.log("🚀 ~ onChange ~ wtf:", wtf);
                //     console.log("🚀 ~ onChange ~ wtff:", wtff);
                //     renderProps.onChange(wtff, wtf);
                //   } else renderProps.onChange(newValue, actionMeta);
                // }}
                //#region ui
                closeMenuOnSelect={false}
                placeholder="Sélectionner ou saisir un e-mail..."
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
                    const followerSubscription = getEntitySubscription({
                      org,
                      subscription
                    });

                    return {
                      ...defaultStyles
                      // backgroundColor: `${
                      //   !!followerSubscription ? "green" : "purple"
                      // } !important`
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
