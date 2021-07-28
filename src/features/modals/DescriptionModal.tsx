import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ModalProps
} from "@chakra-ui/react";

export const DescriptionModal = ({
  closeOnOverlayClick,
  defaultIsOpen,
  isOpen,
  ...props
}: ModalProps & {
  defaultIsOpen: boolean;
  header: React.ReactNode | React.ReactNodeArray;
  children: React.ReactNode | React.ReactNodeArray;
}) => {
  const { /* isOpen,  onOpen, */ onClose } = useDisclosure({ defaultIsOpen });

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        props.onClose && props.onClose();
        onClose();
      }}
      closeOnOverlayClick={closeOnOverlayClick}
    >
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>{props.header}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{props.children}</ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
