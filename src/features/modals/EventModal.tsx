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

export const EventModal = ({
  initialEventOrgs,
  session,
  onCancel,
  onSubmit,
  ...props
}: {
  session: Session;
  initialEventOrgs?: IOrg[];
  onCancel: () => void;
  onClose: () => void;
  onSubmit: (eventUrl: string) => Promise<void>;
}) => {
  return (
    <Modal isOpen onClose={props.onClose} closeOnOverlayClick={false}>
      <ModalOverlay>
        <ModalContent maxWidth="xl">
          <ModalHeader>Ajouter un événement</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EventForm
              initialEventOrgs={initialEventOrgs}
              session={session}
              onCancel={onCancel}
              onSubmit={async (eventUrl: string) => {
                await onSubmit(eventUrl);
              }}
            />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
