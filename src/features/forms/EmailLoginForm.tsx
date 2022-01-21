import { Button, Alert, AlertIcon, Flex } from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import { signIn } from "next-auth/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { EmailControl, ErrorMessageText } from "features/common";

export const EmailLoginForm = ({ ...props }: { onCancel?: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);

  //#region form
  const { clearErrors, errors, setError, handleSubmit, register, setValue } =
    useForm({
      mode: "onChange"
    });

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async ({ email }: { email: string }) => {
    setIsLoading(true);
    try {
      await signIn("email", { email });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  //#endregion

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <EmailControl
        name="email"
        register={register}
        setValue={setValue}
        errors={errors}
        isMultiple={false}
      />

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

      <Flex justifyContent="space-between" mt={5}>
        <Button
          colorScheme="gray"
          onClick={() => {
            onChange();
            props.onCancel && props.onCancel();
          }}
        >
          Annuler
        </Button>

        <Button
          colorScheme="green"
          type="submit"
          isLoading={isLoading}
          isDisabled={Object.keys(errors).length > 0}
          onClick={handleSubmit(onSubmit)}
        >
          Connexion
        </Button>
      </Flex>
    </form>
  );
};
