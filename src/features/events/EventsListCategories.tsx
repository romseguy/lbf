import {
  Box,
  Flex,
  Link,
  SpaceProps,
  Tag,
  useColorMode
} from "@chakra-ui/react";
import { Category } from "models/Event";
import React from "react";

export const EventsListCategories = ({
  selectedCategories,
  setSelectedCategories,
  ...props
}: SpaceProps & {
  selectedCategories: number[];
  setSelectedCategories: (selectedCategories: number[]) => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Flex flexWrap="nowrap" overflowX="auto" {...props}>
      {Object.keys(Category).map((key) => {
        const k = parseInt(key);
        if (k === 0) return null;
        const bgColor = Category[k].bgColor;
        const isSelected = selectedCategories.includes(k);

        return (
          <Link
            key={"cat" + key}
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
    </Flex>
  );
};
