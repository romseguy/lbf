import { BellIcon, EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import {
  Box,
  BoxProps,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
  Spinner,
  Text,
  VStack,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import { compareAsc, compareDesc, parseISO } from "date-fns";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { EntityButton } from "features/common";
import { useGetEventsQuery } from "features/events/eventsApi";
import { useGetTopicsQuery } from "features/forum/topicsApi";
import { selectUserEmail } from "features/users/userSlice";
import { IEmailNotification, IPushNotification } from "models/INotification";
import { hasItems } from "utils/array";
import { timeAgo } from "utils/date";
import { isEvent, isTopic } from "models/Entity";

const NotificationPopoverContent = ({ session }: { session: Session }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const userEmail = useSelector(selectUserEmail) || session.user.email;

  const {
    eventsWithEmailNotifications,
    eventsWithPushNotifications,
    isLoading: isEventsLoading,
    refetch: refetchEvents
  } = useGetEventsQuery(void 0, {
    selectFromResult: (query) => ({
      ...query,
      eventsWithEmailNotifications: (query.data || []).filter((event) =>
        event.eventNotifications.find(({ email }) => email === userEmail)
      ),
      eventsWithPushNotifications: (query.data || []).filter((event) =>
        event.eventNotifications.find(
          ({ user }) => user === session.user.userId
        )
      )
    })
  });

  const {
    topicsWithEmailNotifications,
    topicsWithPushNotifications,
    isLoading: isTopicsLoading,
    refetch: refetchTopics
  } = useGetTopicsQuery(void 0, {
    selectFromResult: (query) => ({
      ...query,
      topicsWithEmailNotifications: (query.data || []).filter((topic) =>
        topic.topicNotifications.find(({ email }) => email === userEmail)
      ),

      topicsWithPushNotifications: (query.data || []).filter((topic) =>
        topic.topicNotifications.find(
          ({ user }) => user === session.user.userId
        )
      )
    })
  });

  //#region local state
  let emailNotifications: IEmailNotification[] = [];
  for (const entity of [
    ...eventsWithEmailNotifications,
    ...topicsWithEmailNotifications
  ]) {
    if (isEvent(entity)) {
      for (const eventNotification of entity.eventNotifications) {
        if (eventNotification.email === userEmail)
          emailNotifications.push({ ...eventNotification, entity });
      }
    }
    if (isTopic(entity)) {
      for (const topicNotification of entity.topicNotifications) {
        if (topicNotification.email === userEmail)
          emailNotifications.push({ ...topicNotification, entity });
      }
    }
  }
  emailNotifications = emailNotifications.sort((a, b) =>
    compareAsc(parseISO(a.createdAt), parseISO(b.createdAt))
  );

  let pushNotifications: IPushNotification[] = [];
  for (const entity of [
    ...eventsWithPushNotifications,
    ...topicsWithPushNotifications
  ]) {
    if (isEvent(entity)) {
      for (const eventNotification of entity.eventNotifications) {
        if (eventNotification.user === session.user.userId)
          pushNotifications.push({ ...eventNotification, entity });
      }
    }
    if (isTopic(entity)) {
      for (const topicNotification of entity.topicNotifications) {
        if (topicNotification.user === session.user.userId)
          pushNotifications.push({ ...topicNotification, entity });
      }
    }
  }
  pushNotifications = pushNotifications.sort((a, b) =>
    compareAsc(parseISO(a.createdAt), parseISO(b.createdAt))
  );

  const [showNotifications, setShowNotifications] = useState<
    "showEmailNotifications" | "showPushNotifications"
  >("showEmailNotifications");
  //#endregion

  useEffect(() => {
    refetchEvents();
    refetchTopics();
  }, []);

  return (
    <>
      <PopoverBody>
        <Select
          fontSize="sm"
          height="auto"
          lineHeight={2}
          mb={2}
          defaultValue={showNotifications}
          onChange={(e) =>
            setShowNotifications(
              e.target.value as
                | "showEmailNotifications"
                | "showPushNotifications"
            )
          }
        >
          <option value="showEmailNotifications">
            Les invitations e-mail que j'ai reçu
          </option>
          <option value="showPushNotifications">
            Les invitations mobile que j'ai reçu
          </option>
        </Select>

        {showNotifications === "showEmailNotifications" && (
          <>
            {isEventsLoading || isTopicsLoading ? (
              <Spinner />
            ) : hasItems(emailNotifications) ? (
              <VStack
                alignItems="flex-start"
                overflow="auto"
                height="200px"
                spacing={2}
              >
                {emailNotifications.map(({ entity, createdAt }, index) => {
                  return (
                    <Box
                      key={entity._id}
                      alignSelf={index % 2 === 0 ? "flex-start" : "flex-end"}
                      borderColor={isDark ? "gray.600" : "gray.300"}
                      borderRadius="lg"
                      borderStyle="solid"
                      borderWidth="1px"
                      p={1}
                    >
                      <EmailIcon mr={2} />

                      {isEvent(entity) ? (
                        <EntityButton event={entity} />
                      ) : isTopic(entity) ? (
                        <EntityButton topic={entity} />
                      ) : null}

                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent={
                          index % 2 === 0 ? "flex-start" : "flex-end"
                        }
                        mt={1}
                      >
                        <Text fontSize="0.7em" fontStyle="italic" mx={1}>
                          il y a {timeAgo(createdAt).timeAgo}
                        </Text>
                      </Box>
                    </Box>
                  );
                })}
              </VStack>
            ) : (
              <Text fontSize="smaller">
                Vous n'avez reçu aucune invitations e-mail.
              </Text>
            )}
          </>
        )}

        {showNotifications === "showPushNotifications" && (
          <>
            {hasItems(pushNotifications) ? (
              <VStack
                alignItems="flex-start"
                overflow="auto"
                height="200px"
                spacing={2}
              >
                {pushNotifications.map(({ entity, createdAt }, index) => {
                  return (
                    <Box
                      key={entity._id}
                      alignSelf={index % 2 === 0 ? "flex-start" : "flex-end"}
                      borderColor={isDark ? "gray.600" : "gray.300"}
                      borderRadius="lg"
                      borderStyle="solid"
                      borderWidth="1px"
                      p={1}
                    >
                      <PhoneIcon mr={2} />

                      {isEvent(entity) ? (
                        <EntityButton event={entity} />
                      ) : isTopic(entity) ? (
                        <EntityButton topic={entity} />
                      ) : null}

                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent={
                          index % 2 === 0 ? "flex-start" : "flex-end"
                        }
                        mt={1}
                      >
                        <Text fontSize="0.7em" fontStyle="italic" mx={1}>
                          il y a {timeAgo(createdAt).timeAgo}
                        </Text>
                      </Box>
                    </Box>
                  );
                })}
              </VStack>
            ) : (
              <Text fontSize="smaller">
                Vous n'avez reçu aucune invitations mobile.
              </Text>
            )}
          </>
        )}
      </PopoverBody>
    </>
  );
};

export const NotificationPopover = ({
  boxSize,
  session,
  ...props
}: BoxProps & { session: Session }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <Box {...props}>
      <Popover isLazy isOpen={isOpen} offset={[-80, 25]} onClose={onClose}>
        <PopoverTrigger>
          <IconButton
            aria-label="Notifications"
            bg="transparent"
            color={isOpen ? "green" : undefined}
            _hover={{ bg: "transparent" }}
            icon={<BellIcon boxSize={boxSize} _hover={{ color: "green" }} />}
            minWidth={0}
            onClick={onOpen}
          />
        </PopoverTrigger>
        <PopoverContent>
          <NotificationPopoverContent session={session} />
        </PopoverContent>
      </Popover>
    </Box>
  );
};
