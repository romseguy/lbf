import { Box, Flex, GridProps, Heading } from "@chakra-ui/react";
import React from "react";
import { FaMinusSquare, FaPlusSquare } from "react-icons/fa";
import { Grid, GridHeader, GridItem, Link } from "features/common";
import { EventConfigVisibility } from "features/events/EventConfigPanel";
import { BannerForm } from "features/forms/BannerForm";
import { OrgConfigVisibility } from "features/orgs/OrgConfigPanel";
import { IEntity } from "models/Entity";
import { AppQueryWithData } from "utils/types";

export const EntityConfigBannerPanel = ({
  query,
  isVisible,
  toggleVisibility,
  ...props
}: GridProps &
  (EventConfigVisibility | OrgConfigVisibility) & {
    query: AppQueryWithData<IEntity>;
  }) => {
  return (
    <Grid {...props}>
      <Link variant="no-underline" onClick={() => toggleVisibility("banner")}>
        <GridHeader
          alignItems="center"
          borderTopRadius="lg"
          borderBottomRadius={!isVisible.banner ? "lg" : undefined}
          dark={{
            _hover: {
              bg: "whiteAlpha.400"
            }
          }}
          light={{
            _hover: {
              bg: "orange.200"
            }
          }}
        >
          <Flex flexDirection="row" alignItems="center">
            {isVisible.banner ? <FaMinusSquare /> : <FaPlusSquare />}
            <Heading size="sm" ml={2} py={3}>
              Bannière
            </Heading>
          </Flex>
        </GridHeader>
      </Link>

      {isVisible.banner && (
        <GridItem light={{ bg: "orange.50" }} dark={{ bg: "whiteAlpha.500" }}>
          <Box p={5}>
            <BannerForm
              query={query}
              isVisible={isVisible}
              toggleVisibility={toggleVisibility}
            />
          </Box>
        </GridItem>
      )}
    </Grid>
  );
};
