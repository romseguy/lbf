import { AddIcon, CalendarIcon } from "@chakra-ui/icons";
import {
  List,
  ListItem,
  ListIcon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  useColorModeValue,
  Icon,
  IconButton,
  Spinner,
  Button,
  Box,
  Heading,
  BoxProps,
  Text
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IoIosPeople, IoIosPerson } from "react-icons/io";
import { useSelector } from "react-redux";
import { Link } from "features/common";
import { EventModal } from "features/modals/EventModal";
import { useGetEventsQuery } from "features/events/eventsApi";
import { selectEventsRefetch } from "features/events/eventSlice";
import { useGetSubscriptionQuery } from "features/subscriptions/subscriptionsApi";
import {
  isSubscribedBy,
  selectSubscriptionRefetch
} from "features/subscriptions/subscriptionSlice";
import { selectUserEmail } from "features/users/userSlice";
import { IEvent } from "models/Event";
import { hasItems } from "utils/array";
import { Session } from "next-auth";

export const EventPopover = ({
  boxSize,
  session,
  ...props
}: BoxProps & {
  session: Session;
}) => {
  const router = useRouter();
  const userEmail = useSelector(selectUserEmail) || session.user.email;

  //#region events
  const eventsQuery = useGetEventsQuery(session.user.userId);
  const refetchEvents = useSelector(selectEventsRefetch);
  useEffect(() => {
    eventsQuery.refetch();
  }, [refetchEvents]);
  const subscribedEvents =
    eventsQuery.data?.filter((event) => hasItems(event.eventSubscriptions)) ||
    [];
  const hasSubscribedEvents = hasItems(subscribedEvents);
  //#endregion

  //#region sub
  const subQuery = useGetSubscriptionQuery(userEmail);
  const subscriptionRefetch = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    console.log("refetching subscription");
    subQuery.refetch();
  }, [subscriptionRefetch, userEmail]);

  //#endregion

  //#region local state
  const [isOpen, setIsOpen] = useState(false);
  const [eventModalState, setEventModalState] = useState<{
    isOpen: boolean;
    event?: IEvent;
  }>({ isOpen: false, event: undefined });
  const iconHoverColor = useColorModeValue("white", "lightgreen");
  //#endregion

  return (
    <Box {...props}>
      <Popover
        isLazy
        isOpen={isOpen}
        offset={[-140, 0]}
        onClose={() => setIsOpen(false)}
      >
        <PopoverTrigger>
          <IconButton
            onClick={() => {
              if (!isOpen) {
                eventsQuery.refetch();
                subQuery.refetch();
              }
              setIsOpen(!isOpen);
            }}
            aria-label="Social"
            bg="transparent"
            _hover={{ bg: "transparent" }}
            icon={
              <Icon
                as={CalendarIcon}
                boxSize={boxSize}
                _hover={{ color: iconHoverColor }}
              />
            }
            data-cy="eventPopover"
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <Heading size="md">Les événements...</Heading>
          </PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <Box>
              <Heading size="sm" mb={1}>
                ...que j'ai créé :
              </Heading>
              {eventsQuery.isLoading || eventsQuery.isFetching ? (
                <Spinner />
              ) : Array.isArray(eventsQuery.data) &&
                eventsQuery.data.length > 0 ? (
                <List ml={3}>
                  {eventsQuery.data.map((event, index) => (
                    <ListItem
                      display="flex"
                      alignItems="center"
                      mb={1}
                      key={index}
                    >
                      <ListIcon
                        boxSize={6}
                        as={CalendarIcon}
                        color="green.500"
                      />{" "}
                      <Link
                        onClick={() => {
                          setIsOpen(false);
                        }}
                        href={`/${event.eventUrl}`}
                        shallow
                      >
                        {event.eventName}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Text fontSize="smaller" ml={3} my={2}>
                  Vous n'avez ajouté aucune événement.
                </Text>
              )}

              <Heading size="sm" mt={hasItems(eventsQuery.data) ? 2 : 0} mb={1}>
                ...où je suis abonné :
              </Heading>
              {eventsQuery.isLoading || eventsQuery.isFetching ? (
                <Spinner />
              ) : hasSubscribedEvents ? (
                <List ml={3} my={3}>
                  {subscribedEvents.map((event, index) => (
                    <ListItem
                      display="flex"
                      alignItems="center"
                      mb={1}
                      key={index}
                    >
                      <ListIcon
                        boxSize={6}
                        as={IoIosPerson}
                        color="green.500"
                      />{" "}
                      <Link
                        onClick={() => {
                          setIsOpen(false);
                        }}
                        href={`/${event.eventUrl}`}
                      >
                        {event.eventName}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Text fontSize="smaller" ml={3} my={2}>
                  Vous n'êtes abonné à aucun événement
                </Text>
              )}
            </Box>

            <Button
              colorScheme="teal"
              leftIcon={<AddIcon />}
              mt={1}
              onClick={() => {
                setEventModalState({ isOpen: true });
              }}
              data-cy="addEvent"
            >
              Ajouter un événement
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>

      {session && eventModalState.isOpen && (
        <EventModal
          session={session}
          onCancel={() => setEventModalState({ isOpen: false })}
          onClose={() => setEventModalState({ isOpen: false })}
          onSubmit={async (eventUrl: string) => {
            await router.push(`/${eventUrl}`);
          }}
        />
      )}
    </Box>
  );
};
