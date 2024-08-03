import { Tag, TagProps } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import React from "react";
import { getEventCategories, IOrg } from "models/Org";
import { getCategories, IEvent } from "models/Event";

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
  const categories = event ? getCategories(event) : getEventCategories(org);
  const category = categories.find(({ catId }) => catId === selectedCategory);

  if (!category) return null;

  return (
    <Tag variant="outline" bgColor="teal" color="white" {...props}>
      {category.label}
    </Tag>
  );
};
