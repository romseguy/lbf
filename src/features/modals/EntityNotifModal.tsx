import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast
} from "@chakra-ui/react";
import { Session } from "next-auth";
import React from "react";
import { EntityButton, EntityNotified, OrgNotifForm } from "features/common";
import { useEditEventMutation } from "features/events/eventsApi";
import { useEditTopicMutation } from "features/forum/topicsApi";
import { IEvent, IEventNotification } from "models/Event";
import { IOrg } from "models/Org";
import { ITopic, ITopicNotification } from "models/Topic";
import { SubscriptionTypes } from "models/Subscription";
import { hasItems } from "utils/array";
import { isEvent, isTopic } from "utils/models";

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
  session: Session;
}

export const EntityNotifModal = <T extends IEvent<string | Date> | ITopic>({
  event,
  org,
  query,
  mutation,
  setModalState,
  modalState,
  session
}: NotifyModalProps<T>) => {
  //#region hooks must be defined here
  const toast = useToast({ position: "top" });
  const [postNotif, postNotifMutation] = mutation;
  const { entity } = modalState;
  const [editEvent, _] = useEditEventMutation();
  const [editTopic, __] = useEditTopicMutation();

  //#endregion

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
  let topicNotifications: ITopicNotification[] | undefined;
  let eventNotifications: IEventNotification[] | undefined;
  let notifiedCount = 0;

  if (isTopic(entity)) {
    entityId = entity._id!;
    entityIdKey = "topicId";
    entityName = entity.topicName;
    entityTypeLabel = "la discussion";
    subscriptions = subscriptions.filter(({ phone }) => phone === undefined);

    if (entity.topicNotifications) {
      topicNotifications = entity.topicNotifications;
      notifiedCount = topicNotifications.length;
    }
  } else if (isEvent(entity)) {
    entityId = entity.eventUrl;
    entityName = entity.eventName;
    subscriptions = subscriptions.filter((subscription) => {
      return (
        org &&
        subscription.orgs?.find((orgSubscription) => {
          return (
            orgSubscription.orgId === org._id &&
            orgSubscription.type === SubscriptionTypes.FOLLOWER
          );
        })
      );
    });

    if (entity.eventNotifications) {
      eventNotifications = entity.eventNotifications;
      notifiedCount = eventNotifications.length;
    }
  }

  const postEntityNotifications = async (payload: any) => {
    try {
      const { notifications } = await postNotif({
        [entityIdKey]: entityId,
        payload
      }).unwrap();

      if (hasItems(notifications)) {
        const s = notifications.length > 1 ? "s" : "";
        toast({
          status: "success",
          title: `${notifications.length} invitation${s} envoyée${s} !`
        });
        query.refetch();
      } else
        toast({
          status: "warning",
          title: "Aucune invitations envoyée"
        });

      setModalState({
        ...modalState,
        entity: null
      });
    } catch (error) {
      console.error(error);
      toast({
        status: "error",
        title: "Une erreur est survenue"
      });
    }
  };

  const onSubmit = async (
    form: { email?: string; orgListsNames?: string[] },
    type?: "single" | "multi"
  ) => {
    console.log("submitted", form);

    let payload: {
      event?: IEvent<string | Date>;
      email?: string;
      orgListsNames?: string[];
    } = {
      event
    };

    if (type === "multi")
      payload.orgListsNames = hasItems(form.orgListsNames)
        ? form.orgListsNames
        : undefined;
    else payload.email = form.email;

    postEntityNotifications(payload);
  };

  return (
    <Modal
      isOpen={modalState.entity !== null}
      onClose={() =>
        setModalState({
          ...modalState,
          entity: null
        })
      }
    >
      <ModalOverlay>
        <ModalContent maxWidth="xl">
          <ModalHeader display="flex" alignItems="center" pb={0}>
            {isTopic(entity) ? (
              <EntityButton topic={entity} p={2} onClick={null} />
            ) : (
              <EntityButton event={entity} p={2} onClick={null} />
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            {org ? (
              <OrgNotifForm
                entity={entity}
                org={org}
                query={query}
                onSubmit={onSubmit}
              />
            ) : event ? (
              <Button
                colorScheme="teal"
                mb={5}
                onClick={() => {
                  const payload = {
                    event
                  };
                  postEntityNotifications(payload);
                }}
              >
                Inviter les abonnés de cet événement à la discussion
              </Button>
            ) : null}

            {isEvent(entity) && (
              <EntityNotified
                event={entity}
                query={query}
                mutation={editEvent}
                session={session}
              />
            )}

            {isTopic(entity) && (
              <EntityNotified
                topic={entity}
                query={query}
                mutation={editTopic}
                session={session}
              />
            )}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
