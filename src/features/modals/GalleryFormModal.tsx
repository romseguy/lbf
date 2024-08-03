import { EditIcon, SmallAddIcon, ChatIcon } from "@chakra-ui/icons";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalProps,
  Icon
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import React from "react";
import { Modal } from "features/common";
import { GalleryForm } from "features/forms/GalleryForm";
import { IGallery } from "models/Gallery";
import { AppQueryWithData } from "utils/types";
import { IEntity, isEvent } from "models/Entity";
import { removeProps } from "utils/object";
import { FaImages } from "react-icons/fa";

export const GalleryFormModal = (props: {
  query: AppQueryWithData<IEntity>;
  gallery?: IGallery;
  isCreator?: boolean;
  isOpen: boolean;
  onCancel: () => void;
  onClose: () => void;
  onSubmit: (gallery: IGallery) => void;
}) => {
  const isE = isEvent(props.query.data);
  return (
    <Modal {...props} closeOnOverlayClick={false}>
      <ModalOverlay>
        <ModalContent maxWidth="xl" mt={9}>
          <ModalHeader display="flex" alignItems="center">
            {props.gallery ? (
              <>
                <Icon as={FaImages} mr={3} />
                <EditIcon mr={2} />
                Modifier la galerie {isE && "de l'événement"}
              </>
            ) : (
              <>
                <ChatIcon mr={3} />
                <SmallAddIcon mr={2} />
                Ajouter une galerie
              </>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <GalleryForm {...props} />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
