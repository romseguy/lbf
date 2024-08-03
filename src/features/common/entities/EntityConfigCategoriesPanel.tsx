import { Flex, GridProps, Heading } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import React, { useEffect, useState } from "react";
import { FaFolder, FaFolderOpen } from "react-icons/fa";
import { css } from "twin.macro";
import {
  Button,
  EntityCategoriesList,
  Grid,
  GridHeader,
  GridItem,
  AppHeading as AppHeading,
  Link
} from "features/common";
import { EventConfigVisibility } from "features/events/EventConfigPanel";
import { CategoryForm } from "features/forms/CategoryForm";
import { breakpoints } from "features/layout/theme";
import { OrgConfigVisibility } from "features/orgs/OrgConfigPanel";
import { IEntity, IEntityCategory, EEntityCategoryKey } from "models/Entity";
import { hasItems } from "utils/array";
import { AppQueryWithData } from "utils/types";

type EntityConfigCategoriesPanelProps = {
  categories: IEntityCategory[];
  categoryKey: EEntityCategoryKey;
  query: AppQueryWithData<IEntity>;
};

export const EntityConfigCategoriesPanel = ({
  categories,
  categoryKey,
  query,
  isVisible,
  toggleVisibility,
  ...props
}: GridProps &
  (EventConfigVisibility | OrgConfigVisibility) &
  EntityConfigCategoriesPanelProps) => {
  const [isAdd, setIsAdd] = useState(false);
  const visibilityKey = ["eventTopicCategories", "orgTopicCategories"].includes(
    categoryKey
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

  return (
    <Grid {...props}>
      <Link
        onClick={() => {
          if (!isAdd) toggleVisibility(visibilityKey);
          if (!hasItems(categories)) setIsAdd(!isAdd);
        }}
      >
        <GridHeader
          borderTopRadius="lg"
          borderBottomRadius={isAdd || isOpen ? undefined : "lg"}
          dark={{
            _hover: {
              bg: "whiteAlpha.400"
            }
          }}
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
        <GridItem light={{ bg: "orange.100" }} dark={{ bg: "gray.500" }} p={5}>
          <AppHeading smaller mb={3}>
            Ajouter une catégorie{" "}
            {visibilityKey === "topicCategories"
              ? "de discussions"
              : "d'événements"}
          </AppHeading>

          <CategoryForm
            categories={categories}
            categoryKey={categoryKey}
            query={query}
            onSubmit={() => {
              setIsAdd(false);
              toggleVisibility(visibilityKey, true);
            }}
          />
        </GridItem>
      )}

      {isOpen && (
        <GridItem
          light={{ bg: "orange.50" }}
          dark={{ bg: "whiteAlpha.500" }}
          overflowX="auto"
          aria-hidden
        >
          <EntityCategoriesList
            categories={categories}
            categoryKey={categoryKey}
            query={query}
          />
        </GridItem>
      )}
    </Grid>
  );
};
