import React, { useState } from "react";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from "@chakra-ui/react";
import { OrgForm } from "features/forms/OrgForm";
import { Session } from "next-auth";
import { orgTypeFull2, orgTypeFull3, OrgTypesV } from "models/Org";

export const OrgModal = ({
  session,
  onCancel,
  onSubmit,
  ...props
}: {
  session: Session;
  onCancel: () => void;
  onClose: () => void;
  onSubmit: (orgUrl: string) => void;
}) => {
  const {
    isOpen: isOrgModalOpen,
    onOpen,
    onClose: onOrgModalClose
  } = useDisclosure({ defaultIsOpen: true });
  const [orgType, setOrgType] = useState<string>();

  const onClose = () => {
    props.onClose();
    onOrgModalClose();
  };

  return (
    <Modal
      isOpen={isOrgModalOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Ajouter {orgTypeFull3(orgType)}</ModalHeader>
        <ModalCloseButton data-cy="orgPopoverCloseButton" />
        <ModalBody>
          <OrgForm
            setOrgType={setOrgType}
            session={session}
            onCancel={onClose}
            onClose={onClose}
            onSubmit={(orgUrl: string) => {
              onClose();
              onSubmit(orgUrl);
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
