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
  children,
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
  //const tabProps = useTab(props);
  //const styles = useMultiStyleConfig("Tabs", tabProps);
  //const styles = useTabsStyles();
  const styles = useStyles();

  return (
    <Tab
      // {...tabProps}
      aria-selected={isCurrent}
      __css={{
        ...styles.tab,
        display: "flex",
        bgColor: isCurrent ? undefined : isDark ? "gray.800" : "lightcyan",
        _focus: {
          boxShadow: "none"
        },
        _hover: { bgColor: "cyan.500" },
        ...(isMobile
          ? {
              alignSelf: "flex-start",
              alignItems: "center",
              mb: 3,
              ml: 3,
              mt: tabIndex === 0 ? 3 : 0
            }
          : { flex: 0, mr: 3 })
      }}
      {...props}
    >
      <Icon
        as={tab.icon || QuestionIcon}
        boxSize={5}
        mr={!isMobile && tab.label === "" ? 0 : 2}
      />
      {children}
    </Tab>
  );
};
