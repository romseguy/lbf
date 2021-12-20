import {
  Alert,
  AlertIcon,
  Box,
  BoxProps,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useCallback, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  EmailControl,
  ErrorMessageText,
  Link,
  RTEditor
} from "features/common";
import api from "utils/api";
import { handleError } from "utils/form";
import { useRouter } from "next/router";

export const IconFooter = ({
  noContainer = false,
  ...props
}: BoxProps & {
  noContainer?: boolean;
}) => {
  const router = useRouter();
  const { isOpen, onOpen, onClose: onModalCLose } = useDisclosure();
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
    clearErrors("formErrorMessage");
    onModalCLose();
  };
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [messageHtml, setMessageHtml] = useState<string | undefined>();

  const link = (
    <Link
      onClick={() => {
        onOpen();
      }}
    >
      <Tooltip hasArrow label="Contacter le développeur  ͡❛ ͜ʖ ͡❛">
        <Image src="/favicon-32x32.png" />
      </Tooltip>
    </Link>
  );

  const onSubmit = async (form: { email: string; message: string }) => {
    console.log("submitted", form);
    const { email } = form;
    setIsLoading(true);

    try {
      await api.post("admin/contact", { email, message: messageHtml });
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

  const modal = (
    <Modal
      closeOnOverlayClick={false}
      closeOnEsc={false}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent maxWidth="xl">
        <ModalHeader>Envoyer un message au développeur</ModalHeader>
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
                      onChange={({ html, quillHtml }) => {
                        setMessageHtml(html);
                        renderProps.onChange(quillHtml);
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

  if (noContainer)
    return (
      <>
        {link}
        {modal}
      </>
    );

  return (
    <>
      <Box align="center" {...props}>
        {link}
      </Box>
      {modal}
    </>
  );
};
