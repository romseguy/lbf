import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react";
import React from "react";
import { Modal } from "features/common";
import { ProjectForm } from "features/forms/ProjectForm";
import { IOrg } from "models/Org";
import { IProject } from "models/Project";
import { Session } from "utils/auth";

export const ProjectFormModal = (props: {
  session: Session;
  org?: IOrg;
  project?: IProject;
  isCreator?: boolean;
  isFollowed?: boolean;
  onCancel: () => void;
  onClose: () => void;
  onSubmit: (project: IProject | null) => void;
}) => {
  return (
    <Modal {...props} isOpen closeOnOverlayClick={false}>
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
