import {
  Tooltip,
  TooltipProps,
  Tag,
  TagProps,
  useColorMode
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import React, { PropsWithChildren } from "react";

export const CategoryTag = ({
  children,
  tooltipProps,
  ...props
}: PropsWithChildren<TagProps & { tooltipProps?: Partial<TooltipProps> }>) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Tooltip
      label={`Afficher les discussions de la catégorie "${children}"`}
      hasArrow
      {...tooltipProps}
    >
      <Tag
        variant="solid"
        bgColor={isDark ? "pink.200" : "pink.500"}
        color={isDark ? "black" : "white"}
        {...props}
      >
        {children}
      </Tag>
    </Tooltip>
  );
};
