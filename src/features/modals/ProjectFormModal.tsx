import type { IOrg } from "models/Org";
import type { IProject } from "models/Project";
import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react";
import { ProjectForm } from "features/forms/ProjectForm";
import { Session } from "next-auth";

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