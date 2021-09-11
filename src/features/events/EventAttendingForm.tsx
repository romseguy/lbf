import { IEvent, isAttending, isNotAttending, StatusTypes } from "models/Event";
import React from "react";
import { useSession } from "hooks/useAuth";
import {
  Box,
  Text,
  Flex,
  Alert,
  AlertIcon,
  useToast,
  Spinner
} from "@chakra-ui/react";
import { Button } from "features/common";
import { useEditEventMutation } from "features/events/eventsApi";
import { emailR } from "utils/email";

export const EventAttendingForm = ({
  email,
  setEmail,
  event,
  eventQuery
}: {
  email: string;
  setEmail: (email: string) => void;
  event: IEvent;
  eventQuery: any;
}) => {
  const { data: session, loading: isSessionLoading } = useSession();
  const toast = useToast({ position: "top" });
  const [editEvent, editEventMutation] = useEditEventMutation();

  const attend = async () => {
    let promptedEmail: string | null = null;

    if (!session && (!email || email === "")) {
      promptedEmail = prompt("Veuillez entrer votre adresse e-mail :");

      if (!promptedEmail || !emailR.test(promptedEmail)) {
        toast({ status: "error", title: "Adresse e-mail invalide" });
        return;
      }

      setEmail(promptedEmail);
    }

    if (isAttending({ email: promptedEmail || email, event })) {
      toast({ status: "error", title: "Vous participez déjà à cet événement" });
      return;
    }

    let isNew = true;

    let eventNotified = event.eventNotified?.map(({ email: e, status }) => {
      if ((e === promptedEmail || email) && status !== StatusTypes.OK) {
        isNew = false;
        return { email: e, status: StatusTypes.OK };
      }
      return { email: e, status };
    });

    if (isNew)
      eventNotified?.push({
        email: promptedEmail || email,
        status: StatusTypes.OK
      });

    await editEvent({
      payload: { eventNotified },
      eventUrl: event.eventUrl
    });
    eventQuery.refetch();
  };

  const unattend = async () => {
    let promptedEmail: string | null = null;

    if (!session && (!email || email === "")) {
      promptedEmail = prompt("Veuillez entrer votre adresse e-mail :");

      if (!promptedEmail || !emailR.test(promptedEmail)) {
        toast({ status: "error", title: "Adresse e-mail invalide" });
        return;
      }

      setEmail(promptedEmail);
    }

    if (isNotAttending({ email: promptedEmail || email, event })) {
      toast({
        status: "error",
        title: "Vous avez déjà indiqué ne pas participer à cet événement"
      });
      return;
    }

    let isNew = true;
    let eventNotified = event.eventNotified?.map(({ email: e, status }) => {
      if (e === (promptedEmail || email) && status !== StatusTypes.NOK) {
        isNew = false;
        return { email: e, status: StatusTypes.NOK };
      }
      return { email: e, status };
    });

    if (isNew)
      eventNotified?.push({
        email: promptedEmail || email,
        status: StatusTypes.NOK
      });

    await editEvent({
      payload: {
        eventNotified
      },
      eventUrl: event.eventUrl
    });
    eventQuery.refetch();
  };

  return (
    <Alert
      mb={3}
      status={
        isAttending({ email, event })
          ? "success"
          : isNotAttending({ email, event })
          ? "error"
          : "info"
      }
    >
      <AlertIcon />
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
