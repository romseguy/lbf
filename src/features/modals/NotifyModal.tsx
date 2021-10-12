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

  if (
    (!org && !event) ||
    !modalState.entity ||
    (!isEvent(modalState.entity) && !isTopic(modalState.entity))
  )
    return null;

  const { entity } = modalState;
  let entityIdKey = "eventUrl";
  let entityTypeLabel = "l'événement";
  let payload: {
    org?: IOrg;
    event?: IEvent<string | Date>;
    orgIds?: string[];
  } = {
    orgIds: org ? [org._id] : undefined
  };

  let followerCount = org
    ? org.orgSubscriptions.map(
        ({ orgs }) =>
          orgs.filter(
            ({ orgId, type }) =>
              orgId === org._id && type === SubscriptionTypes.FOLLOWER
          ).length
      ).length
    : event
    ? event.eventSubscriptions.length
    : 0;

  let notifiedCount = 0;

  if (isEvent(entity) && entity.eventNotified) {
    notifiedCount = entity.eventNotified.length;
  } else if (isTopic(entity) && entity.topicNotified) {
    notifiedCount = entity.topicNotified.length;
  }

  if (isTopic(entity)) {
    entityIdKey = "topicId";
    entityTypeLabel = "la discussion";
    payload = {
      org,
      event
    };
  }

  const entityId = isEvent(entity)
    ? entity.eventUrl
    : isTopic(entity)
    ? entity._id
    : "";
  const entityName = isEvent(entity)
    ? entity.eventName
    : isTopic(entity)
    ? entity.topicName
    : "";
  const entityNotified = isEvent(entity)
    ? entity.eventNotified || []
    : isTopic(entity)
    ? entity.topicNotified || []
    : [];

  const name = org ? org.orgName : event ? event.eventName : "";
  const subscriptions = org ? org.orgSubscriptions : [];

  const onSubmit = async () => {
    const { emailList } = await postNotif({
      [entityIdKey]: entityId,
      payload
    }).unwrap();

    console.log(emailList);

    if (hasItems(emailList)) {
      toast({
        status: "success",
        title: `${emailList.length} abonnés notifiés !`
      });
      query.refetch();
    } else
      toast({
        status: "warning",
        title: "Aucun abonné notifié"
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
          <ModalHeader>Liste des abonnés</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="info" flexDirection="row">
              <AlertIcon />
              <Box>
                Ci-dessous la liste des abonnés{" "}
                {org ? orgTypeFull(org.orgType) : ""} <b>{name}</b> à notifier
                de l'ajout de {entityTypeLabel} <b>{entityName}</b>.
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

                      if (entityNotified.find(({ email }) => email === e))
                        return;

                      if (org) {
                        if (
                          !subscription.orgs.find((orgSubscription) => {
                            return (
                              orgSubscription.orgId === org._id &&
                              orgSubscription.type ===
                                SubscriptionTypes.FOLLOWER
                            );
                          })
                        )
                          return;
                      }

                      return { email: e, status: StatusTypes.NOK };
                    })
                    .concat(
                      entityNotified.map(({ email }) => ({
                        email,
                        status: StatusTypes.OK
                      }))
                    )
                    .map((item) => {
                      if (!item) return null;
                      return (
                        <Tr key={item.email}>
                          <Td>{item.email}</Td>
                          <Td>
                            {item.status === StatusTypes.OK ? (
                              <Tag colorScheme="green">Notifié</Tag>
                            ) : (
                              <Link
                                onClick={() =>
                                  alert(
                                    "Vous pourrez bientôt notifier des abonnés individuellement."
                                  )
                                }
                              >
                                <Tag colorScheme="red">Notifier</Tag>
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
              Envoyer {followerCount - notifiedCount} notifications
            </Button>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
