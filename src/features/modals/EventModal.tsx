import { Session } from "next-auth";
import type { IOrg } from "models/Org";
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
import { EventForm } from "features/forms/EventForm";

export const EventModal = (props: {
  session: Session;
  initialEventOrgs?: IOrg[];
  onCancel: () => void;
  onClose: () => void;
  onSubmit: (eventUrl: string) => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        props.onClose && props.onClose();
        onClose();
      }}
      closeOnOverlayClick={false}
    >
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>Ajouter un événement</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EventForm initialEventOrgs={props.initialEventOrgs} {...props} />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
