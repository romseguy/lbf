import { SettingsIcon } from "@chakra-ui/icons";
import {
  Badge,
  Flex,
  IconButton,
  Link,
  SpaceProps,
  Tag,
  Tooltip,
  useDisclosure
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { IEvent } from "models/Event";
import { getOrgEventCategories, IOrg, IOrgEventCategory } from "models/Org";
import { AppQueryWithData, TypedMap } from "utils/types";
import { CategoriesModal } from "features/modals/CategoriesModal";

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
  orgQuery?: AppQueryWithData<IOrg>;
  selectedCategories: string[];
  setSelectedCategories: (selectedCategories: string[]) => void;
  isCreator: boolean;
  // isLogin: number;
  // setIsLogin: (isLogin: number) => void;
}) => {
  const org = orgQuery?.data;
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

    const catId = category.catId;
    const eventsCount = events.filter(
      (event) => event.eventCategory === catId
    ).length;
    const isSelected = selectedCategories.includes(catId);

    return (
      <Link
        key={catId}
        variant="no-underline"
        onClick={() => {
          setSelectedCategories(
            selectedCategories.includes(catId)
              ? selectedCategories.filter((sC) => sC !== catId)
              : selectedCategories.concat([catId])
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
