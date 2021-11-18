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
  Text,
  VStack,
  useColorModeValue
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { EntityButton } from "features/common";
import { EventModal } from "features/modals/EventModal";
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

  //#region my events
  const { attendedEvents } = useGetEventsQuery(void 0, {
    selectFromResult: ({ data: events }) => ({
      attendedEvents: events?.filter(({ eventNotified }) =>
        eventNotified?.find(
          ({ email, status }) =>
            email === userEmail && status === StatusTypes.OK
        )
      )
    })
  });
  //#endregion

  //#region my events
  const myEventsQuery = useGetEventsQuery(
    { userId: session.user.userId },
    {
      selectFromResult: (query) => ({
        ...query,
        data: query.data
          ? [...query.data].sort((a, b) => {
              if (a.createdAt && b.createdAt) {
                if (a.createdAt < b.createdAt) return 1;
                else if (a.createdAt > b.createdAt) return -1;
              }
              return 0;
            })
          : undefined
      })
    }
  );
  const refetchEvents = useSelector(selectEventsRefetch);
  useEffect(() => {
    if (refetchEvents !== cachedRefetchEvents) {
      cachedRefetchEvents = refetchEvents;
      console.log("refetching events");
      myEventsQuery.refetch();
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
  const followedEvents = subQuery.data?.events || [];
  const hasFollowedEvents = hasItems(followedEvents);
  //#endregion

  //#region local state
  const [isOpen, setIsOpen] = useState(false);
  const [showEvents, setShowEvents] = useState<
    "showEventsAdded" | "showEventsFollowed" | "showEventsAttended"
  >("showEventsAdded");
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
            minWidth={0}
            onClick={() => {
              if (!isOpen) {
                myEventsQuery.refetch();
                subQuery.refetch();
              }
              setIsOpen(!isOpen);
            }}
            data-cy="eventPopover"
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

            {showEvents === "showEventsAdded" &&
              (Array.isArray(myEventsQuery.data) &&
              myEventsQuery.data.length > 0 ? (
                <VStack
                  alignItems="flex-start"
                  overflow="auto"
                  height="170px"
                  spacing={2}
                >
                  {myEventsQuery.data.map((event, index) => (
                    <EntityButton key={event._id} event={event} p={1} />
                  ))}
                </VStack>
              ) : (
                <Text fontSize="smaller" ml={3} my={2}>
                  Vous n'avez ajouté aucun événement.
                </Text>
              ))}

            {showEvents === "showEventsFollowed" &&
              (hasFollowedEvents ? (
                <VStack
                  alignItems="flex-start"
                  overflow="auto"
                  height="170px"
                  spacing={2}
                >
                  {followedEvents.map(({ event }) => (
                    <EntityButton key={event._id} event={event} p={1} />
                  ))}
                </VStack>
              ) : (
                <Text fontSize="smaller" ml={3}>
                  Vous n'êtes abonné à aucun événement.
                </Text>
              ))}

            {showEvents === "showEventsAttended" &&
              (Array.isArray(attendedEvents) && attendedEvents.length > 0 ? (
                <VStack
                  alignItems="flex-start"
                  overflow="auto"
                  height="170px"
                  spacing={2}
                >
                  {attendedEvents.map((event) => (
                    <EntityButton key={event._id} event={event} p={1} />
                  ))}
                </VStack>
              ) : (
                <Text fontSize="smaller" ml={3}>
                  Vous ne participez à aucun événement.
                </Text>
              ))}
          </PopoverBody>
          <PopoverFooter>
            <Button
              colorScheme="teal"
              leftIcon={<AddIcon />}
              mt={1}
              size="sm"
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

      {eventModalState.isOpen && (
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
