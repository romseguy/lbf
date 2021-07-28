import React from "react";
import {
  Text,
  BorderProps,
  Button as ChakraButton,
  SpacerProps,
  Heading,
  Box,
  ButtonProps,
  useColorModeValue
} from "@chakra-ui/react";

export const Button = ({
  children,
  light,
  dark,
  ...props
}: BorderProps &
  SpacerProps &
  ButtonProps & {
    children: React.ReactNode | React.ReactNodeArray;
    light?: { [key: string]: any };
    dark?: { [key: string]: any };
  }) => {
  const styles = useColorModeValue(light, dark);
  return (
    <ChakraButton {...styles} {...props}>
      {children}
    </ChakraButton>
  );
};
