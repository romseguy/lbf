import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  useToast
} from "@chakra-ui/react";
import React, { useState } from "react";
import { SocialLogins } from "features/session/SocialLogins";
import { handleLoginWithSocial, magic } from "lib/magic";
import { EmailControl } from "features/common";
import { useForm } from "react-hook-form";

export const LoginFormModal = (props: {
  onClose: () => void;
  onSubmit: () => void;
}) => {
  const toast = useToast({ position: "top" });
  //#region local state
  const [isLoading, setIsLoading] = useState(false);
  //#endregion

  //#region form
  const { register, control, errors, handleSubmit, setValue } = useForm();
  //#endregion

  const onSubmit = async (form: { email: string }) => {
    try {
      setIsLoading(true);
      const { email } = form;
      const redirectURI = `${process.env.NEXT_PUBLIC_URL}/callback`;
      magic.auth.loginWithMagicLink({
        email,
        redirectURI,
        showUI: false
      });
      toast({
        title: `Un e-mail de connexion vous a été envoyé à ${email}`
      });
      setIsLoading(false);
      props.onClose && props.onClose();
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <EmailControl
                name="email"
                register={register}
                control={control}
                errors={errors}
                isMultiple={false}
                isRequired
                setValue={setValue}
                mb={3}
              />
              <Button
                colorScheme="green"
                type="submit"
                isDisabled={Object.keys(errors).length > 0}
                isLoading={isLoading}
                mb={3}
              >
                Envoyer un e-mail de connexion
              </Button>
            </form>
            <Text fontWeight="bold" mb={3}>
              ...Ou connectez-vous par les réseaux sociaux :
            </Text>
            <SocialLogins onSubmit={handleLoginWithSocial} />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
