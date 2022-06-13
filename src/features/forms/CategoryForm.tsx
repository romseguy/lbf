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
import { useForm } from "react-hook-form";
import { ErrorMessageText } from "features/common";
import { useEditOrgMutation } from "features/orgs/orgsApi";
import { IOrg } from "models/Org";
import { handleError } from "utils/form";
import { AppQueryWithData } from "utils/types";
import { useLeaveConfirm } from "hooks/useLeaveConfirm";
import useFormPersist from "react-hook-form-persist";
import { IEntityCategory, IEntityCategoryKey, isEvent } from "models/Entity";
import { IEvent } from "models/Event";
import { useEditEventMutation } from "features/events/eventsApi";

export const CategoryForm = ({
  categories,
  fieldName,
  query,
  onCancel,
  ...props
}: {
  categories: IEntityCategory[];
  fieldName: IEntityCategoryKey;
  query: AppQueryWithData<IEvent | IOrg>;
  onCancel: () => void;
  onSubmit: () => void;
}) => {
  const toast = useToast({ position: "top" });
  const [editEvent] = useEditEventMutation();
  const [editOrg] = useEditOrgMutation();
  const entity = query.data as IOrg;
  const isE = isEvent(entity);
  const edit = isE ? editEvent : editOrg;

  //#region local state
  const [isLoading, setIsLoading] = useState(false);
  //#endregion

  //#region form
  const {
    clearErrors,
    errors,
    handleSubmit,
    register,
    setError,
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

  const onChange = () => clearErrors("formErrorMessage");
  const onSubmit = async (form: { category: string }) => {
    setIsLoading(true);
    try {
      await edit({
        [isE ? "eventId" : "orgId"]: entity._id,
        payload: {
          [fieldName]: categories.concat({
            catId: `${categories.length}`,
            label: form.category
          })
        }
      });
      setIsLoading(false);
      toast({ status: "success", title: "La catégorie a été ajoutée !" });
      props.onSubmit();
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
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.category} isRequired mb={3}>
        <FormLabel>Nom de la catégorie</FormLabel>
        <Input
          name="category"
          ref={register({
            required: "Veuillez saisir un nom de catégorie"
          })}
          autoComplete="false"
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="category" />
        </FormErrorMessage>
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
        <Button colorScheme="red" onClick={onCancel}>
          Annuler
        </Button>
        <Button colorScheme="green" isLoading={isLoading} type="submit">
          Ajouter
        </Button>
      </Flex>
    </form>
  );
};
