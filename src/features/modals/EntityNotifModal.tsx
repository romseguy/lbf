import { DeleteIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
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
import React, { useState } from "react";
import {
  EmailPreview,
  EntityButton,
  EntityNotified,
  Heading
} from "features/common";
import {
  AddEventNotifPayload,
  useEditEventMutation
} from "features/events/eventsApi";
import { OrgNotifForm, OrgNotifFormState } from "features/forms/OrgNotifForm";
import {
  AddTopicNotifPayload,
  useEditTopicMutation
} from "features/forum/topicsApi";
import { isEvent, isTopic } from "models/Entity";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { IProject } from "models/Project";
import { ITopic } from "models/Topic";
import { hasItems } from "utils/array";
import { AppQuery } from "utils/types";
import { useEditProjectMutation } from "features/projects/projectsApi";

export type NotifModalState<T> = {
  entity?: T;
};

interface NotifyModalProps<T> {
  event?: IEvent<string | Date>;
  org?: IOrg;
  query: AppQuery<IEvent | IOrg>;
  mutation: any;
  setModalState: (modalState: NotifModalState<T>) => void;
  modalState: NotifModalState<T>;
  session: Session;
}

export const EntityNotifModal = <
  T extends IEvent<string | Date> | IProject | ITopic
>({
  event,
  org,
  query,
  mutation,
  setModalState,
  modalState,
  session
}: NotifyModalProps<T>) => {
  const toast = useToast({ position: "top" });
  const [isLoading, setIsLoading] = useState(false);

  const { entity } = modalState;
  const onClose = () => {
    query.refetch();
    setModalState({
      ...modalState,
      entity: undefined
    });
  };
  const [editEvent] = useEditEventMutation();
  const [editProject] = useEditProjectMutation();
  const [editTopic] = useEditTopicMutation();
  const [postNotif] = mutation;
  const postEntityNotifications = async (
    payload: AddEventNotifPayload | AddTopicNotifPayload
  ) => {
    if (!entity) return;
    setIsLoading(true);

    try {
      const { notifications } = await postNotif({
        [isEvent(entity) ? "eventUrl" : "topicId"]: isEvent(entity)
          ? entity.eventUrl
          : entity._id,
        payload
      }).unwrap();

      if (hasItems(notifications)) {
        const s = notifications.length > 1 ? "s" : "";
        toast({
          status: "success",
          title: `${notifications.length} invitation${s} envoyée${s} !`
        });
        onClose();
      } else
        toast({
          status: "warning",
          title: "Aucune invitations envoyée"
        });

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast({
        status: "error",
        title: "Une erreur est survenue"
      });
    }
  };

  return (
    <Modal isOpen={!!modalState.entity} onClose={onClose}>
      <ModalOverlay>
        <ModalContent maxWidth="3xl">
          <ModalHeader display="flex" alignItems="center" pb={0}>
            {isTopic(entity) ? (
              <EntityButton topic={entity} p={2} onClick={null} />
            ) : isEvent(entity) ? (
              <EntityButton event={entity} p={2} onClick={null} />
            ) : null}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            {entity && (
              <>
                {org ? (
                  <>
                    <Heading mb={3}>Aperçu de l'e-mail d'invitation</Heading>
                    <EmailPreview entity={entity} org={org} session={session} />

                    <OrgNotifForm
                      entity={entity}
                      org={org}
                      query={query as AppQuery<IOrg>}
                      onSubmit={async (
                        form: OrgNotifFormState,
                        type?: "single" | "multi"
                      ) => {
                        let payload: AddTopicNotifPayload = { org };

                        if (type === "multi") {
                          if (hasItems(form.orgListsNames))
                            payload.orgListsNames = form.orgListsNames;
                        } else payload.email = form.email;

                        await postEntityNotifications(payload);
                      }}
                    />
                  </>
                ) : event ? (
                  hasItems(event.eventSubscriptions) ? (
                    <>
                      <Heading mb={3}>Aperçu de l'e-mail d'invitation</Heading>
                      <EmailPreview
                        entity={entity}
                        event={event}
                        session={session}
                      />
                      <Button
                        colorScheme="teal"
                        my={5}
                        isLoading={isLoading}
                        onClick={() => postEntityNotifications({ event })}
                      >
                        Inviter les abonnés de cet événement à la discussion
                      </Button>
                    </>
                  ) : (
                    <Alert status="warning">
                      <AlertIcon /> Il n'y a aucun abonnés à cet événement.
                    </Alert>
                  )
                ) : null}
              </>
            )}

            <EntityNotified entity={entity} />

            {session.user.isAdmin && (
              <Button
                leftIcon={<DeleteIcon />}
                mt={5}
                onClick={async () => {
                  if (isEvent(entity))
                    await editEvent({
                      eventUrl: entity.eventUrl,
                      payload: { eventNotifications: [] }
                    });
                  else if (isTopic(entity))
                    await editTopic({
                      topicId: entity._id,
                      payload: { topic: { topicNotifications: [] } }
                    });
                  else if (entity)
                    await editProject({
                      projectId: entity._id,
                      payload: { projectNotifications: [] }
                    });

                  onClose();
                }}
              >
                Effacer l'historique
              </Button>
            )}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
