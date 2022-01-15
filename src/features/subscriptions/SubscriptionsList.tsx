import { Table, Tbody } from "@chakra-ui/react";
import React from "react";
import { GridItem } from "features/common";
import { IOrg } from "models/Org";
import { SubscriptionsListItem } from "./SubscriptionsListItem";

export const SubscriptionsList = ({
  org,
  orgQuery,
  subQuery,
  isSubscriptionLoading,
  setIsSubscriptionLoading,
  onTagClick
}: {
  org: IOrg;
  orgQuery: any;
  subQuery: any;
  isSubscriptionLoading: {
    [key: string]: boolean;
  };
  setIsSubscriptionLoading: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean;
    }>
  >;
  onTagClick: (arg0: any) => void;
}) => {
  return (
    <GridItem
      light={{ bg: "orange.100" }}
      dark={{ bg: "gray.500" }}
      overflowX="auto"
      aria-hidden
    >
      <Table data-cy="subscriptions-list">
        <Tbody>
          {org.orgSubscriptions.map((subscription, index) => {
            return (
              <SubscriptionsListItem
                key={subscription._id}
                org={org}
                orgQuery={orgQuery}
                subscription={subscription}
                subQuery={subQuery}
                isSubscriptionLoading={isSubscriptionLoading}
                setIsSubscriptionLoading={setIsSubscriptionLoading}
                onTagClick={onTagClick}
              />
            );
          })}
        </Tbody>
      </Table>
    </GridItem>
  );
};
