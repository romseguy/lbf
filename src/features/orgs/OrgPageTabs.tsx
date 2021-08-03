//@ts-nocheck
import React from "react";
import {
  Box,
  chakra,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useStyles,
  useTab
} from "@chakra-ui/react";

export const OrgPageTabs = ({
  children,
  ...props
}: {
  children: React.ReactNode | React.ReactNodeArray;
}) => {
  // 1. Reuse the styles for the Tab
  const StyledTab = chakra("button", { themeKey: "Tabs.Tab" });

  const CustomTab = React.forwardRef(
    (props: { children: React.ReactNode | React.ReactNodeArray }) => {
      // 2. Reuse the `useTab` hook
      const tabProps = useTab(props);
      const isSelected = !!tabProps["aria-selected"];

      // 3. Hook into the Tabs `size`, `variant`, props
      const styles = useStyles();

      return (
        <StyledTab __css={styles.tab} {...tabProps}>
          <Box as="span" mr="2">
            {isSelected ? "😎" : "😐"}
          </Box>
          {tabProps.children}
        </StyledTab>
      );
    }
  );

  return (
    <Tabs
      colorScheme="teal"
      isFitted
      variant="solid-rounded"
      borderWidth={1}
      borderColor="gray.200"
      borderRadius="lg"
      isLazy
    >
      <TabList mx={3} mt={3}>
        <CustomTab>Page d'accueil</CustomTab>
        <CustomTab>Événements</CustomTab>
        <CustomTab>Discussions</CustomTab>
      </TabList>
      {children}
    </Tabs>
  );
};
