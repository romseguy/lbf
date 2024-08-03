import React from "react";
import {
  GridItem as ChakraGridItem,
  GridItemProps,
  useColorModeValue
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

export const GridItem = ({
  children,
  light,
  dark,
  ...props
}: GridItemProps & {
  light?: GridItemProps;
  dark?: GridItemProps;
}) => {
  const styles = useColorModeValue(light, dark);
  return (
    <ChakraGridItem {...styles} {...props}>
      {children}
    </ChakraGridItem>
  );
};
