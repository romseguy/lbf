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

  if ((!org && !event) || !modalState.entity) return null;

  let entityIdKey = "eventUrl";
  let entityTypeLabel = "l'événement";
  let payload: {
    org?: IOrg;
    event?: IEvent<string | Date>;
    orgIds?: string[];
  } = {
    orgIds: org ? [org._id] : undefined
  };

  if ("topicName" in modalState.entity) {
    entityIdKey = "topicId";
    entityTypeLabel = "la discussion";
    payload = {
      org,
      event
    };
  }

  const entityId =
    "topicName" in modalState.entity
      ? modalState.entity._id
      : modalState.entity.eventUrl;
  const entityName =
    "topicName" in modalState.entity
      ? modalState.entity.topicName
      : modalState.entity.eventName;
  const entityNotified =
    "topicName" in modalState.entity
      ? modalState.entity.topicNotified || []
      : modalState.entity.eventNotified || [];

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
          <ModalHeader>Liste des notifications</ModalHeader>
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
                                    "Vous pourrez notifier des abonnés individuellement."
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
              Envoyer les notifications manquantes
            </Button>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
