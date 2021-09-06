import { IEvent, StatusTypes, StatusTypesV, Visibility } from "models/Event";
import type { IUser } from "models/User";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "hooks/useAuth";
import { parseISO, format } from "date-fns";
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
  Tag
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
  AtSignIcon,
  EditIcon,
  SettingsIcon
} from "@chakra-ui/icons";
import { IoIosPeople } from "react-icons/io";
import {
  Button,
  GridHeader,
  GridItem,
  IconFooter,
  Link
} from "features/common";
import { useGetEventQuery } from "features/events/eventsApi";
import { TopicsList } from "features/forum/TopicsList";
import { Layout } from "features/layout";
import { EventConfigPanel } from "./EventConfigPanel";
import { SubscriptionPopover } from "features/subscriptions/SubscriptionPopover";
import { useSelector } from "react-redux";
import { useGetSubscriptionQuery } from "features/subscriptions/subscriptionsApi";
import {
  selectSubscribedEmail,
  selectUserEmail
} from "features/users/userSlice";
import {
  isFollowedBy,
  selectSubscriptionRefetch
} from "features/subscriptions/subscriptionSlice";
import { IOrgSubscription, SubscriptionTypes } from "models/Subscription";
import { isServer } from "utils/isServer";

export type Visibility = {
  isVisible: {
    topics: boolean;
    banner: boolean;
  };
  setIsVisible: (obj: Visibility["isVisible"]) => void;
};

export const EventPage = (props: {
  event: IEvent;
  user?: IUser;
  routeName: string;
}) => {
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();
  const toast = useToast({ position: "top" });

  //#region event
  const eventQuery = useGetEventQuery({
    eventUrl: props.routeName,
    email: useSelector(selectUserEmail) || undefined
  });
  useEffect(() => {
    console.log("refetching event");
    eventQuery.refetch();
  }, [router.asPath]);
  const event = eventQuery.data || props.event;
  const eventCreatedByUserName =
    event.createdBy && typeof event.createdBy === "object"
      ? event.createdBy.userName
      : "";
  const eventCreatedByUserId =
    event.createdBy && typeof event.createdBy === "object"
      ? event.createdBy._id
      : "";
  const isCreator =
    session?.user.userId === eventCreatedByUserId || session?.user.isAdmin;
  //#endregion

  //#region sub
  const subscribedEmail = useSelector(selectSubscribedEmail);
  const subQuery = useGetSubscriptionQuery(
    subscribedEmail || session?.user.userId
  );
  const subscriptionRefetch = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    console.log("refetching subscription");
    subQuery.refetch();
  }, [subscriptionRefetch]);
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
  const [isLogin, setIsLogin] = useState(0);
  const [isConfig, setIsConfig] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isVisible, setIsVisible] = useState<Visibility["isVisible"]>({
    topics: false,
    banner: false
  });

  //#endregion

  const eventMinDate = parseISO(event.eventMinDate);
  const eventMaxDate = parseISO(event.eventMaxDate);
  const fullMinDateString = (date: Date) =>
    format(date, "dd MMMM", {
      locale: fr
    });
  const fullMaxDateString = (date: Date) =>
    format(date, "dd MMMM", {
      locale: fr
    });

  return (
    <Layout
      pageTitle={event.eventName}
      pageSubTitle={
        <>
          du <b>{format(eventMinDate, "eeee", { locale: fr })}</b>{" "}
          {fullMinDateString(eventMinDate)} à{" "}
          <b>{format(eventMinDate, "H'h'mm", { locale: fr })}</b>
          <br />
          jusqu'au <b>{format(eventMaxDate, "eeee", { locale: fr })}</b>{" "}
          {fullMaxDateString(eventMaxDate)} à{" "}
          <b>{format(eventMaxDate, "H'h'mm", { locale: fr })}</b>
        </>
      }
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
        <Alert status="warning" mb={3}>
          <AlertIcon />
          <Box>
            <Text>
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

      {!isConfig && (
        <>
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
              rowSpan={4}
              borderTopRadius="lg"
              light={{ bg: "orange.100" }}
              dark={{ bg: "gray.500" }}
            >
              <GridHeader borderTopRadius="lg" alignItems="center">
                <Flex flexDirection="row" alignItems="center">
                  <Heading size="sm" py={3}>
                    Description
                  </Heading>
                  {event.eventDescription && isCreator && (
                    <Tooltip placement="bottom" label="Modifier la description">
                      <Icon
                        as={EditIcon}
                        cursor="pointer"
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
                      Cliquez ici pour ajouter la description.
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
                      <Text fontStyle="italic">Aucun numéro de téléphone.</Text>
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

          <Grid gridGap={5} mt={5}>
            {isCreator && (
              <GridItem>
                <Grid templateRows="auto 1fr">
                  <GridHeader borderTopRadius="lg" alignItems="center">
                    <Heading size="sm" py={3}>
                      Invitations
                    </Heading>
                  </GridHeader>

                  <GridItem
                    light={{ bg: "orange.100" }}
                    dark={{ bg: "gray.500" }}
                  >
                    <Table p={5}>
                      <Tbody>
                        {Array.isArray(event.eventNotified) &&
                        !event.eventNotified.length ? (
                          <Tr>
                            <Td colSpan={2}>
                              Vous n'avez pas encore envoyé d'invitation pour
                              cet événement.
                            </Td>
                          </Tr>
                        ) : (
                          event.eventNotified.map(({ email, status }) => {
                            return (
                              <Tr key={email}>
                                <Td>{email}</Td>
                                <Td>
                                  <Tag
                                    variant="solid"
                                    colorScheme={
                                      status === StatusTypes.PENDING
                                        ? "blue"
                                        : "green"
                                    }
                                  >
                                    {StatusTypesV[status]}
                                  </Tag>
                                </Td>
                              </Tr>
                            );
                          })
                        )}
                      </Tbody>
                    </Table>
                  </GridItem>
                </Grid>
              </GridItem>
            )}

            <GridItem>
              <Grid templateRows="auto 1fr">
                <GridHeader borderTopRadius="lg" alignItems="center">
                  <Heading size="sm" py={3}>
                    Discussions
                  </Heading>
                </GridHeader>

                <GridItem
                  light={{ bg: "orange.100" }}
                  dark={{ bg: "gray.500" }}
                >
                  <Box p={5}>
                    <TopicsList
                      event={event}
                      query={eventQuery}
                      isCreator={isCreator}
                      isFollowed={!!isFollowed}
                      isLogin={isLogin}
                      setIsLogin={setIsLogin}
                    />
                  </Box>
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>
          <IconFooter />
        </>
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
