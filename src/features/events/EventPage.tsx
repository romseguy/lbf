import {
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  useColorMode
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Layout } from "features/layout";
import { getRefId } from "models/Entity";
import { IEvent } from "models/Event";
import { getEntitySubscription, ISubscription } from "models/Subscription";
import { PageProps } from "main";
import { AppQuery, AppQueryWithData } from "utils/types";
import { EventConfigPanel, EventConfigVisibility } from "./EventConfigPanel";
import { EventPageTabs } from "./EventPageTabs";
import { useSession } from "hooks/useSession";
import { EventConfigButtons } from "./EventConfigButtons";
import { IoMdRefresh } from "react-icons/io";

//let isFirstLoad = true;

export const EventPage = ({
  eventQuery,
  subQuery,
  isMobile,
  tab,
  tabItem
}: PageProps & {
  eventQuery: AppQueryWithData<IEvent>;
  subQuery: AppQuery<ISubscription>;
  tab?: string;
  tabItem?: string;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const { data: session } = useSession();

  // useEffect(() => {
  //   if ((router.asPath.match(/\//g) || []).length > 1) {
  //     isFirstLoad = false;
  //     return;
  //   }
  //   isFirstLoad = false;
  // }, [router.asPath]);

  //#region event
  const event = eventQuery.data;
  const eventCreatedByUserName =
    event.createdBy && typeof event.createdBy === "object"
      ? event.createdBy.userName || event.createdBy._id
      : "";
  const isCreator =
    session?.user.userId === getRefId(event) || session?.user.isAdmin || false;
  //#endregion

  //#region sub
  const isFollowed = !!getEntitySubscription({ event, subQuery });
  //#endregion

  //#region config
  const [isConfig, setIsConfig] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  //#endregion

  //#region visibility
  const _isVisible = {
    banner: false,
    logo: false,
    topicCategories: false
  };
  const [isVisible, _setIsVisible] =
    useState<EventConfigVisibility["isVisible"]>(_isVisible);
  const toggleVisibility = (
    key?: keyof EventConfigVisibility["isVisible"],
    bool?: boolean
  ) =>
    _setIsVisible(
      !key
        ? _isVisible
        : Object.keys(isVisible).reduce((obj, objKey) => {
            if (objKey === key)
              return {
                ...obj,
                [objKey]: bool !== undefined ? bool : !isVisible[key]
              };

            return { ...obj, [objKey]: false };
          }, {})
    );
  //#endregion

  //#region local state
  //#endregion

  // const subscribeButtons = () => {
  //   if (isConfig || isEdit) return null;

  //   const isDisabled = eventQuery.isFetching || subQuery.isFetching;

  //   return (
  //     <Flex flexWrap="wrap" mt={-3}>
  //       {isFollowed && (
  //         <Box mr={3} mt={3}>
  //           <SubscribePopover
  //             isDisabled={isDisabled}
  //             event={event}
  //             //query={eventQuery}
  //             subQuery={subQuery}
  //           />
  //         </Box>
  //       )}

  //       <Box mt={3}>
  //         <SubscribePopover
  //           isDisabled={isDisabled}
  //           event={event}
  //           //query={eventQuery}
  //           subQuery={subQuery}
  //           notifType="push"
  //         />
  //       </Box>
  //     </Flex>
  //   );
  // };

  return (
    <Layout entity={event} isMobile={isMobile}>
      {isCreator && (
        <Box m={3} mb={0} {...(isMobile ? {} : {})}>
          <Flex
            flexDir={isMobile ? "column" : "row"}
            alignItems={isMobile ? "center" : undefined}
          >
            <HStack mb={isMobile ? 3 : 0}>
              <IconButton
                aria-label="Actualiser"
                colorScheme="green"
                variant="outline"
                icon={<Icon as={IoMdRefresh} boxSize={7} />}
                mr={1}
                onClick={() => {
                  eventQuery.refetch();
                }}
              />
              <Heading>Admin :</Heading>
            </HStack>

            <EventConfigButtons
              eventQuery={eventQuery}
              isConfig={isConfig}
              setIsConfig={setIsConfig}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              toggleVisibility={toggleVisibility}
              mb={3}
              {...(isMobile
                ? {}
                : {
                    m: 3
                  })}
            />
          </Flex>

          {session && (isConfig || isEdit) && (
            <EventConfigPanel
              session={session}
              eventQuery={eventQuery}
              isEdit={isEdit}
              isVisible={isVisible}
              setIsConfig={setIsConfig}
              setIsEdit={setIsEdit}
              toggleVisibility={toggleVisibility}
            />
          )}
        </Box>
      )}

      {!isConfig && !isEdit && (
        <EventPageTabs
          currentItemName={tabItem}
          currentTabLabel={tab}
          eventQuery={eventQuery}
          isCreator={isCreator}
          isFollowed={isFollowed}
          setIsConfig={setIsConfig}
          setIsEdit={setIsEdit}
          subQuery={subQuery}
        />
      )}
    </Layout>
  );
};

{
  /*
    let showAttendingForm = !isCreator;
    if (!isConfig && !isEdit) {
      if (session) {
        if (isSubscribedToAtLeastOneOrg) showAttendingForm = true;
      } else {
        if (event.eventVisibility === EEventVisibility.SUBSCRIBERS) {
          if (
            !!event.eventNotifications.find(
              (notified) => notified.email === email
            )
          )
            showAttendingForm = true;
        } else {
          showAttendingForm = true;
        }
      }
    }
  */
}
