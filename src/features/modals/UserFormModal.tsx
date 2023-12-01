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
import { IEntity } from "models/Entity";
import { ISubscription } from "models/Subscription";
import { IUser } from "models/User";
import { AppQuery, AppQueryWithData } from "utils/types";
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
                <EditIcon mr={1} />
                <Icon as={IoIosPerson} mr={3} /> Modifier l'utilisateur
              </>
            ) : (
              <>
                <SmallAddIcon />
                <Icon as={IoIosPerson} mr={3} />
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
