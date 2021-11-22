import {
  Box,
  Button,
  Flex,
  FlexProps,
  Tag,
  TagCloseButton,
  Tooltip,
  useColorMode
} from "@chakra-ui/react";
import React, { useState } from "react";
import { IOrg } from "models/Org";
import { DeleteButton } from "features/common";

export const TopicsListCategories = ({
  org,
  orgQuery,
  mutation,
  isCreator,
  isSubscribed,
  selectedCategories,
  setSelectedCategories,
  ...props
}: FlexProps & {
  org: IOrg;
  orgQuery: any;
  mutation: any;
  isCreator?: boolean;
  isSubscribed?: boolean;
  selectedCategories?: string[];
  setSelectedCategories: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Flex {...props}>
      {org.orgTopicsCategories?.map((category, index) => {
        const isSelected = selectedCategories?.find(
          (selectedCategory) => selectedCategory === category
        );
        const topicsCount = org.orgTopics.filter(
          (topic) => topic.topicCategory === category
        ).length;

        return (
          <Tag
            key={`category-${index}`}
            variant={isSelected ? "solid" : "outline"}
            colorScheme={isSelected ? "pink" : undefined}
            cursor="pointer"
            fontSize="small"
            fontWeight="normal"
            ml={index !== 0 ? 1 : undefined}
            px={0}
            onClick={() => {
              selectedCategories?.find(
                (selectedCategory) => selectedCategory === category
              )
                ? setSelectedCategories(
                    selectedCategories.filter(
                      (selectedCategory) => selectedCategory !== category
                    )
                  )
                : setSelectedCategories(
                    (selectedCategories || []).concat([category])
                  );
            }}
          >
            <Tooltip
              label={`Afficher les discussions de la catégorie "${category}"`}
              hasArrow
            >
              <Box mx={2}>
                {category} {topicsCount > 0 && `(${topicsCount})`}
              </Box>
            </Tooltip>

            {(isCreator || isSubscribed) && (
              <Box
                borderColor={isDark ? "#BAC1CB" : "gray.500"}
                borderLeftWidth="1px"
                mr={2}
              >
                <TagCloseButton as="span">
                  <DeleteButton
                    isIconOnly
                    // tooltip props
                    hasArrow
                    label="Supprimer la catégorie"
                    placement="right"
                    // other props
                    header={
                      <>
                        Êtes vous sûr de vouloir supprimer la catégorie{" "}
                        {category} ?
                      </>
                    }
                    onClick={async () => {
                      const [editOrg, _] = mutation;
                      try {
                        await editOrg({
                          orgUrl: org.orgUrl,
                          payload: [`orgTopicsCategories=${category}`]
                        });
                        orgQuery.refetch();
                      } catch (error) {
                        console.error(error);
                      }
                    }}
                  />
                </TagCloseButton>
              </Box>
            )}
          </Tag>
        );
      })}
    </Flex>
  );
};