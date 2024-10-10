import { EditIcon } from "@chakra-ui/icons";
import {
  HStack,
  Switch,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import { TagTypes } from "features/api";
import {
  EditSubscriptionPayload,
  useEditSubscriptionMutation
} from "features/api/subscriptionsApi";
import { AppHeading } from "features/common";
import { FullscreenModal } from "features/modals/FullscreenModal";
import { getRefId } from "models/Entity";
import { IOrg } from "models/Org";
import { getEmail, ISubscription } from "models/Subscription";
import React, { useMemo } from "react";
import { css } from "twin.macro";
import { equals } from "utils/string";
import { AppQueryWithData } from "utils/types";

export const SubscriptionsListModal = ({
  orgQuery,
  subscription,
  onClose
}: {
  orgQuery: AppQueryWithData<IOrg>;
  subscription: ISubscription;
  onClose: () => void;
}) => {
  const org = orgQuery.data;
  console.log("🚀 ~ subscription.events:", subscription.events);
  const [editSub] = useEditSubscriptionMutation();
  const rows = useMemo(() => {
    return org?.orgEvents.map((event) => {
      const isChecked = !!subscription.events?.find(
        (eventSub) => getRefId(eventSub.event, "_id") === event._id
      );
      return (
        <Tr key={event._id}>
          <Td>{event.eventName}</Td>
          <Td textAlign="center">
            <Switch
              isChecked={isChecked}
              onChange={async () => {
                let events = subscription.events || [];
                if (!isChecked) {
                  events = events.concat([
                    {
                      event,
                      eventId: event._id,
                      tagTypes: [
                        {
                          type: TagTypes.TOPICS,
                          emailNotif: true,
                          pushNotif: true
                        }
                      ]
                    }
                  ]);
                } else {
                  events = events.filter(
                    (eventSub) => getRefId(eventSub.event, "_id") !== event._id
                  );
                }
                let payload: EditSubscriptionPayload = {
                  ...subscription,
                  events
                };
                await editSub({
                  subscriptionId: subscription._id,
                  payload
                });
                orgQuery.refetch();
              }}
            />
          </Td>
        </Tr>
      );
    });
  }, [org, subscription]);

  return (
    <FullscreenModal
      header={
        <HStack>
          <EditIcon color="lightgreen" />
          <Text>{getEmail(subscription)}</Text>
        </HStack>
      }
      bodyProps={{ bg: "black" }}
      onClose={onClose}
    >
      <AppHeading smaller my={3} ml={3}>
        Liste des événements
      </AppHeading>
      <Table
        bgColor="whiteAlpha.200"
        css={css`
          color: white;
          font-size: smaller;

          th {
            border-top: 1px solid white;
            color: white;
          }
        `}
      >
        <Thead bgColor="whiteAlpha.100">
          <Tr>
            <Th>Nom de l'événement</Th>
            <Th>Est participant ?</Th>
          </Tr>
        </Thead>
        <Tbody>{rows}</Tbody>
      </Table>
    </FullscreenModal>
  );
};
