import {
  FormControl,
  FormLabel,
  Box,
  Alert,
  AlertIcon,
  Flex
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useCallback, useEffect, useState } from "react";
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
import useFormPersist from "hooks/useFormPersist";
const { getEnv } = require("utils/env");

export const ContactForm = ({ ...props }: { onClose?: () => void }) => {
  const router = useRouter();

  //#region local state
  const [isDisabled, setIsDisabled] = useState(getEnv() === "production");
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
    formState
  } = useFormPersist<{
    formErrorMessage: string;
    email: string;
    message: string;
  }>(
    useForm<{ formErrorMessage: string; email: string; message: string }>({
      defaultValues: { message: "" }
    })
  );

  useLeaveConfirm({ formState });

  // const [storage, setStorage] = useState<Storage | undefined>();
  // useEffect(() => {
  //   setStorage(window.localStorage);
  // }, []);
  // let messageDefaultValue: string | undefined;
  // const formData = storage?.getItem("storageKey");
  // if (formData) {
  //   messageDefaultValue = JSON.parse(formData).topicMessage;
  // }

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
          //defaultValue=""
          rules={{ required: "Veuillez saisir un message" }}
          render={(renderProps) => {
            return (
              <RTEditor
                //defaultValue={messageDefaultValue}
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
          sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY}
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
