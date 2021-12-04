import {
  chakra,
  useColorModeValue,
  useTab,
  useStyles,
  Icon
} from "@chakra-ui/react";
import React from "react";
import { isMobile } from "react-device-detect";
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
        display="flex"
        flex={isMobile ? "0 0 auto" : "1"}
        //flex="0 0 auto"
        alignItems="center"
        justifyContent="center"
        bg={inactiveTabBg}
        mx={1}
        _focus={{
          boxShadow: "none"
        }}
        {...tabProps}
        __css={styles.tab}
      >
        <span
          style={{
            display: "inline-flex",
            flexShrink: 0,
            marginInlineEnd: "0.5rem"
          }}
        >
          <Icon as={icon} boxSize={5} verticalAlign="middle" />
        </span>
        {tabProps.children}
      </StyledTab>
    );
  }
);
