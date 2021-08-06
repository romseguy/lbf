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
import { Map } from "features/common";

export const MapModal = ({
  events,
  ...props
}: {
  onClose: () => void;
  events?: IEvent[];
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
          <ModalHeader>Carte des événements</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Map items={events} {...props} />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
