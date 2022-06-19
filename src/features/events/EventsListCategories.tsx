import { SettingsIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Flex,
  IconButton,
  SpaceProps,
  Tag,
  TagCloseButton,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { DeleteButton } from "features/common";
import { CategoriesModal } from "features/modals/CategoriesModal";
import { useEditOrgMutation } from "features/api/orgsApi";
import { IEvent } from "models/Event";
import { getOrgEventCategories, IOrg, IOrgEventCategory } from "models/Org";
import { AppQueryWithData } from "utils/types";

export const EventsListCategories = ({
  events,
  orgQuery,
  selectedCategories,
  setSelectedCategories,
  isCreator,
  // isLogin,
  // setIsLogin,
  ...props
}: SpaceProps & {
  events: IEvent<string | Date>[];
  orgQuery: AppQueryWithData<IOrg>;
  selectedCategories: string[];
  setSelectedCategories: (selectedCategories: string[]) => void;
  isCreator: boolean;
  // isLogin: number;
  // setIsLogin: (isLogin: number) => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [editOrg] = useEditOrgMutation();
  const org = orgQuery.data;
  const {
    isOpen: isCategoriesModalOpen,
    onOpen: openCategoriesModal,
    onClose: closeCategoriesModal
  } = useDisclosure();

  //#region local state
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const eventCategoriesByOrg = useMemo(() => {
    let categoriesByOrg: Record<string, IOrgEventCategory[]> = {};

    for (const event of events) {
      for (const eventOrg of event.eventOrgs) {
        categoriesByOrg[eventOrg._id] = eventOrg.orgEventCategories;
      }
    }

    return categoriesByOrg;
  }, [events]);

  let renderedCategoryLabels: string[] = [];
  //#endregion

  const renderCategory = (category: IOrgEventCategory) => {
    if (renderedCategoryLabels.includes(category.label)) return null;
    renderedCategoryLabels.push(category.label);

    const catId = category.catId;
    const eventsCount = events.filter(
      (event) => event.eventCategory === catId
    ).length;
    const isSelected = selectedCategories.includes(catId);

    return (
      <Tag
        key={`category-${catId}`}
        bg={
          isSelected
            ? isDark
              ? "pink.200"
              : "pink.500"
            : isDark
            ? "#81E6D9"
            : "#319795"
        }
        color={isDark ? "black" : "white"}
        cursor="pointer"
        fontWeight="normal"
        mr={1}
        p={0}
        _hover={{
          bg: isSelected
            ? isDark
              ? "pink.300"
              : "pink.600"
            : isDark
            ? "#4FD1C5"
            : "#2C7A7B"
        }}
        onClick={() => {
          setSelectedCategories(
            selectedCategories.includes(catId)
              ? selectedCategories.filter((sC) => sC !== catId)
              : selectedCategories.concat([catId])
          );
        }}
      >
        <Tooltip
          label={`Afficher les discussions de la catégorie "${category.label}"`}
          hasArrow
        >
          <Flex alignItems="center" p={2}>
            <Text fontWeight="bold">{category.label}</Text>
            {eventsCount > 0 && (
              <Badge bg={isDark ? "teal" : "#81E6D9"} borderRadius="md" ml={2}>
                {eventsCount}
              </Badge>
            )}
          </Flex>
        </Tooltip>
        {isCreator && (
          <Box
            borderColor={isDark ? "#BAC1CB" : "gray.500"}
            borderLeftWidth="1px"
            pr={3}
          >
            <TagCloseButton as="span">
              <DeleteButton
                color={isDark ? "black" : "white"}
                isIconOnly
                // tooltip props
                hasArrow
                label="Supprimer la catégorie"
                placement="right"
                // other props
                header={
                  <>
                    Êtes vous sûr de vouloir supprimer la catégorie{" "}
                    {category.label} ?
                  </>
                }
                isLoading={isLoading[`category-${catId}`]}
                onClick={async () => {
                  setIsLoading({ [`category-${catId}`]: true });
                  try {
                    await editOrg({
                      ["orgId"]: org._id,
                      payload: [`orgEventCategories.catId=${catId}`]
                    });
                  } catch (error) {
                    setIsLoading({ [`category-${catId}`]: false });
                    console.error(error);
                  }
                }}
              />
            </TagCloseButton>
          </Box>
        )}
      </Tag>
    );
  };

  useEffect(() => {
    if (!orgQuery.isFetching) {
      setIsLoading(
        Object.keys(isLoading).reduce(
          (obj, key) => ({ ...obj, [key]: false }),
          {}
        )
      );
    }
  }, [orgQuery.isFetching]);

  return (
    <Flex flexWrap="nowrap" overflowX="auto" {...props}>
      {isCreator && orgQuery && (
        <>
          <Tooltip label="Gérer les catégories d'événement">
            <IconButton
              aria-label="Gérer les catégories d'événement"
              height="32px"
              icon={<SettingsIcon />}
              _hover={{ bg: "teal", color: "white" }}
              mr={1}
              onClick={openCategoriesModal}
            >
              Configuration
            </IconButton>
          </Tooltip>

          <CategoriesModal
            categories={getOrgEventCategories(orgQuery.data)}
            fieldName="orgEventCategories"
            isOpen={isCategoriesModalOpen}
            query={orgQuery}
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
