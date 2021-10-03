import React from "react";
import Toggle from "react-toggle";
import { useColorMode } from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";

export const DarkModeSwitch = (props: any) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <Toggle
      defaultChecked={isDark}
      icons={{
        checked: <FaMoon color="white" />,
        unchecked: <FaSun color="white" />
      }}
      onChange={toggleColorMode}
      {...props}
    />
  );
};
