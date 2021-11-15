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
  org?: IOrg;
  event?: IEvent;
  query: any;
  mutation: any;
  subQuery: any;
  topic: ITopic | null;
  isCreator?: boolean;
  isFollowed?: boolean;
  isSubscribed?: boolean;
  onCancel: () => void;
  onClose: () => void;
  onSubmit: (topic: ITopic | null) => void;
}) => {
  return (
    <Modal isOpen onClose={props.onClose} closeOnOverlayClick={false}>
      <ModalOverlay>
        <ModalContent maxWidth="xl">
          <ModalHeader>
            {props.topic ? "Modifier la discussion" : "Ajouter une discussion"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TopicForm {...props} />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
