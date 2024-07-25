import { EditIcon, SmallAddIcon, ChatIcon } from "@chakra-ui/icons";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react";
import React from "react";
import { Modal } from "features/common";
import { GalleryForm } from "features/forms/GalleryForm";
import { IGallery } from "models/Gallery";
import { AppQueryWithData } from "utils/types";
import { IOrg } from "models/Org";
import { IEntity } from "models/Entity";

export const GalleryFormModal = (props: {
  query: AppQueryWithData<IEntity>;
  //subQuery: AppQuery<ISubscription>;
  gallery?: IGallery;
  isOpen: boolean;
  isCreator?: boolean;
  onCancel: () => void;
  onClose: () => void;
  onSubmit: (gallery: IGallery) => void;
}) => {
  return (
    <Modal {...props} closeOnOverlayClick={false}>
      <ModalOverlay>
        <ModalContent maxWidth="xl" mt={9}>
          <ModalHeader display="flex" alignItems="center">
            {props.gallery ? (
              <>
                <ChatIcon mr={3} />
                <EditIcon mr={2} />
                Modifier la galerie
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
