import { CalendarIcon } from "@chakra-ui/icons";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react";
import { Session } from "next-auth";
import React from "react";
import { Modal } from "features/common";
import { EventForm } from "features/forms/EventForm";
import type { IOrg } from "models/Org";

export const EventFormModal = ({
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
          <ModalHeader display="flex" alignItems="center">
            <CalendarIcon color="green" mr={3} /> Ajouter un événement
          </ModalHeader>
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
