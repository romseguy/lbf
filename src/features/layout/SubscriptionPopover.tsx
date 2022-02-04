import { BellIcon } from "@chakra-ui/icons";
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
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGetEventsQuery } from "features/events/eventsApi";
import { useGetTopicsQuery } from "features/forum/topicsApi";
import { selectUserEmail } from "features/users/userSlice";

type Notification = {
  status: "PENDING" | "OK" | "NOK";
  type: "email" | "push";
  created_at: Date;
};

// fn [...IEvent[], ...ITopic[] => INotification[]

export const SubscriptionPopover = ({
  boxSize,
  session,
  ...props
}: BoxProps & { session: Session }) => {
  const userEmail = useSelector(selectUserEmail) || session.user.email;
  const { onOpen, onClose, isOpen } = useDisclosure();
  const eventsQuery = useGetEventsQuery(void 0, {
    selectFromResult: (query) => ({
      ...query,
      data: query.data?.filter((event) =>
        event.eventNotifications?.find(({ email }) => email === userEmail)
      )
    })
  });
  const topicsQuery = useGetTopicsQuery(void 0, {
    selectFromResult: (query) => ({
      ...query,
      data: query.data?.filter((topic) =>
        topic.topicNotifications?.find(({ email }) => email === userEmail)
      )
    })
  });

  //console.log(eventsQuery.data, topicsQuery.data);

  //#region local state
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
                //subQuery.refetch();
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

            {showNotifications === "showEmailNotifications" &&
            //Array.isArray(emailNotifications) && emailNotifications.length > 0
            false ? (
              <VStack
                alignItems="flex-start"
                overflow="auto"
                height="200px"
                spacing={2}
              >
                {/* {emailNotifications.map((emailNotification, index) => (
                    <Box key={index}></Box>
                  ))} */}
              </VStack>
            ) : (
              <Text fontSize="smaller">
                Vous n'avez reçu aucune invitations e-mail.
              </Text>
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};
