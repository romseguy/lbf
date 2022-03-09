import { ArrowBackIcon, EmailIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Grid,
  Text,
  TabPanel,
  TabPanels
} from "@chakra-ui/react";
import { parseISO, format } from "date-fns";
import { fr } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { css } from "twin.macro";
import {
  EmailPreview,
  EntityButton,
  EntityNotified,
  Heading,
  Link
} from "features/common";
import { EventNotifForm } from "features/forms/EventNotifForm";
import { TopicsList } from "features/forum/TopicsList";
import { Layout } from "features/layout";
import { SubscribePopover } from "features/subscriptions/SubscribePopover";
import { selectSubscriptionRefetch } from "features/subscriptions/subscriptionSlice";
import { IEvent, EEventVisibility } from "models/Event";
import {
  ESubscriptionType,
  getFollowerSubscription,
  IOrgSubscription,
  ISubscription
} from "models/Subscription";
import { PageProps } from "pages/_app";
import { AppQuery, AppQueryWithData } from "utils/types";
import { useEditEventMutation } from "./eventsApi";
import { selectEventRefetch } from "./eventSlice";
import { EventAttendingForm } from "./EventAttendingForm";
import { EventConfigPanel, EventConfigVisibility } from "./EventConfigPanel";
import { EventPageDescription } from "./EventPageDescription";
import { EventPageOrgs } from "./EventPageOrgs";
import { EventPageInfo } from "./EventPageInfo";
import { EventPageTabs } from "./EventPageTabs";
import { EventPageTimeline } from "./EventPageTimeline";
import { getRefId } from "models/Entity";

let cachedRefetchEvent = false;

export const EventPage = ({
  email,
  eventQuery,
  subQuery,
  isMobile,
  session,
  tab,
  tabItem
}: PageProps & {
  eventQuery: AppQueryWithData<IEvent>;
  subQuery: AppQuery<ISubscription>;
  tab?: string;
  tabItem?: string;
}) => {
  //#region event
  const [editEvent, editEventMutation] = useEditEventMutation();
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
  const isSubscribedToAtLeastOneOrg = !!subQuery.data?.orgs?.find(
    (orgSubscription: IOrgSubscription) => {
      for (const org of event.eventOrgs) {
        if (
          org._id === orgSubscription.orgId &&
          orgSubscription.type === ESubscriptionType.SUBSCRIBER
        )
          return true;
      }

      return false;
    }
  );
  //#endregion

  //#region local state
  const [isConfig, setIsConfig] = useState(false);
  const [isLogin, setIsLogin] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [isVisible, setIsVisible] = useState<
    EventConfigVisibility["isVisible"]
  >({
    banner: false,
    logo: false
  });
  const [showNotifForm, setShowNotifForm] = useState(false);

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
  //#endregion

  //#region cross refetch
  const refetchEvent = useSelector(selectEventRefetch);
  useEffect(() => {
    if (refetchEvent !== cachedRefetchEvent) {
      console.log("refetching event");
      cachedRefetchEvent = refetchEvent;
      eventQuery.refetch();
    }
  }, [refetchEvent]);
  //#endregion

  return (
    <Layout
      event={event}
      isLogin={isLogin}
      isMobile={isMobile}
      session={session}
    >
      {isCreator && !isConfig && !isEdit && (
        <Button
          colorScheme="teal"
          leftIcon={<SettingsIcon boxSize={6} data-cy="eventSettings" />}
          onClick={() => setIsConfig(true)}
          mb={2}
        >
          Configuration de l'événement
        </Button>
      )}

      {isEdit && (
        <Button
          colorScheme="teal"
          leftIcon={<ArrowBackIcon boxSize={6} />}
          onClick={() => setIsEdit(false)}
          mb={2}
        >
          Retour
        </Button>
      )}

      {!isEdit && isConfig && (
        <Button
          colorScheme="teal"
          leftIcon={<ArrowBackIcon boxSize={6} />}
          onClick={() => setIsConfig(false)}
          mb={2}
        >
          Revenir à la page de l'événement
        </Button>
      )}

      {!isConfig && !isEdit && !subQuery.isLoading && (
        <Flex flexDirection="row" flexWrap="wrap" mt={-3}>
          {isFollowed && (
            <Box mr={3} mt={3}>
              <SubscribePopover
                event={event}
                query={eventQuery}
                subQuery={subQuery}
              />
            </Box>
          )}

          <Box mt={3}>
            <SubscribePopover
              event={event}
              query={eventQuery}
              subQuery={subQuery}
              notifType="push"
            />
          </Box>
        </Flex>
      )}

      <Box my={3}>
        <Text fontSize="smaller" pt={1}>
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

      {isCreator && !event.isApproved && (
        <Alert status="info" mb={3}>
          <AlertIcon />
          <Box>
            <Text>Votre événement est en attente de modération.</Text>
            <Text fontSize="smaller">
              Vous devez attendre son approbation avant de pouvoir envoyer un
              e-mail d'invitation aux adhérents des organisateurs.
            </Text>
          </Box>
        </Alert>
      )}

      {event.eventVisibility === EEventVisibility.SUBSCRIBERS &&
        !isConfig &&
        !isEdit &&
        !isSubscribedToAtLeastOneOrg && (
          <Alert status="warning" mb={3}>
            <AlertIcon />
            <Box>
              <Text as="h3">
                Cet événement est réservé aux adhérents des organisations
                suivantes :
                {event.eventOrgs.map((org) => (
                  <EntityButton key={org._id} org={org} ml={3} mb={1} p={1} />
                ))}
              </Text>
            </Box>
          </Alert>
        )}

      {showAttendingForm && (
        <EventAttendingForm email={email} eventQuery={eventQuery} />
      )}

      {!isConfig && !isEdit && (
        <EventPageTabs
          event={event}
          isCreator={isCreator}
          currentTabLabel={tab}
        >
          <TabPanels
            css={css`
              & > * {
                padding: 12px 0 !important;
              }
            `}
          >
            <TabPanel aria-hidden>
              <Grid
                gridGap={5}
                css={css`
                  & {
                    grid-template-columns: minmax(425px, 1fr) minmax(170px, 1fr);
                  }
                  @media (max-width: 700px) {
                    & {
                      grid-template-columns: 1fr !important;
                    }
                  }
                `}
              >
                {isMobile ? (
                  <>
                    <EventPageOrgs event={event} />

                    <EventPageInfo
                      event={event}
                      isCreator={isCreator}
                      setIsEdit={setIsEdit}
                    />

                    <EventPageTimeline event={event} />

                    <EventPageDescription
                      event={event}
                      isCreator={isCreator}
                      setIsEdit={setIsEdit}
                    />
                  </>
                ) : (
                  <>
                    <EventPageDescription
                      event={event}
                      isCreator={isCreator}
                      setIsEdit={setIsEdit}
                    />

                    <EventPageInfo
                      event={event}
                      isCreator={isCreator}
                      setIsEdit={setIsEdit}
                    />
                    <EventPageTimeline event={event} />
                    <EventPageOrgs event={event} />
                  </>
                )}
              </Grid>
            </TabPanel>

            <TabPanel aria-hidden>
              <TopicsList
                event={event}
                query={eventQuery}
                mutation={[editEvent, editEventMutation]}
                isCreator={isCreator}
                subQuery={subQuery}
                isFollowed={isFollowed}
                isLogin={isLogin}
                setIsLogin={setIsLogin}
                currentTopicName={tabItem}
              />
            </TabPanel>

            {session && isCreator && (
              <TabPanel aria-hidden>
                {!showNotifForm && (
                  <Button
                    as="div"
                    colorScheme="teal"
                    cursor="pointer"
                    leftIcon={<EmailIcon />}
                    mb={5}
                    onClick={() => {
                      if (!event.isApproved)
                        alert(
                          "L'événement doit être vérifié par un modérateur avant de pouvoir envoyer des invitations."
                        );
                      else setShowNotifForm(!showNotifForm);
                    }}
                  >
                    Envoyer des invitations à{" "}
                    <EntityButton
                      event={event}
                      bg="whiteAlpha.500"
                      ml={2}
                      onClick={null}
                    />
                  </Button>
                )}

                {showNotifForm && (
                  <Button
                    colorScheme="teal"
                    leftIcon={<ArrowBackIcon />}
                    onClick={() => setShowNotifForm(false)}
                  >
                    Revenir à la liste des invitations envoyées
                  </Button>
                )}

                {showNotifForm && (
                  <>
                    <EventNotifForm
                      event={event}
                      eventQuery={eventQuery}
                      session={session}
                      mb={5}
                      onCancel={() => setShowNotifForm(false)}
                      onSubmit={() => setShowNotifForm(false)}
                    />
                    <Heading>Aperçu de l'e-mail d'invitation</Heading>
                    <EmailPreview
                      entity={event}
                      event={event}
                      session={session}
                      mt={5}
                    />
                  </>
                )}

                {!showNotifForm && <EntityNotified entity={event} />}
              </TabPanel>
            )}
          </TabPanels>
        </EventPageTabs>
      )}

      {session && (
        <EventConfigPanel
          session={session}
          eventQuery={eventQuery}
          isConfig={isConfig}
          isEdit={isEdit}
          isVisible={isVisible}
          setIsConfig={setIsConfig}
          setIsEdit={setIsEdit}
          setIsVisible={setIsVisible}
        />
      )}
    </Layout>
  );
};
