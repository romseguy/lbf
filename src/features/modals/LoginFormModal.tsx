import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react";
import React from "react";
import { SocialLogins } from "features/session/SocialLogins";
import { handleLoginWithSocial } from "lib/magic";

export const LoginFormModal = (props: {
  onClose: () => void;
  onSubmit: () => void;
}) => {
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
            <SocialLogins onSubmit={handleLoginWithSocial} />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
