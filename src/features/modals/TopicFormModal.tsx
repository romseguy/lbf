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
import { TopicForm } from "features/forms/TopicForm";
import { IEntity } from "models/Entity";
import { ISubscription } from "models/Subscription";
import { ITopic } from "models/Topic";
import { AppQuery, AppQueryWithData } from "utils/types";

export const TopicFormModal = (props: {
  query: AppQueryWithData<IEntity>;
  subQuery: AppQuery<ISubscription>;
  topic?: ITopic;
  isOpen: boolean;
  isCreator?: boolean;
  isFollowed?: boolean;
  onCancel: () => void;
  onClose: () => void;
  onSubmit: (topic: Partial<ITopic>) => void;
}) => {
  return (
    <Modal {...props} closeOnOverlayClick={false}>
      <ModalOverlay>
        <ModalContent maxWidth="xl" mt={9}>
          <ModalHeader display="flex" alignItems="center">
            {props.topic ? (
              <>
                <EditIcon mr={1} />
                <ChatIcon mr={3} /> Modifier la discussion
              </>
            ) : (
              <>
                <SmallAddIcon />
                <ChatIcon mr={3} />
                Ajouter une discussion
              </>
            )}
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
