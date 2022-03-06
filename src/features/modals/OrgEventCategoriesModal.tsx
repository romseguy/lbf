import {
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Icon,
  SettingsIcon
} from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Badge,
  Button,
  Flex,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SpaceProps,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Tooltip,
  Tr,
  useDisclosure,
  UseDisclosureProps,
  useToast
} from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useState } from "react";
import { IoIosPeople } from "react-icons/io";
import { Column, DeleteButton } from "features/common";
import { EventCategoryForm } from "features/forms/EventCategoryForm";
import { useEditOrgMutation } from "features/orgs/orgsApi";
import { useEditUserMutation } from "features/users/usersApi";
import { IEvent } from "models/Event";
import { getOrgEventCategories, IOrg, IOrgEventCategory } from "models/Org";
import api from "utils/api";
import { AppQueryWithData } from "utils/types";

export const OrgEventCategoriesModal = ({
  isOpen = false,
  orgQuery,
  ...props
}: UseDisclosureProps & { orgQuery: AppQueryWithData<IOrg> }) => {
  const toast = useToast({ position: "top" });

  const [editOrg] = useEditOrgMutation();
  const org = orgQuery.data;
  const categories = getOrgEventCategories(org);

  const [isAdd, setIsAdd] = useState(false);

  const onClose = () => {
    setIsAdd(false);
    props.onClose && props.onClose();
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth="xl">
        <ModalHeader display="flex" flexDirection="column">
          <Flex alignItems="center">
            <Icon as={IoIosPeople} color="green" mr={3} boxSize={6} />
            {org.orgName}
          </Flex>
          <Flex alignItems="center">
            <SettingsIcon mr={3} />
            Catégories d'événements
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Button
            colorScheme="teal"
            rightIcon={isAdd ? <ChevronDownIcon /> : <ChevronRightIcon />}
            mb={5}
            onClick={() => {
              setIsAdd(!isAdd);
            }}
          >
            Ajouter une catégorie
          </Button>

          {isAdd && orgQuery ? (
            <EventCategoryForm
              orgQuery={orgQuery}
              onCancel={() => setIsAdd(false)}
              onSubmit={() => setIsAdd(false)}
            />
          ) : categories.length > 0 ? (
            <Column overflowX="auto">
              <Table>
                <Tbody>
                  {categories.map(({ index, label }) => (
                    <Tr key={`cat-${label}`}>
                      <Td>{label}</Td>
                      <Td textAlign="right">
                        {index !== "0" && (
                          <DeleteButton
                            isIconOnly
                            placement="bottom"
                            header={
                              <>
                                Êtes vous sûr de vouloir supprimer la catégorie{" "}
                                <Text
                                  display="inline"
                                  color="red"
                                  fontWeight="bold"
                                >
                                  {label}
                                </Text>{" "}
                                ?
                              </>
                            }
                            onClick={async () => {
                              try {
                                await editOrg({
                                  orgUrl: org.orgUrl,
                                  payload: [`orgEventCategories.label=${label}`]
                                }).unwrap();
                                orgQuery.refetch();
                                toast({
                                  status: "success",
                                  title: "La catégorie a été supprimée !"
                                });
                              } catch (error) {
                                console.error(error);
                                toast({
                                  status: "error",
                                  title:
                                    "La catégorie n'a pas pu être supprimée"
                                });
                              }
                            }}
                          />
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Column>
          ) : (
            <Alert status="warning">
              <AlertIcon />
              Aucune catégories
            </Alert>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
