import { AddIcon, CalendarIcon } from "@chakra-ui/icons";
import {
  Box,
  BoxProps,
  Button,
  Icon,
  IconButton,
  Popover,
  PopoverProps,
  PopoverTrigger,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  Select,
  Spinner,
  Text,
  VStack,
  useDisclosure
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { EntityButton } from "features/common";
import { useGetEventsQuery } from "features/api/eventsApi";
import { useGetSubscriptionQuery } from "features/api/subscriptionsApi";
import { EEventInviteStatus } from "models/Event";
import { selectSubscriptionRefetch } from "store/subscriptionSlice";
import { selectUserEmail } from "store/userSlice";
import { hasItems } from "utils/array";
import { Session } from "utils/auth";

let cachedRefetchSubscription = false;

const EventPopoverContent = ({
  session,
  onClose
}: {
  session: Session;
  onClose: () => void;
}) => {
  const router = useRouter();
  const userEmail = useSelector(selectUserEmail) || session.user.email;

  //#region events
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
  const eventsQuery = useGetEventsQuery(void 0, {
    selectFromResult: (query) => ({
      ...query,
      attendedEvents: (query.data || []).filter(({ eventNotifications }) =>
        eventNotifications.find(
          ({ email, status }) =>
            email === email && status === EEventInviteStatus.OK
        )
      )
    })
  });
  const { attendedEvents } = eventsQuery;
  //#endregion

  //#region my sub
  const subQuery = useGetSubscriptionQuery({
    email: userEmail,
    populate: "events"
  });
  const followedEvents = subQuery.data?.events || [];
  //#endregion

  //#region local state
  const [showEvents, setShowEvents] = useState<
    "showEventsAdded" | "showEventsFollowed" | "showEventsAttended"
  >("showEventsAdded");
  //#endregion

  const refetchSubscription = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    if (refetchSubscription !== cachedRefetchSubscription) {
      cachedRefetchSubscription = refetchSubscription;
    }
  }, [refetchSubscription]);

  return (
    <>
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
                      onClose();
                      router.push(`/${event.eventUrl}`, `/${event.eventUrl}`, {
                        shallow: true
                      });
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
          leftIcon={
            <>
              <AddIcon mr={2} />
              <CalendarIcon />
            </>
          }
          mt={1}
          size="sm"
          onClick={() => {
            onClose();
            router.push("/evenements/ajouter", "/evenements/ajouter", {
              shallow: true
            });
          }}
          data-cy="event-add-button"
        >
          Ajouter un événement
        </Button>
      </PopoverFooter>
    </>
  );
};

export const EventPopover = ({
  isMobile,
  session,
  ...props
}: PopoverProps & {
  isMobile: boolean;
  session: Session;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Popover isLazy isOpen={isOpen} onClose={onClose} {...props}>
      <PopoverTrigger>
        <IconButton
          aria-label="Mes événements"
          bg="transparent"
          color={isOpen ? "cyan.600" : undefined}
          _hover={{ bg: "transparent" }}
          icon={
            <Icon
              as={CalendarIcon}
              boxSize={6}
              _hover={{ color: "cyan.600" }}
            />
          }
          p={3}
          onClick={onOpen}
          data-cy="event-popover-button"
        />
      </PopoverTrigger>
      <PopoverContent>
        <EventPopoverContent session={session} onClose={onClose} />
      </PopoverContent>
    </Popover>
  );
};
