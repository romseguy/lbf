import {
  Box,
  Flex,
  Link,
  SpaceProps,
  Tag,
  useColorMode
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { EProjectStatus, ProjectStatuses } from "models/Project";
import React from "react";

export const ProjectsListFilters = ({
  selectedStatuses,
  setSelectedStatuses,
  ...props
}: SpaceProps & {
  selectedStatuses: EProjectStatus[];
  setSelectedStatuses: React.Dispatch<React.SetStateAction<EProjectStatus[]>>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Flex flexWrap="nowrap" overflowX="auto" {...props}>
      {Object.keys(EProjectStatus).map((status: any) => {
        // const bgColor = Status[k].bgColor;
        const bgColor = "transparent";
        const isSelected = selectedStatuses.includes(status);

        return (
          <Link
            key={"status-" + status}
            onClick={() => {
              setSelectedStatuses(
                selectedStatuses.includes(status)
                  ? selectedStatuses.filter((sC) => sC !== status)
                  : [status]
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
              {ProjectStatuses[status as EProjectStatus]}
            </Tag>
          </Link>
        );
      })}
    </Flex>
  );
};
