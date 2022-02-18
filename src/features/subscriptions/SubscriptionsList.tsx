import { Spinner, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import React, { Fragment } from "react";
import { IOrg } from "models/Org";
import { ISubscription } from "models/Subscription";
import { AppQuery } from "utils/types";
import { SubscriptionsListItem } from "./SubscriptionsListItem";

export interface SubscriptionsListProps {
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
}

export const SubscriptionsList = (props: SubscriptionsListProps) => {
  const { org, orgQuery, isSubscriptionLoading } = props;

  if (orgQuery.isFetching) {
    return (
      <Table data-cy="subscriptions-list">
        <Tbody>
          <Tr>
            <Td>
              <Spinner boxSize={4} />
            </Td>
          </Tr>
        </Tbody>
      </Table>
    );
  }

  return (
    <Table data-cy="subscriptions-list">
      <Tbody>
        {org.orgSubscriptions.map((subscription, index) => {
          return (
            <Fragment key={subscription._id}>
              {isSubscriptionLoading[subscription._id] ? (
                <Tr>
                  <Td>
                    <Spinner boxSize={4} />
                  </Td>
                </Tr>
              ) : (
                <SubscriptionsListItem {...props} subscription={subscription} />
              )}
            </Fragment>
          );
        })}
      </Tbody>
    </Table>
  );
};
