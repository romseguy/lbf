import { AddIcon, CalendarIcon } from "@chakra-ui/icons";
import {
  Box,
  BoxProps,
  Button,
  Icon,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  PopoverFooter,
  Select,
  Spinner,
  Text,
  VStack,
  useColorModeValue
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { EntityButton } from "features/common";
import { EventFormModal } from "features/modals/EventFormModal";
import { useGetEventsQuery } from "features/events/eventsApi";
import { selectEventsRefetch } from "features/events/eventSlice";
import { useGetSubscriptionQuery } from "features/subscriptions/subscriptionsApi";
import { selectSubscriptionRefetch } from "features/subscriptions/subscriptionSlice";
import { selectUserEmail } from "features/users/userSlice";
import { IEvent, StatusTypes } from "models/Event";
import { hasItems } from "utils/array";
import { Session } from "next-auth";

let cachedRefetchEvents = false;
let cachedRefetchSubscription = false;

export const EventPopover = ({
  boxSize,
  session,
  ...props
}: BoxProps & {
  session: Session;
}) => {
  const router = useRouter();
  const storedUserEmail = useSelector(selectUserEmail);
  const [email, setEmail] = useState(storedUserEmail || session.user.email);

  //#region my events
  const attendedEventsQuery = useGetEventsQuery(void 0, {
    selectFromResult: ({ data: events }) => ({
      attendedEvents: (events || []).filter(({ eventNotifications }) =>
        eventNotifications?.find(
          ({ email, status }) => email === email && status === StatusTypes.OK
        )
      )
    })
  });
  const { attendedEvents } = attendedEventsQuery;

  const myEventsQuery = useGetEventsQuery(
    { createdBy: session.user.userId },
    {
      selectFromResult: (query) => ({
        ...query,
        data: [...(query.data || [])].sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            if (a.createdAt < b.createdAt) return 1;
            else if (a.createdAt > b.createdAt) return -1;
          }
          return 0;
        })
      })
    }
  );
  //#endregion

  //#region sub
  const subQuery = useGetSubscriptionQuery({
    email,
    populate: "events"
  });
  const followedEvents = subQuery.data?.events || [];
  //#endregion

  //#region local state
  const [isOpen, setIsOpen] = useState(false);
  const [showEvents, setShowEvents] = useState<
    "showEventsAdded" | "showEventsFollowed" | "showEventsAttended"
  >("showEventsAdded");
  const [eventModalState, setEventFormModalState] = useState<{
    isOpen: boolean;
    event?: IEvent;
  }>({ isOpen: false, event: undefined });
  //#endregion

  const refetchEvents = useSelector(selectEventsRefetch);
  useEffect(() => {
    if (refetchEvents !== cachedRefetchEvents) {
      cachedRefetchEvents = refetchEvents;
      console.log("refetching events");
      myEventsQuery.refetch();
    }
  }, [refetchEvents]);

  const refetchSubscription = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    if (refetchSubscription !== cachedRefetchSubscription) {
      cachedRefetchSubscription = refetchSubscription;
      console.log("refetching subscription");
      subQuery.refetch();
    }
  }, [refetchSubscription]);

  useEffect(() => {
    const newEmail = storedUserEmail || session.user.email;

    if (newEmail !== email) {
      setEmail(newEmail);
      console.log("refetching subscription because of new email", newEmail);
      subQuery.refetch();
    }
  }, [storedUserEmail, session]);

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
            aria-label="Événements"
            bg="transparent"
            _hover={{ bg: "transparent" }}
            icon={
              <Icon
                as={CalendarIcon}
                boxSize={boxSize}
                _hover={{ color: "green" }}
              />
            }
            minWidth={0}
            onClick={() => {
              if (!isOpen) {
                myEventsQuery.refetch();
                attendedEventsQuery.refetch();
                subQuery.refetch();
              }
              setIsOpen(!isOpen);
            }}
            data-cy="event-popover-button"
          />
        </PopoverTrigger>
        <PopoverContent>
          {/* <PopoverHeader>
          </PopoverHeader>
          <PopoverCloseButton /> */}
          <PopoverBody>
            <Select
              fontSize="sm"
              height="auto"
              lineHeight={2}
              mb={2}
              defaultValue={showEvents}
              onChange={(e) =>
                setShowEvents(
                  e.target.value as
                    | "showEventsAdded"
                    | "showEventsFollowed"
                    | "showEventsAttended"
                )
              }
            >
              <option value="showEventsAdded">
                Les événements que j'ai ajouté
              </option>
              <option value="showEventsFollowed">
                Les événements où je suis abonné
              </option>
              <option value="showEventsAttended">
                Les événements où je participe
              </option>
            </Select>

            {showEvents === "showEventsAdded" && (
              <>
                {myEventsQuery.isLoading || myEventsQuery.isFetching ? (
                  <Spinner />
                ) : hasItems(myEventsQuery.data) ? (
                  <VStack
                    alignItems="flex-start"
                    overflow="auto"
                    height="200px"
                    spacing={2}
                  >
                    {myEventsQuery.data.map((event) => (
                      <EntityButton
                        key={event._id}
                        event={event}
                        p={1}
                        onClick={() => {
                          setIsOpen(false);
                          router.push(event.eventUrl);
                        }}
                      />
                    ))}
                  </VStack>
                ) : (
                  <Text fontSize="smaller">
                    Vous n'avez ajouté aucun événements.
                  </Text>
                )}
              </>
            )}

            {showEvents === "showEventsFollowed" && (
              <>
                {hasItems(followedEvents) ? (
                  <VStack
                    alignItems="flex-start"
                    overflow="auto"
                    height="200px"
                    spacing={2}
                  >
                    {followedEvents.map(({ event }) => (
                      <EntityButton key={event._id} event={event} p={1} />
                    ))}
                  </VStack>
                ) : (
                  <Text fontSize="smaller">
                    Vous n'êtes abonné à aucun événements.
                  </Text>
                )}
              </>
            )}

            {showEvents === "showEventsAttended" && (
              <>
                {hasItems(attendedEvents) ? (
                  <VStack
                    alignItems="flex-start"
                    overflow="auto"
                    height="200px"
                    spacing={2}
                  >
                    {attendedEvents.map((event) => (
                      <EntityButton key={event._id} event={event} p={1} />
                    ))}
                  </VStack>
                ) : (
                  <Text fontSize="smaller">
                    Vous ne participez à aucun événements.
                  </Text>
                )}
              </>
            )}
          </PopoverBody>
          <PopoverFooter>
            <Button
              colorScheme="teal"
              leftIcon={<AddIcon />}
              mt={1}
              size="sm"
              onClick={() => {
                setEventFormModalState({ isOpen: true });
              }}
              data-cy="event-add-button"
            >
              Ajouter un événement
            </Button>
          </PopoverFooter>
        </PopoverContent>
      </Popover>

      {eventModalState.isOpen && (
        <EventFormModal
          session={session}
          onCancel={() => setEventFormModalState({ isOpen: false })}
          onClose={() => setEventFormModalState({ isOpen: false })}
          onSubmit={async (eventUrl) => {
            setEventFormModalState({ isOpen: false });
            await router.push(`/${eventUrl}`, `/${eventUrl}`, {
              shallow: true
            });
          }}
        />
      )}
    </Box>
  );
};
