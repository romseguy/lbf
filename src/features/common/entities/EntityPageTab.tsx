import { QuestionIcon } from "@chakra-ui/icons";
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

//@ts-ignore
const Tab = chakra("button", { themeKey: "Tabs.Tab" });

export const EntityPageTab = ({
  currentTabIndex,
  tab,
  tabIndex,
  ...props
}: TabProps & {
  children: React.ReactNode | React.ReactNodeArray;
  currentTabIndex: number;
  tab: Record<string, any>;
  tabIndex: number;
  onClick?: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const isCurrent = tabIndex === currentTabIndex;
  //const styles = useTabsStyles();
  const tabProps = useTab(props);
  const styles = useStyles();
  //const styles = useMultiStyleConfig("Tabs", tabProps);
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
      aria-selected={isCurrent}
      __css={{
        ...styles.tab,
        display: "flex",
        alignItems: "center",
        bgColor: isCurrent ? undefined : isDark ? "gray.800" : "lightcyan",
        mt: 3,
        _focus: {
          boxShadow: "none"
        },
        _hover: { bg: "cyan.500" }
      }}
    >
      <Icon
        as={tab.icon || QuestionIcon}
        boxSize={5}
        mr={!isMobile && tab.label === "" ? 0 : 2}
      />
      {tabProps.children}
    </Tab>
  );
};
