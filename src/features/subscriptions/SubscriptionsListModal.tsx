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
import {
  EditSubscriptionPayload,
  useEditSubscriptionMutation
} from "features/api/subscriptionsApi";
import { AppHeading } from "features/common";
import { FullscreenModal } from "features/modals/FullscreenModal";
import { getRefId } from "models/Entity";
import { IOrg } from "models/Org";
import { getEmail, ISubscription } from "models/Subscription";
import React from "react";
import { css } from "twin.macro";
import { equals } from "utils/string";

export const SubscriptionsListModal = ({
  org,
  subscription,
  onClose
}: {
  org: IOrg;
  subscription: ISubscription;
  onClose: () => void;
}) => {
  const [editSub] = useEditSubscriptionMutation();
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
          <Td>Nom de l'événement</Td>
          <Td>Est participant ?</Td>
        </Thead>
        <Tbody>
          {org?.orgEvents.map((event) => {
            const isChecked = !!subscription.events?.find((eventSub) =>
              equals(getRefId(eventSub.event, "_id"), event._id)
            );
            return (
              <Tr key={event._id}>
                <Td>{event.eventName}</Td>
                <Td textAlign="center">
                  <Switch
                    isChecked={isChecked}
                    onChange={() => {
                      const events = (subscription.events || []).concat([
                        { event, eventId: event._id }
                      ]);
                      let payload: EditSubscriptionPayload = {
                        events
                      };
                      editSub({ subscriptionId: subscription._id, payload });
                    }}
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </FullscreenModal>
  );
};