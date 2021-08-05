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
  dark = { bg: "gray.600" },
  pl = 3,
  ...props
}: BoxProps &
  BorderProps &
  SpacerProps &
  GridItemProps & {
    children: React.ReactNode | React.ReactNodeArray;
    light?: { [key: string]: string };
    dark?: { [key: string]: string };
  }) => {
  return (
    <GridItem light={light} dark={dark} pl={pl} {...props}>
      {children}
    </GridItem>
  );
};
