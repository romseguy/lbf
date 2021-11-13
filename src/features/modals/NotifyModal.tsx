import {
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
import { EntityButton, OrgNotifForm } from "features/common";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
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
  session: Session;
}

export const NotifyModal = <T extends IEvent<string | Date> | ITopic>({
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

  const onSubmit = async (
    form: { email?: string; orgListsNames?: string[] },
    type: "single" | "multi"
  ) => {
    console.log("submitted", form);

    let payload: {
      org?: IOrg;
      event?: IEvent<string | Date>;
      email?: string;
      orgListsNames?: string[];
    } = {
      org,
      event
    };

    if (isEvent(entity)) {
      if (type === "multi")
        payload.orgListsNames = hasItems(form.orgListsNames)
          ? form.orgListsNames
          : undefined;
      else payload.email = form.email;
    }

    try {
      const { emailList } = await postNotif({
        [entityIdKey]: entityId,
        payload
      }).unwrap();

      if (hasItems(emailList)) {
        const s = emailList.length > 1 && "s";
        toast({
          status: "success",
          title: `${emailList.length} invitation${s} envoyée${s} !`
        });
        query.refetch();
      } else
        toast({
          status: "warning",
          title: "Aucun invitation envoyée"
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
        <ModalContent maxWidth="xl">
          <ModalHeader display="flex" alignItems="center" pb={0}>
            {isTopic(entity) ? (
              "Notifications"
            ) : (
              <EntityButton event={entity} p={2} />
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={0}>
            {isEvent(entity) && org && (
              <OrgNotifForm
                entity={entity}
                org={org}
                query={query}
                onCancel={() => setModalState({ ...modalState, entity: null })}
                onSubmit={onSubmit}
              />
            )}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
