import React from "react";
import {
  BorderProps,
  BoxProps,
  SpacerProps,
  GridItemProps
} from "@chakra-ui/react";
import { GridItem } from "./GridItem";

export const GridHeader = ({
  children,
  light = { bg: "orange.300" },
  dark = { bg: "gray.700" },
  pl = 3,
  ...props
}: GridItemProps & {
  light?: { [key: string]: any };
  dark?: { [key: string]: any };
}) => {
  return (
    <GridItem light={light} dark={dark} pl={pl} {...props}>
      {children}
    </GridItem>
  );
};
