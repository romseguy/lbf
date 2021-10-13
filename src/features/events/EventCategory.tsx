import { useColorMode, Tag, SpaceProps } from "@chakra-ui/react";
import React from "react";
import { Category } from "models/Event";

export const EventCategory = ({
  selectedCategory,
  ...props
}: SpaceProps & {
  selectedCategory: number;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Tag
      {...props}
      color="white"
      bgColor={
        Category[selectedCategory].bgColor === "transparent"
          ? isDark
            ? "whiteAlpha.300"
            : "blackAlpha.600"
          : Category[selectedCategory].bgColor
      }
    >
      {Category[selectedCategory].label}
    </Tag>
  );
};
