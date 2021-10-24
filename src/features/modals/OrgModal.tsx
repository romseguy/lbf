import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useState } from "react";
import { OrgForm } from "features/forms/OrgForm";
import { orgTypeFull3 } from "models/Org";

export const OrgModal = ({
  session,
  onCancel,
  onSubmit,
  ...props
}: {
  session: Session;
  onCancel: () => void;
  onClose: () => void;
  onSubmit: (orgUrl: string) => Promise<void>;
}) => {
  const [orgType, setOrgType] = useState<string>();

  return (
    <Modal isOpen onClose={props.onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ajouter {orgTypeFull3(orgType)}</ModalHeader>
        <ModalCloseButton data-cy="orgPopoverCloseButton" />
        <ModalBody>
          <OrgForm
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
