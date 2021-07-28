import React from "react";
import {
  Text,
  BorderProps,
  Spacer as ChakraSpacer,
  SpacerProps,
  Heading,
  Box,
  useColorModeValue
} from "@chakra-ui/react";

export const Spacer = ({
  light = { borderColor: "black" },
  dark = { borderColor: "white" },
  ...props
}: BorderProps &
  SpacerProps &
  SpacerProps & {
    light?: { [key: string]: string };
    dark?: { [key: string]: string };
  }) => {
  const styles = useColorModeValue(light, dark);
  return <ChakraSpacer {...styles} {...props} />;
};
