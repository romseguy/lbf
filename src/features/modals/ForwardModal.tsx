import type { IEvent } from "models/Event";
import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from "@chakra-ui/react";
import { EventForwardForm } from "features/common/forms/EventForwardForm";
import { CalendarIcon } from "@chakra-ui/icons";

export const ForwardModal = (props: {
  event: IEvent;
  onCancel?: () => void;
  onClose: () => void;
  onSubmit?: () => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        props.onClose && props.onClose();
        onClose();
      }}
      closeOnOverlayClick
    >
      <ModalOverlay>
        <ModalContent>
          <ModalHeader display="flex" alignItems="center" pb={3}>
            <CalendarIcon mr={3} /> {props.event.eventName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={0}>
            <EventForwardForm {...props} />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
