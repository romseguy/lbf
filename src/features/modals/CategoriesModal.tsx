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
  UseDisclosureProps,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { IoIosPeople } from "react-icons/io";
import { EntityCategoriesList, Column } from "features/common";
import { CategoryForm } from "features/forms/CategoryForm";
import {
  IEntity,
  IEntityCategory,
  EEntityCategoryKey,
  isOrg,
} from "models/Entity";

import { IOrg } from "models/Org";
import { AppQueryWithData } from "utils/types";

export const CategoriesModal = ({
  isOpen = false,
  categories,
  categoryKey,
  query,
  ...props
}: UseDisclosureProps & {
  categories: IEntityCategory[];
  categoryKey: EEntityCategoryKey;
  query: AppQueryWithData<IEntity>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const entity = query.data;
  const isO = isOrg(entity);
  const label = "de discussions";

  const [isAdd, setIsAdd] = useState(false);
  const defaultTitle = `Catégories ${label}`;
  const [title, setTitle] = useState(defaultTitle);

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
            {isO ? entity.orgName : entity._id}
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
                setTitle(`Ajouter une catégorie ${label}`);
              }}
            >
              Ajouter une catégorie {label}
            </Button>
          )}

          {isAdd && query ? (
            <CategoryForm
              categories={categories}
              categoryKey={categoryKey}
              query={query}
              onCancel={() => {
                setIsAdd(false);
                setTitle(defaultTitle);
              }}
              onSubmit={() => setIsAdd(false)}
            />
          ) : categories.length > 0 ? (
            <Column
              bg={isDark ? "whiteAlpha.300" : "lightblue"}
              overflowX="auto"
              p={0}
            >
              <EntityCategoriesList
                categories={categories}
                categoryKey={categoryKey}
                query={query}
              />
            </Column>
          ) : (
            <Alert status="warning">
              <AlertIcon />
              Aucune catégories {label}.
            </Alert>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
