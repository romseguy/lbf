import { Box, Flex, GridProps, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaFolder, FaFolderOpen } from "react-icons/fa";
import {
  Button,
  CategoriesList,
  Grid,
  GridHeader,
  GridItem,
  Heading as AppHeading,
  Link
} from "features/common";
import { EventConfigVisibility } from "features/events/EventConfigPanel";
import { OrgConfigVisibility } from "features/orgs/OrgConfigPanel";
import { IEntityCategory, IEntityCategoryKey, isEvent } from "models/Entity";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { AppQueryWithData } from "utils/types";
import { breakpoints } from "theme/theme";
import { hasItems } from "utils/array";
import { css } from "twin.macro";
import { CategoryForm } from "features/forms/CategoryForm";
import { useEditEventMutation } from "features/events/eventsApi";
import { useEditOrgMutation } from "features/orgs/orgsApi";

type EntityConfigCategoriesPanelProps = {
  categories: IEntityCategory[];
  fieldName: IEntityCategoryKey;
  query: AppQueryWithData<IEvent | IOrg>;
};

export const EntityConfigCategoriesPanel = ({
  categories,
  fieldName,
  query,
  isVisible,
  toggleVisibility,
  ...props
}: GridProps &
  (EventConfigVisibility | OrgConfigVisibility) &
  EntityConfigCategoriesPanelProps) => {
  const [editEvent] = useEditEventMutation();
  const [editOrg] = useEditOrgMutation();

  const entity = query.data;
  const isE = isEvent(entity);
  const edit = isE ? editEvent : editOrg;

  //#region local state
  const [isAdd, setIsAdd] = useState(false);
  const visibilityKey = ["eventTopicCategories", "orgTopicCategories"].includes(
    fieldName
  )
    ? "topicCategories"
    : "eventCategories";
  const isOpen = isVisible[visibilityKey];
  useEffect(
    function onCategoriesChange() {
      if (!hasItems(categories)) toggleVisibility(visibilityKey, false);
    },
    [categories]
  );
  //#endregion

  return (
    <Grid {...props}>
      <Link
        variant="no-underline"
        onClick={() => {
          toggleVisibility(visibilityKey);
          if (!hasItems(categories)) setIsAdd(!isAdd);
        }}
      >
        <GridHeader
          borderTopRadius="lg"
          borderBottomRadius={isAdd || isOpen ? undefined : "lg"}
          light={{
            _hover: {
              bg: "orange.200"
            }
          }}
        >
          <Grid templateColumns="1fr auto" alignItems="center">
            <GridItem
              css={css`
                @media (max-width: ${breakpoints.nav}) {
                  & {
                    padding-top: 12px;
                    padding-bottom: 12px;
                  }
                }
              `}
            >
              <Flex alignItems="center">
                {isOpen || isAdd ? (
                  <FaFolderOpen size={24} color="white" />
                ) : (
                  <FaFolder />
                )}
                <Heading size="sm" ml={2}>
                  {categories.length} catégorie
                  {categories.length !== 1 ? "s" : ""}
                </Heading>
              </Flex>
            </GridItem>

            <GridItem
              css={css`
                @media (max-width: ${breakpoints.nav}) {
                  & {
                    grid-column: 1;
                    padding-bottom: 12px;
                  }
                }
              `}
            >
              <Button
                colorScheme={isAdd ? "red" : "teal"}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAdd(!isAdd);
                  toggleVisibility("topicCategories", false);
                }}
                m={1}
                data-cy="orgAddTopicCategories"
              >
                {isAdd ? "Annuler" : "Ajouter"}
              </Button>
            </GridItem>
          </Grid>
        </GridHeader>
      </Link>

      {isAdd && (
        <GridItem light={{ bg: "orange.50" }} dark={{ bg: "gray.500" }}>
          <AppHeading>
            Ajouter une catégorie{" "}
            {visibilityKey === "topicCategories"
              ? "de discussions"
              : "d'événements"}
          </AppHeading>

          <Box p={5}>
            <CategoryForm
              categories={categories}
              fieldName={fieldName}
              query={query}
              onCancel={() => {
                setIsAdd(false);
              }}
              onSubmit={() => {
                setIsAdd(false);
                toggleVisibility(visibilityKey, true);
              }}
            />
          </Box>
        </GridItem>
      )}

      {isOpen && (
        <GridItem
          light={{ bg: "orange.100" }}
          dark={{ bg: "gray.500" }}
          overflowX="auto"
          aria-hidden
        >
          <CategoriesList
            categories={categories}
            fieldName={fieldName}
            query={query}
          />
        </GridItem>
      )}
    </Grid>
  );
};
