import {
  Box,
  Flex,
  Link,
  SpaceProps,
  Tag,
  useColorMode
} from "@chakra-ui/react";
import { Status, StatusV } from "models/Project";
import React from "react";

export const ProjectsListFilters = ({
  selectedStatuses,
  setSelectedStatuses,
  ...props
}: SpaceProps & {
  selectedStatuses: string[];
  setSelectedStatuses: (selectedStatuses: string[]) => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Flex flexWrap="nowrap" overflowX="auto" {...props}>
      {Object.keys(Status).map((k) => {
        // const bgColor = Status[k].bgColor;
        const bgColor = "transparent";
        const isSelected = selectedStatuses.includes(k);

        return (
          <Link
            key={"status-" + k}
            variant="no-underline"
            onClick={() => {
              setSelectedStatuses(
                selectedStatuses.includes(k)
                  ? selectedStatuses.filter((sC) => sC !== k)
                  : [k]
              );
            }}
          >
            <Tag
              variant={isSelected ? "solid" : "outline"}
              color={isDark ? "white" : isSelected ? "white" : "black"}
              bgColor={
                isSelected
                  ? bgColor === "transparent"
                    ? isDark
                      ? "whiteAlpha.300"
                      : "blackAlpha.600"
                    : bgColor
                  : undefined
              }
              mr={1}
              whiteSpace="nowrap"
            >
              {StatusV[k]}
            </Tag>
          </Link>
        );
      })}
    </Flex>
  );
};
