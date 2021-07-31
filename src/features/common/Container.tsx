import React from "react";
import {
  BorderProps,
  Container as ChakraContainer,
  ContainerProps,
  useColorModeValue
} from "@chakra-ui/react";

export const Container = ({
  light,
  dark,
  ...props
}: BorderProps &
  ContainerProps &
  ContainerProps & {
    light?: { [key: string]: string };
    dark?: { [key: string]: string };
  }) => {
  const styles = useColorModeValue(light, dark);
  return <ChakraContainer {...styles} {...props} />;
};
