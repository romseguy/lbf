import {
  Box,
  Flex,
  Link,
  SpaceProps,
  Tag,
  useColorMode
} from "@chakra-ui/react";
import { Status, Statuses } from "models/Project";
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
        const status = k as Status;
        // const bgColor = Status[k].bgColor;
        const bgColor = "transparent";
        const isSelected = selectedStatuses.includes(k);

        return (
          <Link
            key={"status-" + status}
            variant="no-underline"
            onClick={() => {
              setSelectedStatuses(
                selectedStatuses.includes(k)
                  ? selectedStatuses.filter((sC) => sC !== status)
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
              {Statuses[status]}
            </Tag>
          </Link>
        );
      })}
    </Flex>
  );
};
