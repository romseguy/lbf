import { EditIcon, SmallAddIcon } from "@chakra-ui/icons";
import {
  Icon,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalProps
} from "@chakra-ui/react";
import React from "react";
import { Modal } from "features/common";
import { UserForm, UserFormProps } from "features/forms/UserForm";
import { IUser } from "models/User";
import { IoIosPerson } from "react-icons/io";

export const UserFormModal = (
  props: Omit<ModalProps, "children"> &
    UserFormProps & {
      onCancel: () => void;
      onClose: () => void;
      onSubmit: (user: Partial<IUser>) => void;
    }
) => {
  return (
    <Modal {...props} closeOnOverlayClick={false}>
      <ModalOverlay>
        <ModalContent maxWidth="xl" mt={9}>
          <ModalHeader display="flex" alignItems="center">
            {props.user ? (
              <>
                <Icon as={IoIosPerson} mr={3} />
                <EditIcon mr={2} />
                Modifier l'utilisateur
              </>
            ) : (
              <>
                <Icon as={IoIosPerson} mr={3} />
                <SmallAddIcon mr={2} />
                Ajouter un utilisateur
              </>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UserForm {...props} />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
