import {
  FormControl,
  FormLabel,
  Box,
  Alert,
  AlertIcon,
  Flex
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useCallback, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import {
  EmailControl,
  RTEditor,
  ErrorMessageText,
  Button
} from "features/common";
import api from "utils/api";
import { handleError } from "utils/form";
import { useLeaveConfirm } from "hooks/useLeaveConfirm";
import useFormPersist from "react-hook-form-persist";

export const ContactForm = ({ ...props }: { onClose?: () => void }) => {
  const router = useRouter();

  //#region local state
  const [isDisabled, setIsDisabled] = useState(
    process.env.NODE_ENV === "production"
  );
  const [isLoading, setIsLoading] = useState(false);
  //#endregion

  //#region form
  const {
    register,
    control,
    errors,
    clearErrors,
    handleSubmit,
    setError,
    setValue,
    formState,
    watch
  } = useForm();

  useLeaveConfirm({ formState });
  useFormPersist("storageKey", {
    watch,
    setValue,
    storage: window.localStorage // default window.sessionStorage
  });
  let messageDefaultValue: string | undefined;
  const formData = localStorage.getItem("storageKey");
  if (formData) {
    messageDefaultValue = JSON.parse(formData).topicMessage;
  }

  const onClose = () => {
    clearErrors("formErrorMessage");
    props.onClose && props.onClose();
  };

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: { email: string; message: string }) => {
    console.log("submitted", form);
    const { email } = form;
    setIsLoading(true);

    try {
      await api.post("admin/contact", { email, message: form.message });
      setIsLoading(false);
      router.push("/sent", "/sent", { shallow: true });
      onClose();
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
      <EmailControl
        name="email"
        register={register}
        control={control}
        errors={errors}
        isMultiple={false}
        isRequired
        label="Votre e-mail"
        setValue={setValue}
        mb={3}
      />

      <FormControl isInvalid={!!errors["message"]} isRequired mb={3}>
        <FormLabel>Votre message</FormLabel>
        <Controller
          name="message"
          control={control}
          defaultValue=""
          rules={{ required: "Veuillez saisir un message" }}
          render={(renderProps) => {
            return (
              <RTEditor
                defaultValue={messageDefaultValue}
                placeholder="Écrire le message"
                onChange={({ html }) => {
                  renderProps.onChange(html);
                }}
              />
            );
          }}
        />
      </FormControl>

      <Box mb={3}>
        <ReCAPTCHA
          sitekey="6LeBibQdAAAAANMB-5I49ty5RpkqxkVh6rwfZ7t5"
          onChange={useCallback(() => setIsDisabled(false), [])}
        />
      </Box>

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
        <Button onClick={onClose}>Annuler</Button>

        <Button
          colorScheme="green"
          type="submit"
          isLoading={isLoading}
          isDisabled={isDisabled || Object.keys(errors).length > 0}
          data-cy="orgFormSubmit"
        >
          Envoyer
        </Button>
      </Flex>
    </form>
  );
};
