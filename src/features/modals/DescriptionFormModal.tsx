import { EditIcon, SmallAddIcon } from "@chakra-ui/icons";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import React from "react";
import { Modal } from "features/common";
import { DescriptionForm } from "features/forms/DescriptionForm";

export const DescriptionFormModal = (props: {
  description?: string;
  isCreator?: boolean;
  isOpen: boolean;
  onCancel: () => void;
  onClose: () => void;
  onSubmit: (description: string) => void;
}) => {
  return (
    <Modal {...props} closeOnOverlayClick={false}>
      <ModalOverlay>
        <ModalContent maxWidth="xl" mt={9}>
          <ModalHeader display="flex" alignItems="center">
            {props.description ? (
              <>
                <EditIcon mr={2} />
                Modifier la description
              </>
            ) : (
              <>
                <SmallAddIcon mr={2} />
                Ajouter une description
              </>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <DescriptionForm {...props} />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
