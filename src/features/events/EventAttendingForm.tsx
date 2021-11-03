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
import { useEditEventMutation } from "features/events/eventsApi";
import { useSession } from "hooks/useAuth";
import { IEvent, isAttending, isNotAttending, StatusTypes } from "models/Event";
import { emailR } from "utils/email";

export const EventAttendingForm = ({
  email,
  setEmail,
  event,
  eventQuery
}: {
  email?: string;
  setEmail: (email: string) => void;
  event: IEvent;
  eventQuery: any;
}) => {
  const { data: session, loading: isSessionLoading } = useSession();
  const toast = useToast({ position: "top" });

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

      setEmail(promptedEmail);
    }

    const userEmail = promptedEmail || email;

    if (isAttending({ email: userEmail, event })) {
      toast({ status: "error", title: "Vous participez déjà à cet événement" });
      return;
    }

    let isFound = false;

    let eventNotified = event.eventNotified?.map(({ email: e, status }) => {
      if (e === userEmail) {
        if (status !== StatusTypes.OK) {
          isFound = true;
          return { email: e, status: StatusTypes.OK };
        }
      }

      return { email: e, status };
    });

    if (!isFound && userEmail)
      eventNotified?.push({
        email: userEmail,
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

    if (!session && !email) {
      promptedEmail = prompt("Veuillez entrer votre adresse e-mail :");

      if (!promptedEmail || !emailR.test(promptedEmail)) {
        toast({ status: "error", title: "Adresse e-mail invalide" });
        return;
      }

      setEmail(promptedEmail);
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
    let eventNotified = event.eventNotified?.map(({ email: e, status }) => {
      if (e === userEmail && status !== StatusTypes.NOK) {
        isNew = false;
        return { email: e, status: StatusTypes.NOK };
      }
      return { email: e, status };
    });

    if (isNew && userEmail)
      eventNotified?.push({
        email: userEmail,
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
