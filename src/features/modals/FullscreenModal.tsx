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
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";

export const FullscreenModal = ({
  children,
  header,
  bodyProps,
  ...props
}: Omit<ModalProps, "isOpen"> & {
  header: React.ReactNode;
  bodyProps?: ModalBodyProps;
}) => {
  const isMobile = useSelector(selectIsMobile);

  return (
    <Modal size="full" isOpen closeOnOverlayClick {...props}>
      <ModalOverlay>
        <ModalContent bg="transparent" mt={0} minHeight="auto">
          <ModalHeader
            bg="blackAlpha.700"
            color="white"
            {...(isMobile ? { p: 1, mr: "24px" } : {})}
          >
            {header}
          </ModalHeader>
          <ModalCloseButton color="white" right={isMobile ? 0 : undefined} />
          <ModalBody display="flex" flexDirection="column" p={0} {...bodyProps}>
            {children}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
