import {
  chakra,
  Icon,
  useColorMode,
  useStyles,
  useTab
} from "@chakra-ui/react";
import React from "react";
import { AppIcon } from "utils/types";

//@ts-expect-error
const StyledTab = chakra("button", { themeKey: "Tabs.Tab" });

export const EntityPageTab = React.forwardRef(
  (
    {
      currentTabIndex,
      icon,
      tabIndex,
      ...props
    }: {
      children: React.ReactNode | React.ReactNodeArray;
      currentTabIndex: number;
      icon: AppIcon;
      tabIndex: number;
      onClick?: () => void;
    },
    ref
  ) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === "dark";
    const styles = useStyles();
    const tabProps = useTab(props);

    tabProps.tabIndex = 0;

    if (currentTabIndex === tabIndex) {
      tabProps["aria-selected"] = true;
    }

    return (
      <StyledTab
        {...tabProps}
        __css={{
          ...styles.tab,
          bg: isDark ? "gray.800" : "lightcyan",
          _focus: {
            boxShadow: "none"
          },
          _hover: { bg: "cyan.500" },
          mr: 2
        }}
      >
        <Icon
          as={icon}
          boxSize={5}
          mr={tabProps.children ? 2 : undefined}
          verticalAlign="middle"
        />
        {tabProps.children}
      </StyledTab>
    );
  }
);
