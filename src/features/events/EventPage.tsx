import {
  AddIcon,
  ArrowBackIcon,
  AtSignIcon,
  EditIcon,
  EmailIcon,
  SettingsIcon
} from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  Grid,
  Icon,
  IconButton,
  Text,
  TabPanel,
  TabPanels,
  Tooltip,
  VStack,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { parseISO, format } from "date-fns";
import { fr } from "date-fns/locale";
import DOMPurify from "isomorphic-dompurify";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { css } from "twin.macro";

import { useSession } from "hooks/useAuth";
import {
  EntityButton,
  EntityNotified,
  EventNotifForm,
  GridHeader,
  GridItem,
  Link
} from "features/common";
import { TopicsList } from "features/forum/TopicsList";
import { Layout } from "features/layout";
import { EventConfigPanel } from "./EventConfigPanel";
import { SubscriptionPopover } from "features/subscriptions/SubscriptionPopover";
import { useGetSubscriptionQuery } from "features/subscriptions/subscriptionsApi";
import { selectUserEmail } from "features/users/userSlice";
import { selectSubscriptionRefetch } from "features/subscriptions/subscriptionSlice";
import { IEvent, Visibility } from "models/Event";
import {
  getFollowerSubscription,
  IOrgSubscription,
  SubscriptionTypes
} from "models/Subscription";
import { hasItems } from "utils/array";
import { EventAttendingForm } from "./EventAttendingForm";
import { EventInfo } from "./EventInfo";
import { EventPageTabs } from "./EventPageTabs";
import { useEditEventMutation, useGetEventQuery } from "./eventsApi";
import { selectEventRefetch } from "./eventSlice";
import { EventTimeline } from "./EventTimeline";

export type Visibility = {
  isVisible: {
    banner?: boolean;
    logo?: boolean;
    topics?: boolean;
  };
  setIsVisible: (obj: Visibility["isVisible"]) => void;
};

let cachedRefetchEvent = false;
let cachedRefetchSubscription = false;

export const EventPage = ({
  populate,
  ...props
}: {
  populate?: string;
  event: IEvent;
  session: Session | null;
}) => {
  const router = useRouter();
  const [asPath, setAsPath] = useState(router.asPath);
  const { data, loading: isSessionLoading } = useSession();
  const session = data || props.session;
  const toast = useToast({ position: "top" });
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const storedUserEmail = useSelector(selectUserEmail);
  const [email, setEmail] = useState(storedUserEmail || session?.user.email);

  //#region event
  const [editEvent, editEventMutation] = useEditEventMutation();
  const eventQuery = useGetEventQuery(
    { eventUrl: props.event.eventUrl, populate },
    {
      selectFromResult: (query) => query
    }
  );
  const event = eventQuery.data || props.event;
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
  const subQuery = useGetSubscriptionQuery({ email });
  const followerSubscription = getFollowerSubscription({ event, subQuery });
  const isSubscribedToAtLeastOneOrg =
    isCreator ||
    !!subQuery.data?.orgs?.find((orgSubscription: IOrgSubscription) => {
      for (const org of event.eventOrgs) {
        if (
          org._id === orgSubscription.orgId &&
          orgSubscription.type === SubscriptionTypes.SUBSCRIBER
        )
          return true;
      }

      return false;
    });
  //#endregion

  //#region local state
  const [isLogin, setIsLogin] = useState(0);
  const [isConfig, setIsConfig] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isVisible, setIsVisible] = useState<Visibility["isVisible"]>({
    topics: false,
    banner: false,
    logo: false
  });
  const [showSendForm, setShowSendForm] = useState(false);
  let showAttendingForm = false;

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

  useEffect(() => {
    if (router.asPath !== asPath) {
      setAsPath(router.asPath);
      console.log("refetching event with new route", router.asPath);
      eventQuery.refetch();
      setIsEdit(false);
    }
  }, [router.asPath]);

  const refetchEvent = useSelector(selectEventRefetch);
  useEffect(() => {
    if (refetchEvent !== cachedRefetchEvent) {
      cachedRefetchEvent = refetchEvent;
      console.log("refetching event");
      eventQuery.refetch();
    }
  }, [refetchEvent]);

  const refetchSubscription = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    if (refetchSubscription !== cachedRefetchSubscription) {
      cachedRefetchSubscription = refetchSubscription;
      console.log("refetching subscription");
      subQuery.refetch();
    }
  }, [refetchSubscription]);

  useEffect(() => {
    const newEmail = storedUserEmail || session?.user.email;

    if (newEmail !== email) {
      setEmail(newEmail);
      console.log(
        "refetching event and subscription because of new email",
        newEmail
      );
      eventQuery.refetch();
      subQuery.refetch();
    }
  }, [storedUserEmail, session]);

  return (
    <Layout event={event} isLogin={isLogin} session={props.session}>
      {isCreator && !isConfig && !isEdit && (
        <Button
          colorScheme="teal"
          leftIcon={<SettingsIcon boxSize={6} data-cy="eventSettings" />}
          onClick={() => {
            setIsConfig(true);
          }}
          mb={5}
        >
          Configuration de l'événement
        </Button>
      )}

      {isConfig && !isEdit && (
        <Button
          colorScheme="teal"
          leftIcon={<ArrowBackIcon boxSize={6} />}
          onClick={() => setIsConfig(false)}
        >
          Revenir à la page de l'événement
        </Button>
      )}

      {!isConfig && isEdit && (
        <Button
          colorScheme="teal"
          leftIcon={<ArrowBackIcon boxSize={6} />}
          onClick={() => {
            setIsConfig(true);
            setIsEdit(false);
          }}
        >
          Revenir à la configuration de l'événement
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
                //isLoading={subQuery.isLoading || subQuery.isFetching}
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
              //isLoading={subQuery.isLoading || subQuery.isFetching}
            />
          </Box>
        </Flex>
      )}

      <Box mb={3}>
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
        <EventAttendingForm
          email={email}
          setEmail={setEmail}
          event={event}
          eventQuery={eventQuery}
        />
      )}

      {!isConfig && !isEdit && (
        <EventPageTabs isCreator={isCreator}>
          <TabPanels>
            <TabPanel aria-hidden>
              <Grid
                // templateColumns="minmax(425px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr)"
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
                <GridItem
                  rowSpan={3}
                  borderTopRadius="lg"
                  light={{ bg: "orange.100" }}
                  dark={{ bg: "gray.500" }}
                >
                  <GridHeader
                    display="flex"
                    alignItems="center"
                    borderTopRadius="lg"
                  >
                    <Heading size="sm" py={3}>
                      Description de l'événement
                    </Heading>
                    {event.eventDescription && isCreator && (
                      <Tooltip
                        placement="bottom"
                        label="Modifier la description"
                      >
                        <IconButton
                          aria-label="Modifier la description"
                          icon={<EditIcon />}
                          bg="transparent"
                          ml={3}
                          _hover={{ color: "green" }}
                          onClick={() => {
                            setIsEdit(true);
                          }}
                        />
                      </Tooltip>
                    )}
                  </GridHeader>

                  <GridItem>
                    <Box className="ql-editor" p={5}>
                      {event.eventDescription &&
                      event.eventDescription.length > 0 ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(event.eventDescription)
                          }}
                        />
                      ) : isCreator ? (
                        <Button
                          colorScheme="teal"
                          leftIcon={<AddIcon />}
                          onClick={() => {
                            setIsEdit(true);
                          }}
                        >
                          Ajouter
                        </Button>
                      ) : (
                        <Text fontStyle="italic">Aucune description.</Text>
                      )}
                    </Box>
                  </GridItem>
                </GridItem>

                <GridItem
                  light={{ bg: "orange.100" }}
                  dark={{ bg: "gray.500" }}
                  borderTopRadius="lg"
                >
                  <Grid templateRows="auto 1fr">
                    <GridHeader borderTopRadius="lg" alignItems="center">
                      <Heading size="sm" py={3}>
                        Quand ?
                      </Heading>
                    </GridHeader>

                    <GridItem
                      light={{ bg: "orange.100" }}
                      dark={{ bg: "gray.500" }}
                    >
                      <Box ml={3} pt={3}>
                        <EventTimeline event={event} />
                      </Box>
                    </GridItem>
                  </Grid>
                </GridItem>

                <GridItem
                  light={{ bg: "orange.100" }}
                  dark={{ bg: "gray.500" }}
                  borderTopRadius="lg"
                >
                  <Grid templateRows="auto 1fr">
                    <GridHeader borderTopRadius="lg" alignItems="center">
                      <Heading size="sm" py={3}>
                        Coordonnées
                      </Heading>
                    </GridHeader>

                    <GridItem
                      light={{ bg: "orange.100" }}
                      dark={{ bg: "gray.500" }}
                    >
                      <Box p={5}>
                        {!hasItems(event.eventAddress) &&
                        !hasItems(event.eventEmail) &&
                        !hasItems(event.eventPhone) &&
                        !hasItems(event.eventWeb) ? (
                          <>
                            {session ? (
                              <Button
                                colorScheme="teal"
                                leftIcon={<AddIcon />}
                                onClick={() => {
                                  setIsEdit(true);
                                }}
                              >
                                Ajouter
                              </Button>
                            ) : (
                              <Text fontStyle="italic">
                                Aucunes coordonnées.
                              </Text>
                            )}
                          </>
                        ) : (
                          <EventInfo event={event} />
                        )}
                      </Box>
                    </GridItem>
                  </Grid>
                </GridItem>

                <GridItem
                  light={{ bg: "orange.100" }}
                  dark={{ bg: "gray.500" }}
                  borderTopRadius="lg"
                >
                  <Grid templateRows="auto 1fr">
                    <GridHeader borderTopRadius="lg" alignItems="center">
                      <Heading size="sm" py={3}>
                        Organisé par
                      </Heading>
                    </GridHeader>

                    <GridItem
                      light={{ bg: "orange.100" }}
                      dark={{ bg: "gray.500" }}
                    >
                      <Box p={5}>
                        {hasItems(event.eventOrgs) ? (
                          <VStack alignItems="flex-start" spacing={2}>
                            {event.eventOrgs.map((eventOrg) => (
                              <EntityButton
                                key={eventOrg._id}
                                org={eventOrg}
                                p={1}
                              />
                            ))}
                          </VStack>
                        ) : (
                          <Flex alignItems="center">
                            <Icon as={AtSignIcon} mr={2} />
                            <Link
                              variant="underline"
                              href={`/${eventCreatedByUserName}`}
                            >
                              {eventCreatedByUserName}
                            </Link>
                          </Flex>
                        )}
                      </Box>
                    </GridItem>
                  </Grid>
                </GridItem>
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
          event={event}
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
