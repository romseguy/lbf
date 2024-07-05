import { CalendarIcon } from "@chakra-ui/icons";
import {
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
  useDisclosure,
  IconButtonProps
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetEventsQuery } from "features/api/eventsApi";
import { useGetSubscriptionQuery } from "features/api/subscriptionsApi";
import { EntityAddButton, EntityButton } from "features/common";
import { EEventInviteStatus } from "models/Event";
import { selectSubscriptionRefetch } from "store/subscriptionSlice";
import { selectUserEmail } from "store/userSlice";
import { hasItems } from "utils/array";
import { Session } from "utils/auth";
import { selectScreenHeight } from "store/uiSlice";

let cachedRefetchSubscription = false;

const EventPopoverContent = ({
  session,
  onClose
}: {
  session: Session;
  onClose: () => void;
}) => {
  const screenHeight = useSelector(selectScreenHeight);
  const router = useRouter();
  const userEmail = useSelector(selectUserEmail);

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
                height={screenHeight ? screenHeight - 275 : 385 + "px"}
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
        <EntityAddButton
          onClick={() => {
            onClose();
          }}
        />
      </PopoverFooter>
    </>
  );
};

export const EventPopover = ({
  isMobile,
  session,
  iconProps,
  ...props
}: PopoverProps & {
  iconProps: Omit<IconButtonProps, "aria-label">;
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
              mx={3}
              //_hover={{ color: "cyan.600" }}
            />
          }
          onClick={onOpen}
          {...iconProps}
        />
      </PopoverTrigger>
      <PopoverContent>
        <EventPopoverContent session={session} onClose={onClose} />
      </PopoverContent>
    </Popover>
  );
};
