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
  Text,
  Tag,
  VStack,
  PopoverFooter
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

let cachedRefetchEvents = false;
let cachedRefetchSubscription = false;
let cachedEmail: string | undefined;

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
  const eventsQuery = useGetEventsQuery({ userId: session.user.userId });
  const refetchEvents = useSelector(selectEventsRefetch);
  useEffect(() => {
    if (refetchEvents !== cachedRefetchEvents) {
      cachedRefetchEvents = refetchEvents;
      console.log("refetching events");
      eventsQuery.refetch();
    }
  }, [refetchEvents]);
  //#endregion

  //#region sub
  const subQuery = useGetSubscriptionQuery(userEmail);
  const refetchSubscription = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    if (refetchSubscription !== cachedRefetchSubscription) {
      cachedRefetchSubscription = refetchSubscription;
      console.log("refetching subscription");
      subQuery.refetch();
    }
  }, [refetchSubscription]);
  useEffect(() => {
    if (userEmail !== cachedEmail) {
      cachedEmail = userEmail;
      console.log("refetching subscription with new email", userEmail);
      subQuery.refetch();
    }
  }, [userEmail]);
  const subscribedEvents = subQuery.data?.events || [];
  const hasSubscribedEvents = hasItems(subscribedEvents);
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
            <Box mb={3}>
              <Heading size="sm" mb={1}>
                ...que j'ai ajouté :
              </Heading>

              {eventsQuery.isLoading || eventsQuery.isFetching ? (
                <Spinner />
              ) : Array.isArray(eventsQuery.data) &&
                eventsQuery.data.length > 0 ? (
                <VStack alignItems="flex-start" overflowX="auto" ml={3}>
                  {eventsQuery.data.map((event, index) => (
                    <Link
                      key={index}
                      href={`/${event.eventUrl}`}
                      shallow
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      <Button
                        leftIcon={<CalendarIcon color="green.500" />}
                        p={2}
                      >
                        {event.eventName}
                      </Button>
                    </Link>
                  ))}
                </VStack>
              ) : (
                <Text fontSize="smaller" ml={3} my={2}>
                  Vous n'avez ajouté aucun événement.
                </Text>
              )}
            </Box>

            <Heading size="sm" mt={hasItems(eventsQuery.data) ? 2 : 0} mb={1}>
              ...où je me suis abonné :
            </Heading>

            {eventsQuery.isLoading || eventsQuery.isFetching ? (
              <Spinner />
            ) : hasSubscribedEvents ? (
              <VStack alignItems="flex-start" overflowX="auto" ml={3}>
                {subscribedEvents.map(({ event }, index) => (
                  <Link
                    key={index}
                    href={`/${event.eventUrl}`}
                    shallow
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    <Button
                      leftIcon={<Icon as={CalendarIcon} color="green.500" />}
                      p={2}
                    >
                      {event.eventName}
                    </Button>
                  </Link>
                ))}
              </VStack>
            ) : (
              <Text fontSize="smaller" ml={3}>
                Vous n'êtes abonné à aucun événement
              </Text>
            )}
          </PopoverBody>
          <PopoverFooter>
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
          </PopoverFooter>
        </PopoverContent>
      </Popover>

      {session && eventModalState.isOpen && (
        <EventModal
          session={session}
          onCancel={() => setEventModalState({ isOpen: false })}
          onClose={() => setEventModalState({ isOpen: false })}
          onSubmit={async (eventUrl) => {
            await router.push(`/${eventUrl}`, `/${eventUrl}`, {
              shallow: true
            });
          }}
        />
      )}
    </Box>
  );
};
