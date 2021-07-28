import React from "react";
import {
  Text,
  BorderProps,
  BoxProps,
  GridItem,
  SpacerProps,
  Heading,
  Box,
  GridItemProps,
  useColorModeValue
} from "@chakra-ui/react";

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
  const styles = useColorModeValue(light, dark);

  return (
    <GridItem pl={pl} {...styles} {...props}>
      {children}
    </GridItem>
  );
};
