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
  useToast
} from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useMemo, useState } from "react";
import { IoIosPeople } from "react-icons/io";
import { Column, DeleteButton } from "features/common";
import { EventCategoryForm } from "features/forms/EventCategoryForm";
import { useEditOrgMutation } from "features/orgs/orgsApi";
import { useEditUserMutation } from "features/users/usersApi";
import { IEvent } from "models/Event";
import { getOrgEventCategories, IOrg, IOrgEventCategory } from "models/Org";
import api from "utils/api";
import { AppQueryWithData, TypedMap } from "utils/types";
import { OrgEventCategoriesModal } from "features/modals/OrgEventCategoriesModal";

export const EventsListCategories = ({
  events,
  org,
  orgQuery,
  selectedCategories,
  setSelectedCategories,
  isCreator,
  isLogin,
  setIsLogin,
  ...props
}: SpaceProps & {
  events: IEvent<string | Date>[];
  org?: IOrg;
  orgQuery?: AppQueryWithData<IOrg>;
  selectedCategories: number[];
  setSelectedCategories: (selectedCategories: number[]) => void;
  isCreator: boolean;
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
}) => {
  const {
    isOpen: isCategoriesModalOpen,
    onOpen: openCategoriesModal,
    onClose: closeCategoriesModal
  } = useDisclosure();

  const eventCategoriesByOrg = useMemo(() => {
    let categoriesByOrg: TypedMap<string, IOrgEventCategory[]> = {};

    for (const event of events) {
      for (const eventOrg of event.eventOrgs) {
        categoriesByOrg[eventOrg._id] = eventOrg.orgEventCategories;
      }
    }

    return categoriesByOrg;
  }, [events]);

  let renderedCategoryLabels: string[] = [];
  const renderCategory = (category: IOrgEventCategory) => {
    if (renderedCategoryLabels.includes(category.label)) return null;
    renderedCategoryLabels.push(category.label);

    const index = parseInt(category.index);
    const eventsCount = events.filter(
      (event) => event.eventCategory === index
    ).length;
    const isSelected = selectedCategories.includes(index);

    return (
      <Link
        key={index}
        variant="no-underline"
        onClick={() => {
          setSelectedCategories(
            selectedCategories.includes(index)
              ? selectedCategories.filter((sC) => sC !== index)
              : selectedCategories.concat([index])
          );
        }}
      >
        <Tag
          variant={isSelected ? "solid" : "outline"}
          bgColor={isSelected ? "teal" : "transparent"}
          cursor="pointer"
          mr={1}
          whiteSpace="nowrap"
        >
          {category.label}{" "}
          {eventsCount > 0 && (
            <Badge colorScheme="green" ml={1}>
              {eventsCount}
            </Badge>
          )}
        </Tag>
      </Link>
    );
  };

  if (!orgQuery) return null; // todo

  return (
    <Flex flexDirection="column" mb={5}>
      <Flex>
        <Text className="rainbow-text">Catégories</Text>
      </Flex>
      <Flex flexWrap="nowrap" overflowX="auto" {...props}>
        {isCreator && orgQuery && (
          <>
            <Tooltip label="Gérer les catégories d'événement">
              <Button
                aria-label="Gérer les catégories d'événement"
                leftIcon={<SettingsIcon />}
                size="xs"
                _hover={{ bg: "teal", color: "white" }}
                mr={1}
                onClick={openCategoriesModal}
              >
                Configuration
              </Button>
            </Tooltip>

            <OrgEventCategoriesModal
              isOpen={isCategoriesModalOpen}
              orgQuery={orgQuery}
              onClose={closeCategoriesModal}
            />
          </>
        )}

        {orgQuery && getOrgEventCategories(org).map(renderCategory)}

        {!orgQuery &&
          Object.keys(eventCategoriesByOrg).map((orgId) => {
            const categories = eventCategoriesByOrg[orgId];
            return categories.map(renderCategory);
          })}
      </Flex>
    </Flex>
  );
};

{
  /*
  const toast = useToast({ position: "top" });
  const [editUser] = useEditUserMutation();

  {!org && (
        <Tooltip label="Suggérer une nouvelle catégorie">
          <IconButton
            aria-label="Suggérer une nouvelle catégorie"
            colorScheme="teal"
            icon={<AddIcon />}
            size="xs"
            onClick={async () => {
              if (!session) {
                setIsLogin(isLogin + 1);
              } else {
                const category = prompt(
                  "Entrez le nom de la nouvelle catégorie que vous voulez proposer"
                );

                if (category) {
                  try {
                    const { error } = await api.post(`admin/suggestCategory`, {
                      category
                    });

                    if (error) throw error;

                    await editUser({
                      slug: session.user.userName,
                      payload: {
                        suggestedCategoryAt: new Date().toISOString()
                      }
                    });

                    toast({
                      status: "success",
                      title: "Merci de votre contribution !"
                    });
                  } catch (error: any) {
                    toast({
                      duration: null,
                      status: "error",
                      title:
                        error.message ||
                        "Une erreur est survenue, merci de reporter le bug sur le forum"
                    });
                  }
                }
              }
            }}
          />
        </Tooltip>
      )} 
*/
}
