import React from "react";
import {
  BorderProps,
  BoxProps,
  GridItem as ChakraGridItem,
  SpacerProps,
  GridItemProps,
  useColorModeValue
} from "@chakra-ui/react";

export const GridItem = ({
  children,
  light,
  dark,
  ...props
}: GridItemProps & {
  light?: { [key: string]: any };
  dark?: { [key: string]: any };
}) => {
  const styles = useColorModeValue(light, dark);
  return (
    <ChakraGridItem {...styles} {...props}>
      {children}
    </ChakraGridItem>
  );
};
