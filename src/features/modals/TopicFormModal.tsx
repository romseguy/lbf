import { EditIcon, AddIcon } from "@chakra-ui/icons";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Modal } from "features/common";
import { TopicForm } from "features/forms/TopicForm";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { ISubscription } from "models/Subscription";
import { ITopic } from "models/Topic";
import { AppQuery } from "utils/types";

export const TopicFormModal = (props: {
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
    <Modal {...props} closeOnOverlayClick={false}>
      {(setIsTouched, onCancel) => (
        <ModalOverlay>
          <ModalContent maxWidth="xl">
            <ModalHeader display="flex" alignItems="center">
              {props.topic ? (
                <>
                  <EditIcon mr={3} /> Modifier la discussion
                </>
              ) : (
                <>
                  <AddIcon mr={3} />
                  Ajouter une discussion
                </>
              )}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <TopicForm
                {...props}
                setIsTouched={setIsTouched}
                onCancel={onCancel}
              />
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Modal>
  );
};
