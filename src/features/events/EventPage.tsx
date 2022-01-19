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
  EntityButton,
  EntityNotified,
  EventNotifForm,
  Link
} from "features/common";
import { TopicsList } from "features/forum/TopicsList";
import { Layout } from "features/layout";
import { SubscriptionPopover } from "features/subscriptions/SubscriptionPopover";
import { selectSubscriptionRefetch } from "features/subscriptions/subscriptionSlice";
import { IEvent, Visibility } from "models/Event";
import {
  getFollowerSubscription,
  IOrgSubscription,
  SubscriptionTypes
} from "models/Subscription";
import { PageProps } from "pages/_app";
import { AppQuery } from "utils/types";
import { useEditEventMutation } from "./eventsApi";
import { selectEventRefetch } from "./eventSlice";
import { EventAttendingForm } from "./EventAttendingForm";
import { EventConfigPanel } from "./EventConfigPanel";
import { EventPageDescription } from "./EventPageDescription";
import { EventPageOrgs } from "./EventPageOrgs";
import { EventPageInfo } from "./EventPageInfo";
import { EventPageTabs } from "./EventPageTabs";
import { EventPageTimeline } from "./EventPageTimeline";

export type Visibility = {
  isVisible: {
    banner?: boolean;
    logo?: boolean;
    topics?: boolean;
  };
  setIsVisible: (obj: Visibility["isVisible"]) => void;
};

let cachedEmail: string | undefined;
let cachedRefetchEvent = false;
let cachedRefetchSubscription = false;

export const EventPage = ({
  email,
  eventQuery,
  subQuery,
  isMobile,
  session,
  tab,
  tabItem
}: PageProps & {
  eventQuery: AppQuery<IEvent>;
  subQuery: any;
  tab?: string;
  tabItem?: string;
}) => {
  cachedEmail = email;

  //#region event
  const [editEvent, editEventMutation] = useEditEventMutation();
  const event = eventQuery.data;
  const eventCreatedByUserName =
    event.createdBy && typeof event.createdBy === "object"
      ? event.createdBy.userName || event.createdBy._id
      : "";
  const eventCreatedByUserId =
    event.createdBy && typeof event.createdBy === "object"
      ? event.createdBy._id
      : "";
  const isCreator =
    session?.user.userId === eventCreatedByUserId ||
    session?.user.isAdmin ||
    false;
  //#endregion

  //#region sub
  const followerSubscription = getFollowerSubscription({ event, subQuery });
  const isSubscribedToAtLeastOneOrg = !!subQuery.data?.orgs?.find(
    (orgSubscription: IOrgSubscription) => {
      for (const org of event.eventOrgs) {
        if (
          org._id === orgSubscription.orgId &&
          orgSubscription.type === SubscriptionTypes.SUBSCRIBER
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
  const [isVisible, setIsVisible] = useState<Visibility["isVisible"]>({
    topics: false,
    banner: false,
    logo: false
  });
  const [showSendForm, setShowSendForm] = useState(false);

  let showAttendingForm = !isCreator;
  if (!isConfig && !isEdit) {
    if (session) {
      if (isSubscribedToAtLeastOneOrg) showAttendingForm = true;
    } else {
      if (event.eventVisibility === Visibility.SUBSCRIBERS) {
        if (!!event.eventNotified?.find((notified) => notified.email === email))
          showAttendingForm = true;
      } else {
        showAttendingForm = true;
      }
    }
  }
  //#endregion

  //#region cross refetch
  const refetchEvent = useSelector(selectEventRefetch);
  const refetchSubscription = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    if (refetchEvent !== cachedRefetchEvent) {
      console.log("refetching event");
      cachedRefetchEvent = refetchEvent;
      eventQuery.refetch();
    }

    if (refetchSubscription !== cachedRefetchSubscription) {
      console.log("refetching subscription");
      cachedRefetchSubscription = refetchSubscription;
      subQuery.refetch();
    }
  }, [refetchEvent, refetchSubscription]);
  useEffect(() => {
    if (email !== cachedEmail) {
      console.log("email changed, refetching");
      cachedEmail = email;
      eventQuery.refetch();
      subQuery.refetch();
    }
  }, [email]);
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
          {followerSubscription && (
            <Box mr={3} mt={3}>
              <SubscriptionPopover
                event={event}
                query={eventQuery}
                subQuery={subQuery}
                followerSubscription={followerSubscription}
              />
            </Box>
          )}

          <Box mt={3}>
            <SubscriptionPopover
              event={event}
              query={eventQuery}
              subQuery={subQuery}
              followerSubscription={followerSubscription}
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

      {event.eventVisibility === Visibility.SUBSCRIBERS &&
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
        <EventPageTabs event={event} isCreator={isCreator} tab={tab}>
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

                    <EventPageOrgs event={event} />

                    <EventPageTimeline event={event} />

                    <EventPageInfo
                      event={event}
                      isCreator={isCreator}
                      setIsEdit={setIsEdit}
                    />
                  </>
                )}
              </Grid>
            </TabPanel>

            <TabPanel aria-hidden>
              <TopicsList
                event={event}
                query={eventQuery}
                mutation={[editEvent, editEventMutation]}
                subQuery={subQuery}
                isCreator={isCreator}
                isFollowed={!!followerSubscription}
                isLogin={isLogin}
                setIsLogin={setIsLogin}
                currentTopicName={tabItem}
              />
            </TabPanel>

            {session && isCreator && (
              <TabPanel aria-hidden>
                {!showSendForm && (
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
                      else setShowSendForm(!showSendForm);
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

                {showSendForm && (
                  <Button
                    colorScheme="teal"
                    leftIcon={<ArrowBackIcon />}
                    onClick={() => setShowSendForm(false)}
                  >
                    Revenir à la liste des invitations envoyées
                  </Button>
                )}

                {showSendForm && (
                  <EventNotifForm
                    event={event}
                    eventQuery={eventQuery}
                    session={session}
                    onCancel={() => setShowSendForm(false)}
                    onSubmit={() => setShowSendForm(false)}
                  />
                )}

                {!showSendForm && (
                  <EntityNotified
                    event={event}
                    query={eventQuery}
                    mutation={editEvent}
                    session={session}
                  />
                )}
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
