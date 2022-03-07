import { Tag, TagProps } from "@chakra-ui/react";
import React from "react";
import { defaultCategory, defaultEventCategories } from "models/Event";
import { getOrgEventCategories, IOrg } from "models/Org";

export const EventCategoryTag = ({
  org,
  selectedCategory,
  ...props
}: TagProps & {
  org?: IOrg;
  selectedCategory: string;
}) => {
  const categories = getOrgEventCategories(org);
  const category = categories.find(({ catId }) => catId === selectedCategory);

  return (
    <Tag {...props} variant="outline" bgColor="teal" color="white">
      {category ? category.label : defaultCategory.label}
    </Tag>
  );
};
