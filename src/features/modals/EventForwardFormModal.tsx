import { CalendarIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from "@chakra-ui/react";
import { Session } from "next-auth";
import React from "react";
import { EventForwardForm } from "features/forms/EventForwardForm";
import { IEvent } from "models/Event";

export const EventForwardFormModal = (props: {
  event: IEvent;
  session: Session;
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
