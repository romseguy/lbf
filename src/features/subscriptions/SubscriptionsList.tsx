import { Spinner, Table, Tbody, Td, Tr, useDisclosure } from "@chakra-ui/react";
import { IOrg } from "models/Org";
import { ISubscription } from "models/Subscription";
import React, { Fragment, useState } from "react";
import { AppQuery } from "utils/types";
import { SubscriptionsListItem } from "./SubscriptionsListItem";
import { SubscriptionsListModal } from "./SubscriptionsListModal";

export interface SubscriptionsListProps {
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
}

export const SubscriptionsList = (props: SubscriptionsListProps) => {
  const { orgQuery, isSubscriptionLoading } = props;
  const org = orgQuery.data;
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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [current, setCurrent] = useState<ISubscription>();
  const onEditClick = (sub: ISubscription) => {
    onOpen();
    setCurrent(sub);
  };

  return (
    <>
      <Table>
        <Tbody>
          {orgQuery.isLoading || orgQuery.isFetching ? (
            <Tr>
              <Td>
                <Spinner boxSize={4} />
              </Td>
            </Tr>
          ) : (
            org?.orgSubscriptions.map((subscription, index) => {
              return (
                <Fragment key={subscription._id}>
                  {isSubscriptionLoading[subscription._id] ? (
                    <Tr>
                      <Td>
                        <Spinner boxSize={4} />
                      </Td>
                    </Tr>
                  ) : (
                    <SubscriptionsListItem
                      {...props}
                      subscription={subscription}
                      onEditClick={() => onEditClick(subscription)}
                    />
                  )}
                </Fragment>
              );
            })
          )}
        </Tbody>
      </Table>

      {isOpen && org && current && (
        <SubscriptionsListModal
          org={org}
          subscription={current}
          onClose={onClose}
        />
      )}
    </>
  );
};
