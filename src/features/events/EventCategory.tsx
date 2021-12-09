import { useColorMode, Tag, SpaceProps } from "@chakra-ui/react";
import React from "react";
import { Category } from "models/Event";
import { IOrg } from "models/Org";

export const EventCategory = ({
  org,
  selectedCategory,
  ...props
}: SpaceProps & {
  org?: IOrg;
  selectedCategory: number;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  let category = Category[selectedCategory];

  if (org && org.orgEventCategories)
    category = org.orgEventCategories[selectedCategory];

  return (
    <Tag
      {...props}
      color="white"
      bgColor={
        category.bgColor === "transparent"
          ? isDark
            ? "whiteAlpha.300"
            : "blackAlpha.600"
          : category.bgColor
      }
    >
      {category.label}
    </Tag>
  );
};
