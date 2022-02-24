import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react";
import React from "react";
import { Session } from "next-auth";
import { Modal } from "features/common";
import { ProjectForm } from "features/forms/ProjectForm";
import { IOrg } from "models/Org";
import { IProject } from "models/Project";

export const ProjectFormModal = (props: {
  session: Session;
  org?: IOrg;
  project?: IProject;
  isCreator?: boolean;
  isFollowed?: boolean;
  isSubscribed?: boolean;
  onCancel: () => void;
  onClose: () => void;
  onSubmit: (project: IProject | null) => void;
}) => {
  return (
    <Modal isOpen onClose={props.onClose} closeOnOverlayClick={false}>
      <ModalOverlay>
        <ModalContent maxWidth="xl">
          <ModalHeader>
            {props.project ? "Modifier le projet" : "Ajouter un projet"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ProjectForm {...props} />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
