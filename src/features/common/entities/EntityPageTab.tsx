import {
  chakra,
  Icon,
  //Tab,
  TabProps,
  useColorMode,
  useStyles,
  useTab
} from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";
import { AppIcon } from "utils/types";

//@ts-expect-error
const Tab = chakra("button", { themeKey: "Tabs.Tab" });

export const EntityPageTab = ({
  currentTabIndex,
  icon,
  tabIndex,
  ...props
}: TabProps & {
  children: React.ReactNode | React.ReactNodeArray;
  currentTabIndex: number;
  icon: AppIcon;
  tabIndex: number;
  onClick?: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const styles = useStyles();
  const tabProps = useTab(props);
  const deviceProps = isMobile
    ? {
        flexBasis: "100%"
      }
    : {
        flex: 0,
        mr: 2
      };

  return (
    <Tab
      {...tabProps}
      {...deviceProps}
      aria-selected={tabIndex === currentTabIndex}
      __css={{
        ...styles.tab,
        display: "flex",
        alignItems: "center",
        bg: isDark ? "gray.800" : "lightcyan",
        mt: 3,
        _focus: {
          boxShadow: "none"
        },
        _hover: { bg: "cyan.500" }
      }}
    >
      <Icon as={icon} boxSize={5} mr={tabProps.children ? 2 : undefined} />
      {tabProps.children}
    </Tab>
  );
};
