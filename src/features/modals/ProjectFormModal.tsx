import { EditIcon, SmallAddIcon } from "@chakra-ui/icons";
import {
  Icon,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react";
import React from "react";
import { FaTools } from "react-icons/fa";
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
          <ModalHeader display="flex" alignItems="center">
            {props.project ? (
              <>
                <Icon as={FaTools} mr={3} />
                <EditIcon mr={2} />
                Modifier le projet
              </>
            ) : (
              <>
                <Icon as={FaTools} mr={3} />
                <SmallAddIcon mr={2} />
                Ajouter un projet
              </>
            )}
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
