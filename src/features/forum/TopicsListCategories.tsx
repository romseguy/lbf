import {
  Button,
  Flex,
  FlexProps,
  Tag,
  TagCloseButton,
  Tooltip
} from "@chakra-ui/react";
import React from "react";
import { IOrg } from "models/Org";
import { DeleteIcon } from "@chakra-ui/icons";
import { DeleteButton } from "features/common";

export const TopicsListCategories = ({
  org,
  orgQuery,
  mutation,
  selectedCategories,
  setSelectedCategories,
  ...props
}: FlexProps & {
  org: IOrg;
  orgQuery: any;
  mutation: any;
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
          <Tag
            key={`category-${index}`}
            variant={isSelected ? "solid" : "outline"}
            colorScheme={isSelected ? "pink" : undefined}
            cursor="pointer"
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
            <Tooltip
              key={"topicCategory-" + index}
              label={`Afficher les discussions de la catégorie "${category}"`}
              hasArrow
            >
              {category}
            </Tooltip>
            <TagCloseButton
              as="span"
              onClick={(e) => {
                e.stopPropagation();
                console.log("d");
              }}
            >
              <DeleteButton
                isIconOnly
                bg="transparent"
                _hover={{ bg: "transparent", color: "red" }}
                header={
                  <>
                    Êtes vous sûr de vouloir supprimer la catégorie {category} ?
                  </>
                }
                height="auto"
                minWidth={0}
                placement="right"
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
          </Tag>
        );
      })}
    </Flex>
  );
};
