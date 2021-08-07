import type { IOrg } from "models/Org";
import type { IEvent } from "models/Event";
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
import { Map } from "features/common";

export const MapModal = ({
  items,
  ...props
}: {
  onClose: () => void;
  items?: IEvent[] | IOrg[];
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        props.onClose && props.onClose();
        onClose();
      }}
      closeOnOverlayClick
    >
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            {items &&
              items[0] &&
              `Carte des ${
                "eventName" in items[0] ? "événements" : "organisations"
              }`}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {items ? (
              <Map items={items} {...props} />
            ) : (
              "Il n'y a encore rien à afficher sur cette carte, revenez plus tard !"
            )}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
