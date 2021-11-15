import { Button, Flex, FlexProps, Tooltip } from "@chakra-ui/react";
import React from "react";
import { IOrg } from "models/Org";

export const TopicsListCategories = ({
  org,
  selectedCategories,
  setSelectedCategories,
  ...props
}: FlexProps & {
  org: IOrg;
  selectedCategories?: string[];
  setSelectedCategories: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >;
}) => {
  return (
    <Flex {...props}>
      {org.orgTopicsCategories?.map((category, index) => {
        const isSelected = selectedCategories?.find(
          (selectedCategory) => selectedCategory === category
        );

        return (
          <Tooltip
            key={"topicCategory-" + index}
            label={`Afficher les discussions de la catégorie "${category}"`}
            hasArrow
          >
            <Button
              variant={isSelected ? "solid" : "outline"}
              colorScheme={isSelected ? "pink" : undefined}
              fontSize="small"
              fontWeight="normal"
              height="auto"
              mr={2}
              p={1}
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
              {category}
            </Button>
          </Tooltip>
        );
      })}
    </Flex>
  );
};
