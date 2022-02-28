import React from "react";
import {
  Button as ChakraButton,
  ButtonProps,
  useColorModeValue
} from "@chakra-ui/react";

export const Button = ({
  children,
  light,
  dark,
  canWrap = false,
  ...props
}: ButtonProps & {
  light?: { [key: string]: any };
  dark?: { [key: string]: any };
  canWrap?: boolean;
}) => {
  let styles = useColorModeValue(light, dark);

  if (canWrap)
    styles = {
      ...styles,
      alignSelf: "flex-start",
      height: "auto",
      py: 2,
      whiteSpace: "normal"
    };

  return (
    <ChakraButton {...styles} {...props}>
      {children}
    </ChakraButton>
  );
};
