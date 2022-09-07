import { Box, Flex, GridProps, Heading } from "@chakra-ui/react";
import React from "react";
import { FaMinusSquare, FaPlusSquare } from "react-icons/fa";
import { Grid, GridHeader, GridItem, Link } from "features/common";
import { EventConfigVisibility } from "features/events/EventConfigPanel";
import { LogoForm } from "features/forms/LogoForm";
import { OrgConfigVisibility } from "features/orgs/OrgConfigPanel";
import { isEvent } from "models/Entity";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { AppQueryWithData } from "utils/types";

export const EntityConfigLogoPanel = ({
  query,
  isVisible,
  toggleVisibility,
  ...props
}: GridProps &
  (EventConfigVisibility | OrgConfigVisibility) & {
    query: AppQueryWithData<IEvent | IOrg>;
  }) => {
  const entity = (query.data || {}) as IEvent | IOrg;
  const isE = isEvent(entity);

  return (
    <Grid {...props}>
      <Link variant="no-underline" onClick={() => toggleVisibility("logo")}>
        <GridHeader
          alignItems="center"
          borderTopRadius="lg"
          borderBottomRadius={!isVisible.logo ? "lg" : undefined}
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
          <Flex alignItems="center">
            {isVisible.logo ? <FaMinusSquare /> : <FaPlusSquare />}
            <Heading size="sm" ml={2} py={3}>
              Logo
            </Heading>
          </Flex>
        </GridHeader>
      </Link>

      {isVisible.logo && (
        <GridItem light={{ bg: "orange.50" }} dark={{ bg: "whiteAlpha.500" }}>
          <Box p={5}>
            <LogoForm
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
