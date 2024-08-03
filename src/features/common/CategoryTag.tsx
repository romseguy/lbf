import { Tag, TagProps, useColorMode } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import React, { ReactNodeArray } from "react";

export const CategoryTag = ({
  children,
  ...props
}: TagProps & {
  children: React.ReactNode | ReactNodeArray;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Tag
      {...props}
      variant="solid"
      bgColor={isDark ? "pink.200" : "pink.500"}
      color={isDark ? "black" : "white"}
    >
      {children}
    </Tag>
  );
};
