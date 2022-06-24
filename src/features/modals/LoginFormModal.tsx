import {
  Alert,
  AlertIcon,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { EmailControl } from "features/common";
import { SocialLogins } from "features/session/SocialLogins";
import { handleLoginWithSocial, magic } from "utils/auth";

export const LoginFormModal = (props: {
  onClose: () => void;
  onSubmit: () => void;
}) => {
  //#region local state
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  //#endregion

  //#region form
  const { register, control, errors, handleSubmit, setValue, watch } =
    useForm();
  const email = watch("email");
  //#endregion

  const onSubmit = async (form: { email: string }) => {
    try {
      setIsLoading(true);
      const redirectURI = `${process.env.NEXT_PUBLIC_URL}/callback`;
      magic.auth.loginWithMagicLink({
        email,
        redirectURI,
        showUI: false
      });
      setIsLoading(false);
      setIsSent(true);
      //props.onClose && props.onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => {
        props.onClose && props.onClose();
      }}
      closeOnOverlayClick={false}
    >
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>Connexion</ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={0}>
            <Alert status="info" mb={3}>
              <AlertIcon /> Pour vous connecter à votre compte Koala, pas besoin
              d'inscription, saisissez simplement votre adresse e-mail
              ci-dessous :
            </Alert>

            <form onSubmit={handleSubmit(onSubmit)}>
              {isSent && (
                <Alert status="success">
                  <AlertIcon />
                  Un e-mail de connexion vous a été envoyé à {email}.
                </Alert>
              )}

              <EmailControl
                name="email"
                register={register}
                control={control}
                errors={errors}
                display={isSent ? "none" : "block"}
                isMultiple={false}
                isRequired
                setValue={setValue}
                mb={3}
              />
              <Button
                colorScheme="green"
                display={isSent ? "none" : "block"}
                type="submit"
                isDisabled={Object.keys(errors).length > 0}
                isLoading={isLoading}
                mb={5}
              >
                Envoyer un e-mail de connexion
              </Button>
            </form>
            {!isSent && (
              <>
                <Text fontWeight="bold" mb={3}>
                  ...Ou connectez-vous par les réseaux sociaux :
                </Text>

                <SocialLogins onSubmit={handleLoginWithSocial} />
              </>
            )}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
