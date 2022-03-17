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
import { refetchEvent } from "features/events/eventSlice";
import { useEditOrgMutation } from "features/orgs/orgsApi";
import { getOrgEventCategories, IOrg } from "models/Org";
import { useAppDispatch } from "store";
import { handleError } from "utils/form";
import { AppQueryWithData } from "utils/types";

export const EventCategoryForm = ({
  orgQuery,
  onCancel,
  ...props
}: {
  orgQuery: AppQueryWithData<IOrg>;
  onCancel: () => void;
  onSubmit: () => void;
}) => {
  const dispatch = useAppDispatch();
  const toast = useToast({ position: "top" });

  const [editOrg] = useEditOrgMutation();
  const org = orgQuery.data;
  const categories = getOrgEventCategories(org);

  const { clearErrors, errors, handleSubmit, register, setError } = useForm({
    mode: "onChange"
  });

  const [isLoading, setIsLoading] = useState(false);

  const onChange = () => clearErrors("formErrorMessage");
  const onSubmit = async (form: { category: string }) => {
    setIsLoading(true);
    try {
      await editOrg({
        orgId: org._id,
        payload: {
          orgEventCategories: categories.concat({
            catId: `${categories.length}`,
            label: form.category
          })
        }
      });
      orgQuery.refetch();
      dispatch(refetchEvent());
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
  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.category} isRequired mb={3}>
        <FormLabel>Nom de la catégorie</FormLabel>
        <Input
          name="category"
          ref={register({
            required: "Veuillez saisir un nom de catégorie"
          })}
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
