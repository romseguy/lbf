import { QuestionIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  Icon,
  Spinner,
  Text,
  useToast
} from "@chakra-ui/react";
import React from "react";
import { Button } from "features/common";
import { useEditEventMutation } from "features/api/eventsApi";
import { selectUserEmail, setUserEmail } from "store/userSlice";
import { useSession } from "hooks/useSession";
import {
  IEvent,
  isAttending,
  isNotAttending,
  EEventInviteStatus
} from "models/Event";
import { useAppDispatch } from "store";
import { emailR } from "utils/email";
import { AppQuery, AppQueryWithData } from "utils/types";
import { useSelector } from "react-redux";

export const EventAttendingForm = ({
  eventQuery
}: {
  eventQuery: AppQueryWithData<IEvent>;
}) => {
  const event = eventQuery.data;
  const dispatch = useAppDispatch();
  const { data: session, loading: isSessionLoading } = useSession();
  const toast = useToast({ position: "top" });
  const email = useSelector(selectUserEmail) || session?.user.email;

  const [editEvent, editEventMutation] = useEditEventMutation();
  const status = isAttending({ email, event })
    ? "success"
    : isNotAttending({ email, event })
    ? "error"
    : "info";

  const attend = async () => {
    let promptedEmail: string | null = null;

    if (!session && !email) {
      promptedEmail = prompt("Veuillez entrer votre adresse e-mail :");

      if (!promptedEmail || !emailR.test(promptedEmail)) {
        toast({ status: "error", title: "Adresse e-mail invalide" });
        return;
      }

      dispatch(setUserEmail(promptedEmail));
    }

    const userEmail = promptedEmail || email;

    if (isAttending({ email: userEmail, event })) {
      toast({ status: "error", title: "Vous participez déjà à cet événement" });
      return;
    }

    let isNew = true;

    let eventNotifications = event.eventNotifications.map(
      (eventNotification) => {
        const { email, status } = eventNotification;

        if (email === userEmail) {
          if (status !== EEventInviteStatus.OK) {
            isNew = false;
            return { ...eventNotification, status: EEventInviteStatus.OK };
          }
        }

        return eventNotification;
      }
    );

    if (isNew && userEmail)
      eventNotifications.push({
        email: userEmail,
        status: EEventInviteStatus.OK,
        createdAt: new Date().toISOString()
      });

    await editEvent({
      eventId: event._id,
      payload: { eventNotifications }
    });
  };

  const unattend = async () => {
    let promptedEmail: string | null = null;

    if (!session && !email) {
      promptedEmail = prompt("Veuillez entrer votre adresse e-mail :");

      if (!promptedEmail || !emailR.test(promptedEmail)) {
        toast({ status: "error", title: "Adresse e-mail invalide" });
        return;
      }

      dispatch(setUserEmail(promptedEmail));
    }

    const userEmail = promptedEmail || email;

    if (isNotAttending({ email: userEmail, event })) {
      toast({
        status: "error",
        title: "Vous avez déjà indiqué ne pas participer à cet événement"
      });
      return;
    }

    let isNew = true;
    let eventNotifications = event.eventNotifications.map(
      (eventNotification) => {
        const { email, status } = eventNotification;
        if (email === userEmail && status !== EEventInviteStatus.NOK) {
          isNew = false;
          return { ...eventNotification, status: EEventInviteStatus.NOK };
        }
        return eventNotification;
      }
    );

    if (isNew && userEmail)
      eventNotifications.push({
        email: userEmail,
        status: EEventInviteStatus.NOK,
        createdAt: new Date().toISOString()
      });

    await editEvent({
      eventId: event._id,
      payload: {
        eventNotifications
      }
    });
  };

  return (
    <Alert mb={3} status={status}>
      {status === "info" ? (
        <Icon as={QuestionIcon} boxSize={5} color="blue.500" mr={3} />
      ) : (
        <AlertIcon />
      )}

      {isAttending({ email, event }) ? (
        <Flex flexDirection="column">
          <Text as="h3">Vous participez à cet événement.</Text>
          <Box>
            <Button
              colorScheme="red"
              isLoading={
                editEventMutation.isLoading ||
                eventQuery.isFetching ||
                eventQuery.isLoading
              }
              onClick={async () => {
                const ok = confirm(
                  "Êtes-vous sûr de ne plus vouloir participer à cet événement ?"
                );

                if (ok) {
                  unattend();
                }
              }}
            >
              Ne plus participer
            </Button>
          </Box>
        </Flex>
      ) : isNotAttending({ email, event }) ? (
        <Flex flexDirection="column">
          <Text as="h3">Vous avez refusé de participer à cet événement.</Text>
          <Box>
            <Button
              colorScheme="green"
              mr={3}
              isLoading={
                editEventMutation.isLoading ||
                eventQuery.isFetching ||
                eventQuery.isLoading
              }
              onClick={attend}
            >
              Participer
            </Button>
          </Box>
        </Flex>
      ) : (
        <Flex flexDirection="column">
          <Text as="h3">Participer à cet événement ?</Text>
          <Box mt={2}>
            {editEventMutation.isLoading ||
            eventQuery.isFetching ||
            eventQuery.isLoading ? (
              <Spinner />
            ) : (
              <>
                <Button colorScheme="green" mr={3} onClick={attend}>
                  Oui
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    unattend();
                  }}
                >
                  Non
                </Button>
              </>
            )}
          </Box>
        </Flex>
      )}
    </Alert>
  );
};
