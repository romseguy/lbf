import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Box,
  Alert,
  AlertIcon,
  Flex,
  useDisclosure
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  EmailControl,
  RTEditor,
  ErrorMessageText,
  Button
} from "features/common";
import { useAppDispatch } from "store";
import api from "utils/api";
import { handleError } from "utils/form";
import { selectIsContactModalOpen, setIsContactModalOpen } from "./modalSlice";

export const ContactModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose: onModalCLose } = useDisclosure();
  const isContactModalOpen = useSelector(selectIsContactModalOpen);

  //#region local state
  const [isDisabled, setIsDisabled] = useState(true);
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
    setValue
  } = useForm();

  const onClose = () => {
    dispatch(setIsContactModalOpen(false));
    clearErrors("formErrorMessage");
    onModalCLose();
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

  useEffect(() => {
    if (isContactModalOpen) onOpen();
    else onClose();
  }, [isContactModalOpen]);

  return (
    <Modal
      closeOnOverlayClick={false}
      closeOnEsc={false}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent maxWidth="xl">
        <ModalHeader>Envoyer un message au créateur</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form
            onChange={() => clearErrors("formErrorMessage")}
            onSubmit={handleSubmit(onSubmit)}
          >
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
