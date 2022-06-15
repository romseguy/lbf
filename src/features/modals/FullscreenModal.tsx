import {
  Modal,
  ModalOverlay,
  ModalProps,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from "@chakra-ui/react";
import React from "react";

export const FullscreenModal = ({
  header,
  body,
  ...props
}: Omit<ModalProps, "children" | "isOpen"> & {
  header: React.ReactNode;
  body: React.ReactNode;
}) => {
  return (
    <Modal size="full" isOpen closeOnOverlayClick {...props}>
      <ModalOverlay>
        <ModalContent bg="transparent" mt={0} minHeight="auto">
          <ModalHeader bg="blackAlpha.700" color="white">
            {header}
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody display="flex" flexDirection="column" p={0}>
            {body}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
