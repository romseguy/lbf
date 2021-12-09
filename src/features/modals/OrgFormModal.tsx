import {
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useState } from "react";
import { IoIosPeople } from "react-icons/io";
import { OrgForm } from "features/forms/OrgForm";
import { OrgType, orgTypeFull3, OrgTypes } from "models/Org";

export const OrgFormModal = ({
  session,
  onCancel,
  onSubmit,
  ...props
}: {
  orgType?: OrgType;
  session: Session;
  onCancel: () => void;
  onClose: () => void;
  onSubmit: (orgUrl: string) => Promise<void>;
}) => {
  const [orgType, setOrgType] = useState<OrgType>(
    props.orgType || OrgTypes.GENERIC
  );

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
