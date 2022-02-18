import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { ContactForm } from "features/forms/ContactForm";
import { selectIsContactModalOpen, setIsContactModalOpen } from "./modalSlice";
import { useAppDispatch } from "store";

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
      <ModalOverlay />
      <ModalContent maxWidth="xl">
        <ModalHeader>Envoyer un message au créateur</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ContactForm onClose={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
