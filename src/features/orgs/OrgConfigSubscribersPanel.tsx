import { Button, Heading, Grid, GridProps, Flex } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import React, { useEffect, useState } from "react";
import { FaFolder, FaFolderOpen } from "react-icons/fa";
import { css } from "twin.macro";
import {
  GridHeader,
  GridItem,
  AppHeading as AppHeading,
  Link
} from "features/common";
import { SubscriptionForm } from "features/forms/SubscriptionForm";
import { breakpoints } from "features/layout/theme";
import { SubscriptionsList } from "features/subscriptions/SubscriptionsList";
import { IOrg, orgTypeFull2 } from "models/Org";
import { ISubscription } from "models/Subscription";
import { useAppDispatch } from "store";
import { hasItems } from "utils/array";
import { AppQuery, AppQueryWithData } from "utils/types";
import { OrgConfigVisibility } from "./OrgConfigPanel";

export const OrgConfigSubscribersPanel = ({
  orgQuery,
  subQuery,
  isVisible,
  toggleVisibility,
  ...props
}: GridProps &
  OrgConfigVisibility & {
    orgQuery: AppQueryWithData<IOrg>;
    subQuery: AppQuery<ISubscription>;
  }) => {
  const org = orgQuery.data;
  const dispatch = useAppDispatch();

  //#region local state
  const [isAdd, setIsAdd] = useState(false);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState<{
    [key: string]: boolean;
  }>(
    org.orgSubscriptions.reduce((obj, subscription) => {
      return { ...obj, [subscription._id]: false };
    }, {})
  );
  useEffect(
    function onSubscriptionsChange() {
      if (!hasItems(org.orgSubscriptions))
        toggleVisibility("subscribers", false);
    },
    [org.orgSubscriptions]
  );
  //#endregion

  return (
    <Grid {...props}>
      <Link
        onClick={() => {
          if (hasItems(org.orgSubscriptions)) {
            toggleVisibility("subscribers");
          } else setIsAdd(!isAdd);
        }}
      >
        <GridHeader
          borderTopRadius="lg"
          borderBottomRadius={
            !isVisible.subscribers && !isAdd ? "lg" : undefined
          }
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
          <Grid templateColumns="1fr auto" alignItems="center">
            <GridItem
              display="flex"
              alignItems="center"
              css={css`
                @media (max-width: ${breakpoints.nav}) {
                  & {
                    padding-top: 12px;
                    padding-bottom: 12px;
                  }
                }
              `}
            >
              {isVisible.subscribers || isAdd ? (
                <FaFolderOpen size={24} color="white" />
              ) : (
                <FaFolder />
              )}
              <Heading size="sm" ml={2}>
                {org.orgSubscriptions.length} participant
                {org.orgSubscriptions.length !== 1 ? "s" : ""}
              </Heading>
            </GridItem>

            <GridItem
              css={css`
                @media (max-width: ${breakpoints.nav}) {
                  & {
                    grid-column: 1;
                    padding-bottom: 12px;
                  }
                }
              `}
            >
              <Button
                colorScheme={isAdd ? "red" : "teal"}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAdd(!isAdd);
                  toggleVisibility("subscribers", false);
                }}
                m={1}
                data-cy="orgAddSubscribers"
              >
                {isAdd ? "Annuler" : "Ajouter"}
              </Button>
            </GridItem>
          </Grid>
        </GridHeader>
      </Link>

      {isAdd && (
        <GridItem light={{ bg: "orange.100" }} dark={{ bg: "gray.500" }} p={5}>
          <AppHeading smaller mb={3}>
            Inscrire des participants {orgTypeFull2(org.orgType)}
          </AppHeading>

          <SubscriptionForm
            org={org}
            isSubscriptionLoading={isSubscriptionLoading}
            onSubmit={() => {
              setIsAdd(false);
            }}
          />
        </GridItem>
      )}

      {isVisible.subscribers && (
        <GridItem
          light={{ bg: "orange.50" }}
          dark={{ bg: "whiteAlpha.500" }}
          overflowX="auto"
          aria-hidden
        >
          <SubscriptionsList
            orgQuery={orgQuery}
            subQuery={subQuery}
            isSubscriptionLoading={isSubscriptionLoading}
            setIsSubscriptionLoading={setIsSubscriptionLoading}
          />
        </GridItem>
      )}
    </Grid>
  );
};
