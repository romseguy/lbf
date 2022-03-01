import { Modal as ChakraModal, ModalProps } from "@chakra-ui/react";
import React, { useState } from "react";
import { onCancelWithConfirm, onCloseWithConfirm } from "utils/form";

export const Modal = ({
  children,
  ...props
}: ModalProps & {
  onCancel?: () => void;
  onClose: () => void;
  children:
    | ((
        setIsTouched: React.Dispatch<React.SetStateAction<boolean>>,
        onCancel: () => void
      ) => React.ReactNode | React.ReactNodeArray)
    | React.ReactNode
    | React.ReactNodeArray;
}) => {
  const [isTouched, setIsTouched] = useState(false);
  const onCancel = () =>
    props.onCancel
      ? onCancelWithConfirm({ isTouched, onCancel: props.onCancel })
      : undefined;

  const onClose = () =>
    onCloseWithConfirm({ isTouched, onClose: props.onClose });

  return (
    <ChakraModal {...props} trapFocus={false} onClose={onClose}>
      {typeof children === "function"
        ? children(setIsTouched, onCancel)
        : children}
    </ChakraModal>
  );
};
