import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react";
import { TopicForm } from "features/forms/TopicForm";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { ISubscription } from "models/Subscription";
import { ITopic } from "models/Topic";
import { AppQuery } from "utils/types";

export const TopicModal = (props: {
  org?: IOrg;
  event?: IEvent;
  query: AppQuery<IEvent | IOrg>;
  mutation: any;
  subQuery: AppQuery<ISubscription>;
  topic?: ITopic;
  isOpen: boolean;
  isCreator?: boolean;
  isFollowed?: boolean;
  isSubscribed?: boolean;
  onCancel: () => void;
  onClose: () => void;
  onSubmit: (topic?: ITopic) => void;
}) => {
  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      closeOnOverlayClick={false}
    >
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
