import { Tag, TagProps } from "@chakra-ui/react";
import React from "react";
import { getOrgEventCategories, IOrg } from "models/Org";
import { getEventCategories, IEvent } from "models/Event";

export const EventCategoryTag = ({
  event,
  org,
  selectedCategory,
  ...props
}: TagProps & {
  event?: IEvent;
  org?: IOrg;
  selectedCategory: string;
}) => {
  const categories = event
    ? getEventCategories(event)
    : getOrgEventCategories(org);
  const category = categories.find(({ catId }) => catId === selectedCategory);

  if (!category) return null;

  return (
    <Tag variant="outline" bgColor="teal" color="white" {...props}>
      {category.label}
    </Tag>
  );
};
