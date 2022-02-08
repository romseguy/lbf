import {
  Alert,
  AlertIcon,
  Button,
  Heading,
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
  OrgNotifForm
} from "features/common";
import { useEditEventMutation } from "features/events/eventsApi";
import { useEditTopicMutation } from "features/forum/topicsApi";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { ITopic } from "models/Topic";
import { hasItems } from "utils/array";
import { isEvent, isTopic } from "utils/models";
import { AppQuery } from "utils/types";
import { defaultErrorMessage } from "utils/string";

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

type PostNotifPayload = {
  event?: IEvent<string | Date>;
  email?: string;
  orgListsNames?: string[];
};

export const EntityNotifModal = <T extends IEvent<string | Date> | ITopic>({
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
  const [editTopic] = useEditTopicMutation();
  const [postNotif] = mutation;
  const postEntityNotifications = async (payload: PostNotifPayload) => {
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
        //query.refetch();
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
            ) : (
              <EntityButton event={entity} p={2} onClick={null} />
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            {(!org && !event) ||
            !entity ||
            (!isEvent(entity) && !isTopic(entity)) ? (
              <Alert status="error">
                <AlertIcon />
                {defaultErrorMessage}
              </Alert>
            ) : null}

            {entity && (
              <>
                {org ? (
                  <>
                    <Heading
                      className="rainbow-text"
                      fontFamily="DancingScript"
                      mb={3}
                    >
                      Aperçu de l'e-mail d'invitation
                    </Heading>
                    <EmailPreview entity={entity} org={org} session={session} />

                    <OrgNotifForm
                      entity={entity}
                      org={org}
                      query={query as AppQuery<IOrg>}
                      onSubmit={async (
                        form: { email?: string; orgListsNames?: string[] },
                        type?: "single" | "multi"
                      ) => {
                        console.log("submitted", form);

                        let payload: PostNotifPayload = {
                          event
                        };

                        if (type === "multi")
                          payload.orgListsNames = hasItems(form.orgListsNames)
                            ? form.orgListsNames
                            : undefined;
                        else payload.email = form.email;

                        await postEntityNotifications(payload);
                      }}
                    />
                  </>
                ) : event ? (
                  hasItems(event.eventSubscriptions) ? (
                    <>
                      <Heading
                        className="rainbow-text"
                        fontFamily="DancingScript"
                        mb={3}
                      >
                        Aperçu de l'e-mail d'invitation
                      </Heading>
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

            {isEvent(entity) && <EntityNotified event={entity} />}

            {isTopic(entity) && <EntityNotified topic={entity} />}

            {session.user.isAdmin && (
              <Button
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

                  onClose();
                }}
              >
                Effacer
              </Button>
            )}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
