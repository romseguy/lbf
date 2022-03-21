import { SettingsIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Flex,
  FlexProps,
  IconButton,
  Tag,
  TagCloseButton,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { DeleteButton } from "features/common";
import { useEditEventMutation } from "features/events/eventsApi";
import { CategoriesModal } from "features/modals/CategoriesModal";
import { useEditOrgMutation } from "features/orgs/orgsApi";
import { isEvent } from "models/Entity";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { AppQueryWithData } from "utils/types";

export const TopicsListCategories = ({
  query,
  isCreator,
  isSubscribed,
  selectedCategories,
  setSelectedCategories,
  ...props
}: FlexProps & {
  query: AppQueryWithData<IEvent | IOrg>;
  isCreator?: boolean;
  isSubscribed?: boolean;
  selectedCategories?: string[];
  setSelectedCategories: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [editEvent] = useEditEventMutation();
  const [editOrg] = useEditOrgMutation();
  const entity = query.data;
  const isE = isEvent(entity);
  const edit = isE ? editEvent : editOrg;

  //#region modal state
  const {
    isOpen: isCategoriesModalOpen,
    onOpen: openCategoriesModal,
    onClose: closeCategoriesModal
  } = useDisclosure();
  //#endregion

  //#region local state
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const topicCategories = isE
    ? entity.eventTopicCategories
    : entity.orgTopicCategories;
  const topics = isE ? entity.eventTopics : entity.orgTopics;

  useEffect(() => {
    if (!query.isFetching) {
      setIsLoading(
        Object.keys(isLoading).reduce(
          (obj, key) => ({ ...obj, [key]: false }),
          {}
        )
      );
    }
  }, [query.isFetching]);
  //#endregion

  return (
    <Flex {...props}>
      {isCreator && (
        <>
          <Tooltip label="Gérer les catégories de discussions">
            <IconButton
              aria-label="Gérer les catégories de discussions"
              height="32px"
              icon={<SettingsIcon />}
              _hover={{ bg: "teal", color: "white" }}
              mr={1}
              onClick={openCategoriesModal}
            ></IconButton>
          </Tooltip>

          <CategoriesModal
            categories={
              isE ? entity.eventTopicCategories : entity.orgTopicCategories
            }
            fieldName={isE ? "eventTopicCategories" : "orgTopicCategories"}
            isOpen={isCategoriesModalOpen}
            query={query}
            onClose={closeCategoriesModal}
          />
        </>
      )}

      {topicCategories.map(({ catId, label }, index) => {
        const isSelected = selectedCategories?.find(
          (selectedCategory) => selectedCategory === catId
        );
        const topicsCount = topics.filter(
          (topic) => topic.topicCategory === catId
        ).length;

        return (
          <Tag
            key={`category-${index}`}
            bg={
              isSelected
                ? isDark
                  ? "pink.200"
                  : "pink.500"
                : isDark
                ? "#81E6D9"
                : "#319795"
            }
            _hover={{
              bg: isSelected
                ? isDark
                  ? "pink.300"
                  : "pink.600"
                : isDark
                ? "#4FD1C5"
                : "#2C7A7B"
            }}
            color={isDark ? "black" : "white"}
            cursor="pointer"
            fontWeight="normal"
            mr={1}
            p={0}
            onClick={() => {
              selectedCategories?.find(
                (selectedCategory) => selectedCategory === catId
              )
                ? setSelectedCategories(
                    selectedCategories.filter(
                      (selectedCategory) => selectedCategory !== catId
                    )
                  )
                : setSelectedCategories(
                    (selectedCategories || []).concat([catId])
                  );
            }}
          >
            <Tooltip
              label={`Afficher les discussions de la catégorie "${label}"`}
              hasArrow
            >
              <Flex alignItems="center" p={2}>
                <Text fontWeight="bold">{label}</Text>
                {topicsCount > 0 && (
                  <Badge
                    bg={isDark ? "teal" : "#81E6D9"}
                    borderRadius="md"
                    ml={2}
                  >
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
                    color={isDark ? "black" : "white"}
                    isIconOnly
                    // tooltip props
                    hasArrow
                    label="Supprimer la catégorie"
                    placement="right"
                    // other props
                    header={
                      <>
                        Êtes vous sûr de vouloir supprimer la catégorie {catId}{" "}
                        ?
                      </>
                    }
                    isLoading={isLoading[`category-${index}`]}
                    onClick={async () => {
                      setIsLoading({ [`category-${index}`]: true });
                      try {
                        await edit({
                          [isE ? "eventId" : "orgId"]: entity._id,
                          payload: [
                            isE
                              ? `eventTopicCategories.catId=${catId}`
                              : `orgTopicCategories.catId=${catId}`
                          ]
                        });
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
