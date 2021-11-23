import { AddIcon } from "@chakra-ui/icons";
import {
  Badge,
  Flex,
  IconButton,
  Link,
  SpaceProps,
  Tag,
  Tooltip,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { Session } from "next-auth";
import React from "react";
import { useEditUserMutation } from "features/users/usersApi";
import { Category, IEvent } from "models/Event";
import { IOrg } from "models/Org";
import api from "utils/api";

export const EventsListCategories = ({
  events,
  org,
  selectedCategories,
  setSelectedCategories,
  session,
  isLogin,
  setIsLogin,
  ...props
}: SpaceProps & {
  events: IEvent<Date>[];
  org?: IOrg;
  selectedCategories: number[];
  setSelectedCategories: (selectedCategories: number[]) => void;
  session: Session | null;
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const toast = useToast({ position: "top" });
  const [editUser, editUserMutation] = useEditUserMutation();

  return (
    <Flex flexWrap="nowrap" overflowX="auto" {...props}>
      {Object.keys(Category).map((key) => {
        const k = parseInt(key);
        if (k === 0) return null;
        const bgColor = Category[k].bgColor;
        const eventsCount = events.filter(
          (event) => event.eventCategory === k
        ).length;
        const isSelected = selectedCategories.includes(k);

        return (
          <Link
            key={"cat-" + key}
            variant="no-underline"
            onClick={() => {
              setSelectedCategories(
                selectedCategories.includes(k)
                  ? selectedCategories.filter((sC) => sC !== k)
                  : selectedCategories.concat([k])
              );
            }}
          >
            <Tag
              variant={isSelected ? "solid" : "outline"}
              color={isDark ? "white" : isSelected ? "white" : "black"}
              bgColor={
                isSelected
                  ? bgColor === "transparent"
                    ? isDark
                      ? "whiteAlpha.300"
                      : "blackAlpha.600"
                    : bgColor
                  : undefined
              }
              mr={1}
              whiteSpace="nowrap"
            >
              {Category[k].label}{" "}
              {eventsCount > 0 && (
                <Badge colorScheme="green" ml={1}>
                  {eventsCount}
                </Badge>
              )}
            </Tag>
          </Link>
        );
      })}

      {!org && (
        <Tooltip label="Suggérer une nouvelle catégorie">
          <IconButton
            aria-label="Suggérer une nouvelle catégorie"
            icon={<AddIcon />}
            size="xs"
            _hover={{ bg: "teal", color: "white" }}
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
                      title: "Merci de votre contribution !",
                      isClosable: true
                    });
                  } catch (error: any) {
                    toast({
                      duration: null,
                      status: "error",
                      title:
                        error.message ||
                        "Une erreur est survenue, merci de reporter le bug sur le forum",
                      isClosable: true
                    });
                  }
                }
              }
            }}
          />
        </Tooltip>
      )}
    </Flex>
  );
};
