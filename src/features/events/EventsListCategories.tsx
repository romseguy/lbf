import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Link,
  SpaceProps,
  Tag,
  Tooltip,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { Category } from "models/Event";
import { Session } from "next-auth";
import React from "react";
import { setSession } from "features/session/sessionSlice";
import { useEditUserMutation } from "features/users/usersApi";
import { useAppDispatch } from "store";
import api from "utils/api";
import { addDays, format, isBefore, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export const EventsListCategories = ({
  selectedCategories,
  setSelectedCategories,
  session,
  isLogin,
  setIsLogin,
  ...props
}: SpaceProps & {
  selectedCategories: number[];
  setSelectedCategories: (selectedCategories: number[]) => void;
  session: Session | null;
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
}) => {
  const { colorMode } = useColorMode();
  const dispatch = useAppDispatch();
  const isDark = colorMode === "dark";
  const toast = useToast({ position: "top" });
  const [editUser, editUserMutation] = useEditUserMutation();

  return (
    <Flex flexWrap="nowrap" overflowX="auto" {...props}>
      {Object.keys(Category).map((key) => {
        const k = parseInt(key);
        if (k === 0) return null;
        const bgColor = Category[k].bgColor;
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
              {Category[k].label}
            </Tag>
          </Link>
        );
      })}

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
              // if (
              //   session.user.suggestedCategoryAt &&
              //   isBefore(
              //     new Date(),
              //     addDays(parseISO(session.user.suggestedCategoryAt), 1)
              //   )
              // )
              //   return toast({
              //     status: "warning",
              //     title: `Vous devez attendre le ${format(
              //       parseISO(session.user.suggestedCategoryAt),
              //       "cccc d MMMM H'h'mm",
              //       { locale: fr }
              //     )} pour proposer une nouvelle catégorie`
              //   });

              const category = prompt(
                "Entrez le nom de la nouvelle catégorie que vous voulez proposer"
              );

              if (category) {
                try {
                  await api.post(`admin/suggestCategory`, { category });

                  await editUser({
                    userName: session.user.userName,
                    payload: {
                      suggestedCategoryAt: new Date().toISOString()
                    }
                  });
                  dispatch(setSession(null));

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
    </Flex>
  );
};
