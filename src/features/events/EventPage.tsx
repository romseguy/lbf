import { IEvent, StatusTypes, StatusTypesV, Visibility } from "models/Event";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "hooks/useAuth";
import { parseISO, format, getHours } from "date-fns";
import { fr } from "date-fns/locale";
import DOMPurify from "isomorphic-dompurify";
import { css } from "twin.macro";
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
  IconButton,
  List,
  ListIcon,
  ListItem
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  AtSignIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EditIcon,
  SettingsIcon
} from "@chakra-ui/icons";
import { IoIosPeople } from "react-icons/io";
import {
  Button,
  DateRange,
  GridHeader,
  GridItem,
  IconFooter,
  Link
} from "features/common";
import { TopicsList } from "features/forum/TopicsList";
import { Layout } from "features/layout";
import { EventConfigPanel } from "./EventConfigPanel";
import { SubscriptionPopover } from "features/subscriptions/SubscriptionPopover";
import { useSelector } from "react-redux";
import { useGetSubscriptionQuery } from "features/subscriptions/subscriptionsApi";
import { selectUserEmail } from "features/users/userSlice";
import { isFollowedBy } from "features/subscriptions/subscriptionSlice";
import { IOrgSubscription, SubscriptionTypes } from "models/Subscription";
import { EventAttendingForm } from "./EventAttendingForm";
import { EventSendForm } from "features/common/forms/EventSendForm";
import { useGetEventQuery } from "./eventsApi";
import { EventPageTabs } from "./EventPageTabs";
import { days } from "utils/date";

export type Visibility = {
  isVisible: {
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

  const storedUserEmail = useSelector(selectUserEmail);
  const userEmail = storedUserEmail || session?.user.email || "";

  //#region event
  const eventQuery = useGetEventQuery(
    { eventUrl: props.event.eventUrl, populate: "orgSubscriptions" },
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
    session?.user.userId === eventCreatedByUserId || session?.user.isAdmin;
  const eventMinDate = parseISO(event.eventMinDate);
  const eventMaxDate = parseISO(event.eventMaxDate);
  //#endregion

  //#region sub
  const subQuery = useGetSubscriptionQuery(userEmail);
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
    banner: false
  });
  const [showSendForm, setShowSendForm] = useState(false);
  let showAttendingForm = false;

  if (session) {
    if (!isCreator && isSubscribedToAtLeastOneOrg) showAttendingForm = true;
  } else if (
    !!event.eventNotified?.find((notified) => notified.email === email)
  )
    showAttendingForm = true;
  //#endregion

  return (
    <Layout
      event={event}
      pageTitle={event.eventName}
      pageSubTitle={<DateRange minDate={eventMinDate} maxDate={eventMaxDate} />}
      isLogin={isLogin}
      banner={event.eventBanner}
    >
      {isCreator && !isConfig ? (
        <Button
          aria-label="Paramètres"
          colorScheme="green"
          leftIcon={<SettingsIcon boxSize={6} data-cy="eventSettings" />}
          onClick={() => setIsConfig(true)}
          mb={2}
        >
          Paramètres de l'événement
        </Button>
      ) : isConfig && !isEdit ? (
        <Button
          leftIcon={<ArrowBackIcon boxSize={6} />}
          onClick={() => setIsConfig(false)}
          mb={2}
        >
          Revenir à l'événement
        </Button>
      ) : null}

      {!isCreator && (
        <SubscriptionPopover
          event={event}
          email={email}
          isFollowed={isFollowed}
          mySubscription={subQuery.data}
          isLoading={subQuery.isLoading || subQuery.isFetching}
          onSubmit={(subscribed: boolean) => {
            if (subscribed) {
              toast({
                title: `Vous êtes maintenant abonné à ${event.eventName}`,
                status: "success",
                duration: 9000,
                isClosable: true
              });
            } else {
              toast({
                title: `Vous êtes désabonné de ${event.eventName}`,
                status: "success",
                duration: 9000,
                isClosable: true
              });
            }
            subQuery.refetch();
          }}
        />
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
        <EventPageTabs>
          <TabPanels>
            <TabPanel aria-hidden>
              <Grid
                // templateColumns="minmax(425px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr)"
                gridGap={5}
                css={css`
                  & {
                    grid-template-columns: minmax(425px, 1fr) minmax(170px, 1fr);
                  }
                  @media (max-width: 650px) {
                    & {
                      grid-template-columns: 1fr !important;
                    }
                  }
                `}
              >
                <GridItem
                  rowSpan={5}
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

                <GridItem>
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
                      <Box ml={3}>
                        {event.repeat === 99 ? (
                          <>
                            <Text fontWeight="bold">
                              <CalendarIcon mr={1} />
                              Toutes les semaines
                            </Text>
                            <List
                              spacing={3}
                              css={css`
                                & > li {
                                  list-style: none;
                                  margin-left: 24px;
                                  margin-top: 0 !important;
                                  border-left: 2px dashed #3f4e58;
                                  padding: 0 0 0 20px;
                                  position: relative;

                                  &::before {
                                    position: absolute;
                                    left: -14px;
                                    top: 0;
                                    content: " ";
                                    border: 8px solid rgba(255, 255, 255, 0.74);
                                    border-radius: 500%;
                                    background: #3f4e58;
                                    height: 25px;
                                    width: 25px;
                                    transition: all 500ms ease-in-out;
                                  }
                                }
                              `}
                            >
                              {days.map((day) => {
                                return (
                                  <ListItem>
                                    <Text fontWeight="bold">{day}</Text>
                                    <Box ml={3}>
                                      {format(
                                        parseISO(event.eventMinDate),
                                        "H:mm"
                                      )}
                                      <ArrowForwardIcon />
                                      {format(
                                        parseISO(event.eventMaxDate),
                                        "H:mm"
                                      )}
                                    </Box>
                                  </ListItem>
                                );
                              })}
                            </List>
                          </>
                        ) : (
                          <></>
                        )}
                      </Box>
                    </GridItem>
                  </Grid>
                </GridItem>

                <GridItem>
                  <Grid templateRows="auto 1fr">
                    <GridHeader borderTopRadius="lg" alignItems="center">
                      <Heading size="sm" py={3}>
                        Adresse
                      </Heading>
                    </GridHeader>

                    <GridItem
                      light={{ bg: "orange.100" }}
                      dark={{ bg: "gray.500" }}
                    >
                      <Box p={5}>
                        {event.eventAddress || (
                          <Text fontStyle="italic">Aucune adresse.</Text>
                        )}
                        {/* {!session ? (
                      <Link
                        variant="underline"
                        onClick={() => setIsLogin(isLogin + 1)}
                      >
                        Connectez-vous pour voir l'adresse
                      </Link>
                    ) : !isSubscribedToAtLeastOneOrg &&
                      event.eventVisibility === Visibility.SUBSCRIBERS &&
                      !isCreator ? (
                      <Text>
                        Vous devez être adhérent pour voir le numéro de
                        téléphone.
                      </Text>
                    ) : (
                      event.eventAddress || (
                        <Text fontStyle="italic">Aucune adresse.</Text>
                      )
                    )} */}
                      </Box>
                    </GridItem>
                  </Grid>
                </GridItem>

                <GridItem>
                  <Grid templateRows="auto 1fr">
                    <GridHeader borderTopRadius="lg" alignItems="center">
                      <Heading size="sm" py={3}>
                        Adresse e-mail
                      </Heading>
                    </GridHeader>

                    <GridItem
                      light={{ bg: "orange.100" }}
                      dark={{ bg: "gray.500" }}
                      overflowX="auto"
                    >
                      <Box p={5}>
                        {event.eventEmail || (
                          <Text fontStyle="italic">Aucune adresse e-mail.</Text>
                        )}
                        {/* {session ? (
                      event.eventEmail || (
                        <Text fontStyle="italic">Aucune adresse e-mail.</Text>
                      )
                    ) : (
                      <Link
                        variant="underline"
                        onClick={() => setIsLogin(isLogin + 1)}
                      >
                        Connectez-vous pour voir l'e-mail de l'événement
                      </Link>
                    )} */}
                      </Box>
                    </GridItem>
                  </Grid>
                </GridItem>

                <GridItem>
                  <Grid templateRows="auto 1fr">
                    <GridHeader borderTopRadius="lg" alignItems="center">
                      <Heading size="sm" py={3}>
                        Numéro de téléphone
                      </Heading>
                    </GridHeader>

                    <GridItem
                      light={{ bg: "orange.100" }}
                      dark={{ bg: "gray.500" }}
                    >
                      <Box p={5}>
                        {event.eventPhone || (
                          <Text fontStyle="italic">
                            Aucun numéro de téléphone.
                          </Text>
                        )}
                        {/* {!session ? (
                      <Link
                        variant="underline"
                        onClick={() => setIsLogin(isLogin + 1)}
                      >
                        Connectez-vous pour voir le numéro de téléphone
                      </Link>
                    ) : !isSubscribedToAtLeastOneOrg &&
                      event.eventVisibility === Visibility.SUBSCRIBERS &&
                      !isCreator ? (
                      <Text>
                        Vous devez être adhérent pour voir le numéro de
                        téléphone.
                      </Text>
                    ) : (
                      event.eventPhone || (
                        <Text fontStyle="italic">
                          Aucun numéro de téléphone.
                        </Text>
                      )
                    )} */}
                      </Box>
                    </GridItem>
                  </Grid>
                </GridItem>

                <GridItem>
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
                        {Array.isArray(event.eventOrgs) &&
                        event.eventOrgs.length > 0 ? (
                          event.eventOrgs.map((eventOrg, index) => (
                            <Flex key={eventOrg._id} mb={2} alignItems="center">
                              <Icon as={IoIosPeople} mr={2} />
                              <Link
                                data-cy={`eventCreatedBy-${eventOrg.orgName}`}
                                variant="underline"
                                href={`/${eventOrg.orgUrl}`}
                              >
                                {`${eventOrg.orgName}`}
                                {/* {`${eventOrg.orgName}${
                            index < event.eventOrgs!.length - 1 ? ", " : ""
                          }`} */}
                              </Link>
                            </Flex>
                          ))
                        ) : (
                          <Box>
                            <Icon as={AtSignIcon} mr={2} />
                            <Link
                              variant="underline"
                              href={`/${eventCreatedByUserName}`}
                            >
                              {eventCreatedByUserName}
                            </Link>
                          </Box>
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

                {showSendForm && (
                  <EventSendForm
                    event={event}
                    eventQuery={eventQuery}
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
