import { Icon, SettingsIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useColorMode,
  UseDisclosureProps
} from "@chakra-ui/react";
import React, { useState } from "react";
import { IoIosPeople } from "react-icons/io";
import { CategoriesList, Column } from "features/common";
import { CategoryForm } from "features/forms/CategoryForm";
import { IEntityCategory, IEntityCategoryKey, isEvent } from "models/Entity";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { AppQueryWithData } from "utils/types";

export const CategoriesModal = ({
  isOpen = false,
  categories,
  fieldName,
  query,
  ...props
}: UseDisclosureProps & {
  categories: IEntityCategory[];
  fieldName: IEntityCategoryKey;
  query: AppQueryWithData<IEvent | IOrg>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const entity = query.data;
  const isE = isEvent(entity);

  const [isAdd, setIsAdd] = useState(false);
  const string =
    fieldName === "orgEventCategories" ? "d'événements" : "de discussions";
  const _title = `Catégories ${string}`;
  const [title, setTitle] = useState(_title);

  const onClose = () => {
    setIsAdd(false);
    props.onClose && props.onClose();
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={isDark ? "gray.600" : "lightcyan"} maxWidth="xl">
        <ModalHeader display="flex" flexDirection="column">
          <Flex alignItems="center">
            <Icon as={IoIosPeople} color="green" mr={3} boxSize={6} />
            {isE ? entity.eventName : entity.orgName}
          </Flex>
          <Flex alignItems="center">
            <SettingsIcon mr={3} />
            {title}
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!isAdd && (
            <Button
              colorScheme="teal"
              mb={5}
              onClick={() => {
                setIsAdd(!isAdd);
                setTitle(`Ajouter une catégorie ${string}`);
              }}
            >
              Ajouter une catégorie {string}
            </Button>
          )}

          {isAdd && query ? (
            <CategoryForm
              categories={categories}
              fieldName={fieldName}
              query={query}
              onCancel={() => {
                setIsAdd(false);
                setTitle(_title);
              }}
              onSubmit={() => setIsAdd(false)}
            />
          ) : categories.length > 0 ? (
            <Column
              bg={isDark ? "whiteAlpha.300" : "lightblue"}
              overflowX="auto"
              p={0}
            >
              <CategoriesList
                categories={categories}
                fieldName={fieldName}
                query={query}
              />
            </Column>
          ) : (
            <Alert status="warning">
              <AlertIcon />
              Aucune catégories {string}.
            </Alert>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
