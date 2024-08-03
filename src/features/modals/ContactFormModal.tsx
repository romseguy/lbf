import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Modal } from "features/common";
import { ContactForm } from "features/forms/ContactForm";
import { useAppDispatch } from "store";
import {
  selectIsContactModalOpen,
  setIsContactModalOpen
} from "store/modalSlice";

export const ContactFormModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose: onModalClose } = useDisclosure();
  const isContactModalOpen = useSelector(selectIsContactModalOpen);
  const onClose = () => {
    dispatch(setIsContactModalOpen(false));
    onModalClose();
  };

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
      <ModalOverlay>
        <ModalContent maxWidth="xl">
          <ModalHeader>Formulaire de contact</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ContactForm onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
