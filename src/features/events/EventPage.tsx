import { Alert, AlertIcon, Box, Text, useColorMode } from "@chakra-ui/react";
import { parseISO, format } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { EntityPageConfigButton, Link } from "features/common";
import { Layout } from "features/layout";
import { getRefId } from "models/Entity";
import { IEvent } from "models/Event";
import { getFollowerSubscription, ISubscription } from "models/Subscription";
import { PageProps } from "main";
import { AppQuery, AppQueryWithData } from "utils/types";
import { EventAttendingForm } from "./EventAttendingForm";
import { EventConfigPanel, EventConfigVisibility } from "./EventConfigPanel";
import { EventPageTabs } from "./EventPageTabs";
import { useSession } from "hooks/useSession";

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
  const isFollowed = !!getFollowerSubscription({ event, subQuery });
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
        <EntityPageConfigButton
          isConfig={isConfig}
          isEdit={isEdit}
          setIsConfig={setIsConfig}
          setIsEdit={setIsEdit}
          mb={3}
        >
          Paramètres de l'événement
        </EntityPageConfigButton>
      )}

      {!isConfig && !isEdit && (
        <>
          {/* <EntityPageSubscribeButton eventQuery={eventQuery} subQuery={subQuery} /> */}

          <Box mb={3}>
            {/* {tab === "accueil" && !isCreator && (
              <EventAttendingForm eventQuery={eventQuery} mb={3} />
            )} */}

            {tab === "invitations" && isCreator && !event.isApproved && (
              <Alert status="info">
                <AlertIcon />
                <Box>
                  <Text>Votre événement est en attente de modération.</Text>
                  <Text fontSize="smaller">
                    Vous devez attendre son approbation avant de pouvoir envoyer
                    un e-mail d'invitation à cet événement.
                  </Text>
                </Box>
              </Alert>
            )}

            <Text fontSize="smaller">
              Événement ajouté le{" "}
              {format(parseISO(event.createdAt!), "eeee d MMMM yyyy", {
                locale: fr
              })}{" "}
              par :{" "}
              <Link variant="underline" href={`/${eventCreatedByUserName}`}>
                {eventCreatedByUserName}
              </Link>{" "}
              {isCreator && "(Vous)"}
            </Text>
          </Box>

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
        </>
      )}

      {session && isCreator && (isConfig || isEdit) && (
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
