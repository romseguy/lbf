import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Icon
} from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useState } from "react";
import { OrgForm } from "features/forms/OrgForm";
import { orgTypeFull3 } from "models/Org";
import { IoIosPeople } from "react-icons/io";

export const OrgFormModal = ({
  session,
  onCancel,
  onSubmit,
  ...props
}: {
  orgType?: string;
  session: Session;
  onCancel: () => void;
  onClose: () => void;
  onSubmit: (orgUrl: string) => Promise<void>;
}) => {
  const [orgType, setOrgType] = useState<string | undefined>(props.orgType);

  return (
    <Modal isOpen onClose={props.onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent maxWidth="xl">
        <ModalHeader display="flex" alignItems="center">
          <Icon as={IoIosPeople} color="green" mr={3} />
          Ajouter {orgTypeFull3(orgType)}
        </ModalHeader>
        <ModalCloseButton data-cy="orgPopoverCloseButton" />
        <ModalBody>
          <OrgForm
            orgType={orgType}
            setOrgType={setOrgType}
            session={session}
            onCancel={onCancel}
            onSubmit={async (orgUrl: string) => {
              await onSubmit(orgUrl);
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
