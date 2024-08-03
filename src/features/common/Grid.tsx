import React from "react";
import {
  BorderProps,
  Grid as ChakraGrid,
  SpacerProps,
  GridProps,
  useColorModeValue
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

export const Grid = ({
  children,
  light,
  dark,
  ...props
}: GridProps & {
  light?: { [key: string]: any };
  dark?: { [key: string]: any };
}) => {
  const styles = useColorModeValue(light, dark);
  return (
    <ChakraGrid {...styles} {...props}>
      {children}
    </ChakraGrid>
  );
};
