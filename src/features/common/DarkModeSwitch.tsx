import React from "react";
import Toggle from "react-toggle";
import { Box, BoxProps, useColorMode } from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";

export const DarkModeSwitch = (props: BoxProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <Box {...props}>
      <Toggle
        defaultChecked={isDark}
        icons={{
          checked: <FaMoon color="white" />,
          unchecked: <FaSun color="white" />
        }}
        onChange={toggleColorMode}
      />
    </Box>
  );
};
