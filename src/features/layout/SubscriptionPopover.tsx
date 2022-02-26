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
  Text,
  VStack,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGetEventsQuery } from "features/events/eventsApi";
import { useGetTopicsQuery } from "features/forum/topicsApi";
import { selectUserEmail } from "features/users/userSlice";
import { isEvent, isTopic } from "utils/models";
import { compareAsc, compareDesc, parseISO } from "date-fns";
import { IEmailNotification, IPushNotification } from "models/INotification";
import { EntityButton } from "features/common";
import { timeAgo } from "utils/date";
import { hasItems } from "utils/array";

export const SubscriptionPopover = ({
  boxSize,
  session,
  ...props
}: BoxProps & { session: Session }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const userEmail = useSelector(selectUserEmail);

  const {
    eventsWithEmailNotifications,
    eventsWithPushNotifications,
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
  const { onOpen, onClose, isOpen } = useDisclosure();

  let emailNotifications: IEmailNotification[] = [];
  for (const entity of [
    ...eventsWithEmailNotifications,
    ...topicsWithEmailNotifications
  ]) {
    if (isEvent(entity)) {
      for (const eventNotification of entity.eventNotifications) {
        emailNotifications.push({ ...eventNotification, entity });
      }
    }
    if (isTopic(entity)) {
      for (const topicNotification of entity.topicNotifications) {
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
        pushNotifications.push({ ...eventNotification, entity });
      }
    }
    if (isTopic(entity)) {
      for (const topicNotification of entity.topicNotifications) {
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

  return (
    <Box {...props}>
      <Popover isLazy isOpen={isOpen} offset={[-140, 0]} onClose={onClose}>
        <PopoverTrigger>
          <IconButton
            aria-label="Notifications"
            bg="transparent"
            _hover={{ bg: "transparent" }}
            icon={<BellIcon boxSize={boxSize} _hover={{ color: "green" }} />}
            minWidth={0}
            onClick={() => {
              if (!isOpen) {
                refetchEvents();
                refetchTopics();
              }
              onOpen();
            }}
          />
        </PopoverTrigger>
        <PopoverContent>
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
                {hasItems(emailNotifications) ? (
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
                          alignSelf={
                            index % 2 === 0 ? "flex-start" : "flex-end"
                          }
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
                          alignSelf={
                            index % 2 === 0 ? "flex-start" : "flex-end"
                          }
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
        </PopoverContent>
      </Popover>
    </Box>
  );
};
