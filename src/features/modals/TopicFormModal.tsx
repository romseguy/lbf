import { EditIcon, SmallAddIcon, ChatIcon, CopyIcon } from "@chakra-ui/icons";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react";
import React from "react";
import { EntityButton, Modal } from "features/common";
import { TopicForm } from "features/forms/TopicForm";
import { IEntity } from "models/Entity";
import { ISubscription } from "models/Subscription";
import { ITopic } from "models/Topic";
import { AppQuery, AppQueryWithData } from "utils/types";
import { TopicCopyForm } from "features/forms/TopicCopyForm";
import { Session } from "utils/auth";

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
        <ModalContent maxWidth="4xl" mt={9}>
          <ModalHeader display="flex" alignItems="center">
            {props.topic ? (
              <>
                <ChatIcon mr={3} />
                <EditIcon mr={2} />
                Modifier la discussion
              </>
            ) : (
              <>
                <ChatIcon mr={3} />
                <SmallAddIcon mr={2} />
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

export const TopicCopyFormModal = (props: {
  query: AppQueryWithData<IEntity>;
  subQuery: AppQuery<ISubscription>;
  topic?: ITopic;
  session: Session;
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
        <ModalContent maxWidth="4xl" mt={9}>
          <ModalHeader display="flex" alignItems="center">
            <CopyIcon mr={1} />
            <EntityButton
              org={props.query.data}
              topic={props.topic}
              onClick={null}
            />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TopicCopyForm {...props} />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
