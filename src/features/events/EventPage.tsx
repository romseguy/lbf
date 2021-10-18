import {
  ArrowBackIcon,
  AtSignIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EditIcon,
  PhoneIcon,
  SettingsIcon
} from "@chakra-ui/icons";
import {
  Box,
  Text,
  Flex,
  Heading,
  Icon,
  Grid,
  Alert,
  AlertIcon,
  useToast,
  Tooltip,
  Tr,
  Td,
  Table,
  Tbody,
  Tag,
  useColorMode,
  TabPanel,
  TabPanels,
  IconButton
} from "@chakra-ui/react";
import { IEvent, StatusTypes, StatusTypesV, Visibility } from "models/Event";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "hooks/useAuth";
import { parseISO, format } from "date-fns";
import { fr } from "date-fns/locale";
import DOMPurify from "isomorphic-dompurify";
import { css } from "twin.macro";
import { IoIosPeople } from "react-icons/io";
import { Button, GridHeader, GridItem, Link } from "features/common";
import { TopicsList } from "features/forum/TopicsList";
import { Layout } from "features/layout";
import { EventConfigPanel } from "./EventConfigPanel";
import { SubscriptionPopover } from "features/subscriptions/SubscriptionPopover";
import { useSelector } from "react-redux";
import {
  useAddSubscriptionMutation,
  useGetSubscriptionQuery
} from "features/subscriptions/subscriptionsApi";
import { selectUserEmail } from "features/users/userSlice";
import {
  isFollowedBy,
  selectSubscriptionRefetch
} from "features/subscriptions/subscriptionSlice";
import { IOrgSubscription, SubscriptionTypes } from "models/Subscription";
import { EventAttendingForm } from "./EventAttendingForm";
import { EventSendForm } from "features/common/forms/EventSendForm";
import { useGetEventQuery } from "./eventsApi";
import { EventPageTabs } from "./EventPageTabs";
import { hasItems } from "utils/array";
import { selectEventRefetch } from "./eventSlice";
import { FaMapMarkedAlt, FaGlobeEurope } from "react-icons/fa";
import { EventTimeline } from "./EventTimeline";

export type Visibility = {
  isVisible: {
    logo: boolean;
    topics: boolean;
    banner: boolean;
  };
  setIsVisible: (obj: Visibility["isVisible"]) => void;
};

export const EventPage = ({ ...props }: { event: IEvent }) => {
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();
  const toast = useToast({ position: "top" });
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const userEmail = useSelector(selectUserEmail) || session?.user.email;

  //#region event
  const eventQuery = useGetEventQuery(
    { eventUrl: props.event.eventUrl },
    {
      selectFromResult: (query) => query
    }
  );
  const event = eventQuery.data || props.event;
  const refetchEvent = useSelector(selectEventRefetch);

  useEffect(() => {
    console.log("refetching event");
    eventQuery.refetch();
    setIsEdit(false);
  }, [router.asPath, refetchEvent]);

  const eventCreatedByUserName =
    event.createdBy && typeof event.createdBy === "object"
      ? event.createdBy.userName || event.createdBy._id
      : "";
  const eventCreatedByUserId =
    event.createdBy && typeof event.createdBy === "object"
      ? event.createdBy._id
      : "";
  const isCreator =
    session?.user.userId === eventCreatedByUserId || session?.user.isAdmin;
  //#endregion

  //#region sub
  const [addSubscription, addSubscriptionMutation] =
    useAddSubscriptionMutation();
  const subQuery = useGetSubscriptionQuery(userEmail);
  const subscriptionRefetch = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    console.log("refetching subscription");
    subQuery.refetch();
  }, [subscriptionRefetch, userEmail]);

  const isFollowed = isFollowedBy({ event, subQuery });
  const isSubscribedToAtLeastOneOrg =
    isCreator ||
    !!subQuery.data?.orgs.find((orgSubscription: IOrgSubscription) => {
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
  const [email, setEmail] = useState(userEmail);
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

  if (session) {
    if (!isCreator && isSubscribedToAtLeastOneOrg) showAttendingForm = true;
  } else {
    if (event.eventVisibility === Visibility.SUBSCRIBERS) {
      if (!!event.eventNotified?.find((notified) => notified.email === email))
        showAttendingForm = true;
    } else {
      showAttendingForm = true;
    }
  }
  //#endregion

  return (
    <Layout
      event={event}
      //pageSubTitle={<DateRange minDate={eventMinDate} maxDate={eventMaxDate} />}
      isLogin={isLogin}
    >
      {isCreator && !isConfig ? (
        <Button
          colorScheme="teal"
          leftIcon={<SettingsIcon boxSize={6} data-cy="eventSettings" />}
          onClick={() => setIsConfig(true)}
          mb={2}
        >
          Paramètres de l'événement
        </Button>
      ) : isConfig && !isEdit ? (
        <Button
          colorScheme="pink"
          leftIcon={<ArrowBackIcon boxSize={6} />}
          onClick={() => setIsConfig(false)}
          mb={2}
        >
          Revenir à l'événement
        </Button>
      ) : null}

      {!subQuery.isLoading && !isConfig && (
        <Flex flexDirection="row" flexWrap="wrap" mt={-3}>
          {isFollowed && (
            <Box mr={3} mt={3}>
              <SubscriptionPopover
                event={event}
                query={eventQuery}
                subQuery={subQuery}
                followerSubscription={isFollowed}
                //isLoading={subQuery.isLoading || subQuery.isFetching}
              />
            </Box>
          )}

          <Box mt={3}>
            <SubscriptionPopover
              event={event}
              query={eventQuery}
              subQuery={subQuery}
              followerSubscription={isFollowed}
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

      {event.eventVisibility === Visibility.SUBSCRIBERS && !isConfig && (
        <Alert
          status={isSubscribedToAtLeastOneOrg ? "success" : "warning"}
          mb={3}
        >
          <AlertIcon />
          <Box>
            <Text as="h3">
              Cet événement est reservé aux adhérents des organisations
              suivantes :{" "}
              {event.eventOrgs.map((org) => (
                <Link key={org._id} href={org.orgUrl} shallow>
                  <Tag mx={1}>{org.orgName}</Tag>
                </Link>
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

      {!isConfig && (
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
                  <GridHeader borderTopRadius="lg" alignItems="center">
                    <Flex flexDirection="row" alignItems="center">
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
                              setIsConfig(true);
                              setIsEdit(true);
                            }}
                          />
                        </Tooltip>
                      )}
                    </Flex>
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
                        <Link
                          onClick={() => {
                            setIsConfig(true);
                            setIsEdit(true);
                          }}
                          variant="underline"
                        >
                          Cliquez ici pour ajouter la description de
                          l'événement.
                        </Link>
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
                        {event.eventAddress && (
                          <Flex flexDirection="column">
                            <Flex alignItems="center">
                              <Icon as={FaMapMarkedAlt} mr={3} />
                              {event.eventAddress}
                            </Flex>
                          </Flex>
                        )}

                        {event.eventEmail && (
                          <Flex flexDirection="column">
                            {event.eventEmail?.map(({ email }, index) => (
                              <Flex key={`phone-${index}`} alignItems="center">
                                <AtSignIcon mr={3} />
                                <a href={`mailto:${email}`}>{email}</a>
                              </Flex>
                            ))}
                          </Flex>
                        )}

                        {event.eventPhone && (
                          <Flex flexDirection="column">
                            {event.eventPhone?.map(({ phone }, index) => (
                              <Flex key={`phone-${index}`} alignItems="center">
                                <PhoneIcon mr={3} />
                                {phone}
                              </Flex>
                            ))}
                          </Flex>
                        )}

                        {event.eventWeb && (
                          <Flex flexDirection="column">
                            {event.eventWeb?.map(({ url, prefix }, index) => (
                              <Flex key={`phone-${index}`} alignItems="center">
                                <Icon as={FaGlobeEurope} mr={3} />
                                <Link variant="underline" href={prefix + url}>
                                  {url}
                                </Link>
                              </Flex>
                            ))}
                          </Flex>
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
                          event.eventOrgs.map((eventOrg, index) => (
                            <Flex key={eventOrg._id} mb={2} alignItems="center">
                              <Icon as={IoIosPeople} mr={2} />
                              <Link
                                data-cy={`eventCreatedBy-${eventOrg.orgName}`}
                                variant="underline"
                                href={`/${eventOrg.orgUrl}`}
                                shallow
                              >
                                {`${eventOrg.orgName}`}
                                {/* {`${eventOrg.orgName}${
                            index < event.eventOrgs!.length - 1 ? ", " : ""
                          }`} */}
                              </Link>
                            </Flex>
                          ))
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
                subQuery={subQuery}
                isCreator={isCreator}
                isFollowed={!!isFollowed}
                isLogin={isLogin}
                setIsLogin={setIsLogin}
              />
            </TabPanel>

            {isCreator && (
              <TabPanel aria-hidden>
                <Button
                  colorScheme="teal"
                  rightIcon={
                    showSendForm ? <ChevronDownIcon /> : <ChevronRightIcon />
                  }
                  onClick={() => {
                    if (!event.isApproved)
                      alert(
                        "L'événement doit être vérifié par un modérateur avant de pouvoir envoyer des invitations."
                      );
                    else setShowSendForm(!showSendForm);
                  }}
                >
                  Envoyer les invitations
                </Button>

                {showSendForm && session && (
                  <EventSendForm
                    event={event}
                    eventQuery={eventQuery}
                    session={session}
                    onSubmit={() => setShowSendForm(false)}
                  />
                )}

                <Box
                  light={{ bg: "orange.100" }}
                  dark={{ bg: "gray.500" }}
                  overflowX="auto"
                  mt={5}
                >
                  {!event.eventNotified ||
                  (Array.isArray(event.eventNotified) &&
                    !event.eventNotified.length) ? (
                    <Text>Aucune invitation envoyée.</Text>
                  ) : (
                    <Table>
                      <Tbody>
                        {event.eventNotified?.map(({ email: e, status }) => {
                          return (
                            <Tr key={e}>
                              <Td>{e}</Td>
                              <Td>
                                <Tag
                                  variant="solid"
                                  colorScheme={
                                    status === StatusTypes.PENDING
                                      ? "blue"
                                      : status === StatusTypes.OK
                                      ? "green"
                                      : "red"
                                  }
                                >
                                  {StatusTypesV[status]}
                                </Tag>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  )}
                </Box>
              </TabPanel>
            )}
          </TabPanels>
        </EventPageTabs>
      )}

      {session && isConfig && (
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
