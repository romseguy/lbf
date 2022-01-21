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
import React from "react";
import { isMobile } from "react-device-detect";

export const AppModal = ({
  closeOnOverlayClick,
  ...props
}: {
  closeOnOverlayClick?: boolean;
  onClose: () => void;
  header: React.ReactNode | React.ReactNodeArray;
  children: React.ReactNode | React.ReactNodeArray;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        props.onClose && props.onClose();
        onClose();
      }}
      closeOnOverlayClick={closeOnOverlayClick}
      size={isMobile ? "full" : undefined}
    >
      <ModalOverlay>
        <ModalContent maxWidth="xl">
          <ModalHeader px={3} pt={1} pb={0}>
            {props.header}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody px={3} pt={0}>
            {props.children}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
