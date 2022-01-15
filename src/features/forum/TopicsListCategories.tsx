import {
  Badge,
  Box,
  Button,
  Flex,
  FlexProps,
  Tag,
  TagCloseButton,
  Text,
  Tooltip,
  useColorMode
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
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
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!orgQuery.isFetching) {
      let newIsLoading = {};
      Object.keys(isLoading).forEach((key) => {
        isLoading[key] = false;
      });
      setIsLoading(newIsLoading);
    }
  }, [orgQuery.isFetching]);

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
            bg={isDark ? "gray.600" : "white"}
            colorScheme={isSelected ? "pink" : undefined}
            fontSize="small"
            fontWeight="normal"
            mr={1}
            p={0}
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
              <Flex alignItems="center" cursor="pointer" p={2}>
                <Text fontWeight="bold">{category}</Text>
                {topicsCount > 0 && (
                  <Badge colorScheme="green" ml={2}>
                    {topicsCount}
                  </Badge>
                )}
              </Flex>
            </Tooltip>

            {(isCreator || isSubscribed) && (
              <Box
                borderColor={isDark ? "#BAC1CB" : "gray.500"}
                borderLeftWidth="1px"
                pr={3}
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
                    isLoading={isLoading[`category-${index}`]}
                    onClick={async () => {
                      setIsLoading({ [`category-${index}`]: true });
                      const [editOrg, _] = mutation;
                      try {
                        await editOrg({
                          orgUrl: org.orgUrl,
                          payload: [`orgTopicsCategories=${category}`]
                        });
                        orgQuery.refetch();
                      } catch (error) {
                        setIsLoading({ [`category-${index}`]: false });
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
