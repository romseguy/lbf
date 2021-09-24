import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Switch,
  useToast
} from "@chakra-ui/react";
import { IOrg, orgTypeFull4 } from "models/Org";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { handleError } from "utils/form";

export const OrgSubscriptionForm = ({
  org,
  ...props
}: {
  org: IOrg;
  onSubmit: () => void;
  onCancel: () => void;
}) => {
  const toast = useToast({ position: "top" });
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
  //#endregion

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: any) => {
    console.log("submitted", form);
    setIsLoading(true);

    let payload = {
      ...form
    };

    try {
      props.onSubmit && props.onSubmit();
    } catch (error) {
      handleError(error, (message, field) => {
        if (field) {
          setError(field, { type: "manual", message });
        } else {
          setError("formErrorMessage", { type: "manual", message });
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <FormControl display="flex" alignItems="center" mb={3}>
        <FormLabel>
          Recevoir un e-mail lorsque {orgTypeFull4(org.orgType)} publie un
          événement.
        </FormLabel>
        <Switch />
      </FormControl>

      <FormControl display="flex" alignItems="center" mb={3}>
        <FormLabel>
          Recevoir un e-mail lorsqu'une discussion est ajoutée à{" "}
          {orgTypeFull4(org.orgType)}.
        </FormLabel>
        <Switch />
      </FormControl>

      <FormControl display="flex" alignItems="center" mb={3}>
        <FormLabel>
          Recevoir un e-mail lorsqu'un projet est ajouté à{" "}
          {orgTypeFull4(org.orgType)}.
        </FormLabel>
        <Switch />
      </FormControl>

      <Flex justifyContent="space-between">
        <Button onClick={() => props.onCancel && props.onCancel()}>
          Annuler
        </Button>

        <Button
          colorScheme="green"
          type="submit"
          isLoading={isLoading}
          isDisabled={Object.keys(errors).length > 0}
          data-cy="eventFormSubmit"
        >
          Valider les préférences
        </Button>
      </Flex>
    </form>
  );
};
