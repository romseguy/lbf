import {
  Modal,
  ModalOverlay,
  ModalProps,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalBodyProps
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import React from "react";

export const FullscreenModal = ({
  children,
  header,
  bodyProps,
  ...props
}: Omit<ModalProps, "isOpen"> & {
  header: React.ReactNode;
  bodyProps?: ModalBodyProps;
}) => {
  return (
    <Modal size="full" isOpen closeOnOverlayClick {...props}>
      <ModalOverlay>
        <ModalContent bg="transparent" mt={0} minHeight="auto">
          <ModalHeader bg="blackAlpha.700" color="white">
            {header}
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody display="flex" flexDirection="column" p={0} {...bodyProps}>
            {children}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
