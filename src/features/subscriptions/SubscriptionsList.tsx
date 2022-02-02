import { Spinner, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import React from "react";
import { GridItem } from "features/common";
import { IOrg } from "models/Org";
import { ISubscription } from "models/Subscription";
import { AppQuery } from "utils/types";
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
  orgQuery: AppQuery<IOrg>;
  subQuery: AppQuery<ISubscription>;
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
              <>
                {isSubscriptionLoading[subscription._id] ? (
                  <Tr>
                    <Td>
                      <Spinner boxSize={4} />
                    </Td>
                  </Tr>
                ) : (
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
                )}
              </>
            );
          })}
        </Tbody>
      </Table>
    </GridItem>
  );
};
