import { Modal as ChakraModal, ModalProps } from "@chakra-ui/react";

export const Modal = ({ children, ...props }: ModalProps) => {
  return (
    <ChakraModal trapFocus={false} {...props}>
      {children}
    </ChakraModal>
  );
};
