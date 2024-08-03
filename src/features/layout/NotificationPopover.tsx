import { BellIcon } from "@chakra-ui/icons";
import {
  Text,
  Box,
  IconButton,
  Popover,
  PopoverProps,
  PopoverTrigger,
  PopoverContent,
  useDisclosure,
  IconButtonProps,
  Spinner,
  VStack
} from "@chakra-ui/react";
import React from "react";
import { Session } from "utils/auth";
import { useGetSubscriptionQuery } from "features/api/subscriptionsApi";
import { hasItems } from "utils/array";
import { AppHeading, EntityButton } from "features/common";

export const NotificationPopover = ({
  isMobile,
  session,
  iconProps,
  ...props
}: PopoverProps & {
  isMobile: boolean;
  session: Session;
  iconProps: Omit<IconButtonProps, "aria-label">;
}) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { data, isLoading } = useGetSubscriptionQuery({
    email: session.user.email
  });

  return (
    <Popover isLazy isOpen={isOpen} onClose={onClose} {...props}>
      <PopoverTrigger>
        <IconButton
          aria-label="Notifications"
          bg="transparent"
          color={isOpen ? "cyan.600" : undefined}
          _hover={{ bg: "transparent" }}
          icon={
            <BellIcon
              boxSize={6}
              mx={3}
              //_hover={{ color: "cyan.600" }}
            />
          }
          {...iconProps}
          onClick={onOpen}
        />
      </PopoverTrigger>
      <PopoverContent>
        <AppHeading smaller ml={2} mt={2}>
          Abonnements
        </AppHeading>
        <VStack spacing={2} m={2}>
          {isLoading && <Spinner />}
          {!isLoading && data && hasItems(data!.topics) && (
            <>
              {data!.topics!.map((topicSubscription) => (
                <EntityButton topic={topicSubscription.topic!} />
              ))}
            </>
          )}
          {!isLoading && !hasItems(data?.topics) && (
            <Text>Vous n'êtes abonné à aucune discussions</Text>
          )}
        </VStack>
      </PopoverContent>
    </Popover>
  );
};

{
  /**
const NotificationPopoverContent = ({ session }: { session: Session }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const userEmail = useSelector(selectUserEmail);

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
  } = useGetTopicsQuery(
    { populate: "topicNotifications" },
    {
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
    }
  );

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
   */
}
