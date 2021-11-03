import { useColorMode } from "@chakra-ui/react";
import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import Toggle, { ToggleProps } from "react-toggle";

export const DarkModeSwitch = ({
  toggleProps,
  ...props
}: {
  toggleProps?: ToggleProps;
}) => {
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
      {...toggleProps}
    />
  );
};
