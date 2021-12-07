import {
  chakra,
  useColorModeValue,
  useTab,
  useStyles,
  Icon
} from "@chakra-ui/react";
import React from "react";
import { css } from "twin.macro";
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
    const inactiveTabBg = useColorModeValue("gray.100", "whiteAlpha.300");
    const tabProps = useTab(props);

    tabProps.tabIndex = 0;

    if (currentTabIndex === tabIndex) {
      tabProps["aria-selected"] = true;
    }

    const styles = useStyles();

    return (
      <StyledTab
        {...tabProps}
        __css={styles.tab}
        css={css`
          display: inline-block;
        `}
        bg={inactiveTabBg}
        mr={2}
        _focus={{
          boxShadow: "none"
        }}
      >
        <Icon as={icon} boxSize={5} mr={2} verticalAlign="middle" />
        {tabProps.children}
      </StyledTab>
    );
  }
);
