import {
  Alert,
  AlertIcon,
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tag,
  Tbody,
  Td,
  Tr,
  useToast
} from "@chakra-ui/react";
import React from "react";
import { Button, Link } from "features/common";
import { IEvent, StatusTypes } from "models/Event";
import { IOrg, orgTypeFull } from "models/Org";
import { ITopic } from "models/Topic";
import { SubscriptionTypes } from "models/Subscription";
import { hasItems } from "utils/array";

export type ModalState<T> = {
  entity: T | null;
};

const isEvent = (
  entity: IEvent<string | Date> | ITopic
): entity is IEvent<string | Date> => {
  return (entity as IEvent<string | Date>).eventUrl !== undefined;
};
const isTopic = (entity: IEvent<string | Date> | ITopic): entity is ITopic => {
  return (entity as ITopic).topicName !== undefined;
};

interface NotifyModalProps<T> {
  event?: IEvent<string | Date>;
  org?: IOrg;
  query: any;
  mutation: any;
  setModalState: (modalState: ModalState<T>) => void;
  modalState: ModalState<T>;
}

export const NotifyModal = <T extends IEvent<string | Date> | ITopic>({
  event,
  org,
  query,
  mutation,
  setModalState,
  modalState
}: NotifyModalProps<T>) => {
  const toast = useToast({ position: "top" });
  const [postNotif, postNotifMutation] = mutation;
  const { entity } = modalState;

  if ((!org && !event) || !entity || (!isEvent(entity) && !isTopic(entity)))
    return null;

  //#region event or org
  const name = org ? org.orgName : event ? event.eventName : "";
  let subscriptions = org
    ? org.orgSubscriptions
    : event
    ? event.eventSubscriptions
    : [];
  //#endregion

  //#region modal entity
  let entityId: string = "";
  let entityIdKey = "eventUrl";
  let entityName: string = "";
  let entityTypeLabel = "l'événement";
  let payload: {
    org?: IOrg;
    event?: IEvent<string | Date>;
    orgIds?: string[];
  } = {
    orgIds: org ? [org._id] : undefined
  };
  let topicNotified: { email: string }[];
  let eventNotified: {
    email?: string | undefined;
    phone?: string | undefined;
    status: string;
  }[];
  let notifiedCount = 0;

  if (isTopic(entity)) {
    entityId = entity._id!;
    entityIdKey = "topicId";
    entityName = entity.topicName;
    entityTypeLabel = "la discussion";
    payload = {
      org,
      event
    };
    subscriptions = subscriptions.filter(({ phone }) => phone === undefined);

    if (entity.topicNotified) {
      topicNotified = entity.topicNotified;
      notifiedCount = topicNotified.length;
    }
  } else if (isEvent(entity)) {
    entityId = entity.eventUrl;
    entityName = entity.eventName;
    subscriptions = subscriptions.filter((subscription) => {
      return (
        org &&
        subscription.orgs.find((orgSubscription) => {
          return (
            orgSubscription.orgId === org._id &&
            orgSubscription.type === SubscriptionTypes.FOLLOWER
          );
        })
      );
    });

    if (entity.eventNotified) {
      eventNotified = entity.eventNotified;
      notifiedCount = eventNotified.length;
    }
  }
  //#endregion

  const onSubmit = async () => {
    const { emailList } = await postNotif({
      [entityIdKey]: entityId,
      payload
    }).unwrap();

    if (hasItems(emailList)) {
      toast({
        status: "success",
        title: `${emailList.length} abonnés invités !`
      });
      query.refetch();
    } else
      toast({
        status: "warning",
        title: "Aucun abonné invité"
      });

    setModalState({
      ...modalState,
      entity: null
    });
  };

  return (
    <Modal
      isOpen
      onClose={() =>
        setModalState({
          ...modalState,
          entity: null
        })
      }
    >
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            {isTopic(entity) ? "Notifications" : "Invitations"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="info" flexDirection="row">
              <AlertIcon />
              <Box>
                Ci-dessous la liste des abonnés{" "}
                {org ? orgTypeFull(org.orgType) : ""} <b>{name}</b> à{" "}
                {isTopic(entity) ? "notifier de " : "inviter à "}
                {entityTypeLabel} <b>{entityName}</b>.
              </Box>
            </Alert>

            <Box overflowX="auto">
              <Table>
                <Tbody>
                  {subscriptions
                    .map((subscription) => {
                      const e =
                        typeof subscription.user === "object"
                          ? subscription.user.email || ""
                          : subscription.email || "";
                      const p = subscription.phone;

                      if (
                        (isEvent(entity) &&
                          eventNotified.find(
                            ({ email, phone }) => email === e || phone === p
                          )) ||
                        (isTopic(entity) &&
                          topicNotified.find(({ email }) => email === e))
                      )
                        return {
                          email: e,
                          phone: p,
                          status: StatusTypes.PENDING
                        };

                      return { email: e, phone: p, status: StatusTypes.NOK };
                    })
                    .map((item) => {
                      return (
                        <Tr key={item.phone || item.email}>
                          <Td>{item.phone || item.email}</Td>
                          <Td>
                            {item.status === StatusTypes.PENDING ? (
                              <Tag colorScheme="green">
                                {isTopic(entity) ? "Notifié" : "Invité"}
                              </Tag>
                            ) : (
                              <Link
                                onClick={async () => {
                                  const { emailList } = await postNotif({
                                    [entityIdKey]: entityId,
                                    payload: { ...payload, email: item.email }
                                  }).unwrap();

                                  if (hasItems(emailList)) {
                                    toast({
                                      status: "success",
                                      title: `Une ${
                                        isTopic(entity)
                                          ? "notification"
                                          : "invitation"
                                      } a été envoyée à ${item.email} !`
                                    });
                                    query.refetch();
                                  } else
                                    toast({
                                      status: "warning",
                                      title: `Aucun abonné ${
                                        isTopic(entity) ? "notifié" : "invité"
                                      }`
                                    });
                                }}
                              >
                                <Tag colorScheme="red">
                                  {isTopic(entity) ? "Notifier" : "Inviter"}
                                </Tag>
                              </Link>
                            )}
                          </Td>
                        </Tr>
                      );
                    })}
                </Tbody>
              </Table>
            </Box>

            <Button
              mt={3}
              colorScheme="green"
              isLoading={postNotifMutation.isLoading}
              onClick={onSubmit}
            >
              Envoyer {subscriptions.length - notifiedCount}{" "}
              {isTopic(entity) ? "notifications" : "invitations"}
            </Button>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
