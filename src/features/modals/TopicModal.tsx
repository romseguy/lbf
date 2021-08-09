import type { IOrg } from "models/Org";
import type { ITopic } from "models/Topic";
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
import { TopicForm } from "features/forms/TopicForm";

export const TopicModal = (props: {
  entity: IOrg | IEvent;
  topic?: ITopic;
  isCreator?: boolean;
  isFollowed?: boolean;
  isSubscribed?: boolean;
  onCancel: () => void;
  onClose: () => void;
  onSubmit: (topicName: string) => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        props.onClose && props.onClose();
        onClose();
      }}
      closeOnOverlayClick={false}
    >
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>Ajouter un sujet de discussion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TopicForm {...props} />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
