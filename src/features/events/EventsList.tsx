import React, { useMemo, useState } from "react";
import {
  Box,
  Icon,
  Text,
  Grid,
  Heading,
  Tooltip,
  Flex,
  useToast,
  IconButton,
  Tag,
  Button
} from "@chakra-ui/react";
import { Link, GridHeader, GridItem, Spacer } from "features/common";
import {
  compareAsc,
  format,
  addDays,
  addHours,
  addWeeks,
  intervalToDuration,
  parseISO,
  formatISO,
  getMinutes,
  getDayOfYear,
  getDay
} from "date-fns";
import { IEvent, Visibility } from "models/Event";
import { fr } from "date-fns/locale";
import {
  AddIcon,
  CheckCircleIcon,
  DeleteIcon,
  EmailIcon,
  UpDownIcon,
  WarningIcon
} from "@chakra-ui/icons";
import { css } from "twin.macro";
import { DescriptionModal } from "features/modals/DescriptionModal";
import DOMPurify from "isomorphic-dompurify";
import { FaGlobeEurope, FaRetweet } from "react-icons/fa";
import { useSession } from "hooks/useAuth";
import { ForwardModal } from "features/modals/ForwardModal";
import { useDeleteEventMutation, useEditEventMutation } from "./eventsApi";
import { IOrg, orgTypeFull } from "models/Org";
import { SubscriptionTypes } from "models/Subscription";
import { IoIosPeople, IoMdPerson } from "react-icons/io";
import { EventModal } from "features/modals/EventModal";
import { useRouter } from "next/router";

const EventVisibility = ({ eventVisibility }: { eventVisibility?: string }) =>
  eventVisibility === Visibility.SUBSCRIBERS ? (
    <Tooltip label="Événement réservé aux adhérents">
      <span>
        <Icon as={IoMdPerson} boxSize={4} />
      </span>
    </Tooltip>
  ) : // : topicVisibility === Visibility.FOLLOWERS ? (
  //   <Tooltip label="Événement réservé aux abonnés">
  //     <EmailIcon boxSize={4} />
  //   </Tooltip>
  // )
  eventVisibility === Visibility.PUBLIC ? (
    <Tooltip label="Événement public">
      <span>
        <Icon as={FaGlobeEurope} boxSize={4} />
      </span>
    </Tooltip>
  ) : null;

type EventsProps = {
  events: IEvent[];
  org?: IOrg;
  orgQuery?: any;
  eventHeader?: any;
  isCreator?: boolean;
  isSubscribed?: boolean;
  isLogin?: number;
  setIsLogin?: (isLogin: number) => void;
};

export const EventsList = ({
  org,
  orgQuery,
  isCreator,
  isSubscribed,
  isLogin,
  setIsLogin,
  ...props
}: EventsProps) => {
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();
  const toast = useToast({ position: "top" });
  const [deleteEvent, deleteQuery] = useDeleteEventMutation();
  const [editEvent, editEventMutation] = useEditEventMutation();
  let currentDate: Date | undefined;
  let addGridHeader = true;

  //#region local state
  const [isLoading, setIsLoading] = useState(false);
  const [eventToShow, setEventToShow] = useState<IEvent | null>(null);
  const [eventToForward, setEventToForward] = useState<IEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  //#endregion

  //#region org
  const orgFollowersCount = org?.orgSubscriptions
    .map(
      (subscription) =>
        subscription.orgs.filter((orgSubscription) => {
          return (
            orgSubscription.orgId === org?._id &&
            orgSubscription.type === SubscriptionTypes.FOLLOWER
          );
        }).length
    )
    .reduce((a, b) => a + b, 0);
  //#endregion

  const addEvent = () => {
    if (!isSessionLoading) {
      if (session) {
        if (org) {
          if (isCreator || isSubscribed) setIsEventModalOpen(true);
          else
            toast({
              status: "error",
              title: `Vous devez être adhérent ${orgTypeFull(
                org.orgType
              )} pour ajouter un événement`
            });
        } else setIsEventModalOpen(true);
      } else if (setIsLogin && isLogin) {
        setIsLogin(isLogin + 1);
      }
    }
  };

  const addRepeatedEvents = (events: IEvent[]) => {
    let array: IEvent[] = [];

    for (const event of events) {
      if (
        isCreator ||
        event.eventVisibility === Visibility.PUBLIC ||
        (event.eventVisibility === Visibility.SUBSCRIBERS && isSubscribed)
      ) {
        array.push(event);

        if (event.repeat) {
          const repeatCount = event.repeat === 99 ? 10 : event.repeat;
          const start = parseISO(event.eventMinDate);
          const end = parseISO(event.eventMaxDate);

          const { days = 0, hours = 0 } = intervalToDuration({
            start,
            end
          });

          for (let i = 1; i <= repeatCount; i++) {
            const eventMinDate = addWeeks(start, i);
            const eventMaxDate = addDays(addHours(eventMinDate, hours), days);
            array.push({
              ...event,
              eventMinDate: formatISO(eventMinDate),
              eventMaxDate: formatISO(eventMaxDate),
              repeat: repeatCount + i
            });
          }
        }
      }
    }

    return array;
  };

  const events = useMemo(() => {
    const repeatedEvents = addRepeatedEvents(props.events).sort((a, b) =>
      compareAsc(parseISO(a.eventMinDate), parseISO(b.eventMinDate))
    );

    return repeatedEvents.map((event, index) => {
      const minDate = parseISO(event.eventMinDate);
      const maxDate = parseISO(event.eventMaxDate);

      const isCurrentDateOneDayBeforeMinDate = currentDate
        ? getDayOfYear(currentDate) < getDayOfYear(minDate)
        : true;

      if (isCurrentDateOneDayBeforeMinDate) {
        addGridHeader = true;
        currentDate = minDate;
      } else {
        addGridHeader = false;
      }

      let notifiedCount = 0;
      let canSendCount = 0;

      if (
        orgFollowersCount &&
        (session?.user.userId === event.createdBy || session?.user.isAdmin)
      ) {
        notifiedCount = Array.isArray(event.eventNotified)
          ? event.eventNotified.length
          : 0;
        canSendCount = orgFollowersCount - notifiedCount;
      }

      return (
        <div key={`${event._id}${event.repeat}`}>
          <Grid
            templateRows="auto auto 4fr auto"
            templateColumns="1fr 6fr minmax(75px, 1fr)"
          >
            {addGridHeader ? (
              props.eventHeader ? (
                props.eventHeader
              ) : (
                <GridHeader
                  colSpan={3}
                  borderTopRadius={index === 0 ? "lg" : undefined}
                >
                  <Heading size="sm" py={3}>
                    {format(minDate, "cccc d MMMM", { locale: fr })}
                  </Heading>
                </GridHeader>
              )
            ) : (
              <GridItem colSpan={3}>
                <Spacer borderWidth={1} />
              </GridItem>
            )}

            <GridItem
              rowSpan={3}
              light={{ bg: "orange.100" }}
              dark={{ bg: "gray.500" }}
              borderBottomLeftRadius={
                index === repeatedEvents.length - 1 ? "lg" : undefined
              }
            >
              <Box pt={2} pl={2} pr={2}>
                <Text pb={1}>
                  {format(
                    minDate,
                    `H'h'${getMinutes(minDate) !== 0 ? "mm" : ""}`,
                    { locale: fr }
                  )}
                </Text>
                <Icon as={UpDownIcon} />
                <Text pt={2}>
                  {getDay(minDate) !== getDay(maxDate) &&
                    format(maxDate, `EEEE`, { locale: fr })}{" "}
                  {format(
                    maxDate,
                    `H'h'${getMinutes(maxDate) !== 0 ? "mm" : ""}`,
                    { locale: fr }
                  )}
                </Text>
              </Box>
            </GridItem>

            <GridItem
              light={{ bg: "white" }}
              dark={{ bg: "gray.700" }}
              alignItems="center"
            >
              <Flex pl={3} alignItems="center">
                {org && isCreator && (
                  <>
                    {event.isApproved ? (
                      <Tooltip label="Approuvé">
                        <CheckCircleIcon color="green" />
                      </Tooltip>
                    ) : (
                      <Tooltip label="En attente de modération">
                        <WarningIcon color="orange" />
                      </Tooltip>
                    )}

                    <Tooltip
                      label={
                        canSendCount === 0
                          ? "Aucun abonné à notifier"
                          : `Notifier ${canSendCount} abonné${
                              canSendCount > 1 ? "s" : ""
                            } de l'organisation : ${org.orgName}`
                      }
                    >
                      <IconButton
                        aria-label={
                          canSendCount === 0
                            ? "Aucun abonné à notifier"
                            : `Notifier les abonnés de ${org.orgName}`
                        }
                        icon={<EmailIcon />}
                        isLoading={isLoading}
                        isDisabled={!event.isApproved}
                        title={
                          !event.isApproved
                            ? "L'événement est en attente de modération"
                            : ""
                        }
                        bg="transparent"
                        minWidth={0}
                        mx={2}
                        _hover={{
                          background: "transparent",
                          color: "green"
                        }}
                        onClick={async () => {
                          setIsLoading(true);
                          const notify = confirm(
                            `Êtes-vous sûr de vouloir notifier ${canSendCount} abonné${
                              canSendCount > 1 ? "s" : ""
                            } de l'organisation : ${org!.orgName}`
                          );

                          if (!notify) return;

                          try {
                            const res = await editEvent({
                              eventUrl: event.eventUrl,
                              payload: {
                                ...event,
                                eventNotif: [org!._id]
                              }
                            }).unwrap();

                            if (
                              Array.isArray(res.emailList) &&
                              res.emailList.length > 0
                            ) {
                              orgQuery.refetch();
                              toast({
                                title: `Une invitation a été envoyée à ${
                                  res.emailList.length
                                } abonné${res.emailList.length > 1 ? "s" : ""}`,
                                status: "success",
                                isClosable: true
                              });
                            } else {
                              toast({
                                title: "Aucune invitation envoyée",
                                status: "warning",
                                isClosable: true
                              });
                            }
                          } catch (error) {
                            toast({
                              title: "Une erreur est survenue",
                              status: "error",
                              isClosable: true
                            });
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                      />
                    </Tooltip>
                  </>
                )}

                <Link
                  className="rainbow-text"
                  css={css`
                    letter-spacing: 0.1em;
                  `}
                  mr={1}
                  size="larger"
                  href={`/${encodeURIComponent(event.eventUrl)}`}
                  shallow
                >
                  {event.eventName}
                </Link>

                {org && (
                  <EventVisibility eventVisibility={event.eventVisibility} />
                )}

                {session && !event.forwardedFrom ? (
                  <Tooltip label="Rediffuser">
                    <span>
                      <IconButton
                        aria-label="Rediffuser"
                        icon={<FaRetweet />}
                        bg="transparent"
                        _hover={{ background: "transparent", color: "green" }}
                        minWidth={0}
                        ml={2}
                        onClick={() => {
                          setEventToForward(event);
                        }}
                      />
                    </span>
                  </Tooltip>
                ) : event.forwardedFrom &&
                  event.forwardedFrom.eventId &&
                  session?.user.userId === event.createdBy ? (
                  <Tooltip label="Annuler la rediffusion">
                    <IconButton
                      aria-label="Annuler la rediffusion"
                      icon={<DeleteIcon />}
                      bg="transparent"
                      minWidth={0}
                      ml={2}
                      mr={2}
                      _hover={{ background: "transparent", color: "red" }}
                      onClick={async () => {
                        if (!event.forwardedFrom.eventUrl) {
                          console.log(event);
                          return;
                        }

                        const confirmed = confirm(
                          "Êtes vous sûr de vouloir annuler la rediffusion ?"
                        );

                        if (confirmed) {
                          const deletedEvent = await deleteEvent(
                            event.forwardedFrom.eventUrl
                          ).unwrap();

                          if (deletedEvent) {
                            orgQuery.refetch();
                            toast({
                              title: `La rediffusion a bien été annulée.`,
                              status: "success",
                              isClosable: true
                            });
                          }
                        }
                      }}
                    />
                  </Tooltip>
                ) : (
                  event.forwardedFrom &&
                  event.forwardedFrom.eventId &&
                  org && (
                    <Tooltip label={`Rediffusé par ${org.orgName}`}>
                      <span>
                        <Icon as={FaRetweet} color="green" ml={2} />
                      </span>
                    </Tooltip>
                  )
                )}
              </Flex>
            </GridItem>

            <GridItem
              rowSpan={3}
              light={{ bg: "orange.100" }}
              dark={{ bg: "gray.500" }}
              borderBottomRightRadius={
                index === repeatedEvents.length - 1 ? "lg" : undefined
              }
            >
              <Text pt={2} pl={2}>
                {event.eventCity || "À définir"}
              </Text>
            </GridItem>

            <GridItem
              pl={3}
              pb={3}
              light={{ bg: "white" }}
              dark={{ bg: "gray.700" }}
            >
              {event.eventDescription && event.eventDescription.length > 0 ? (
                <Link variant="underline" onClick={() => setEventToShow(event)}>
                  Voir l'affiche de l'événement
                </Link>
              ) : (
                <Text fontSize="smaller">Aucune affiche disponible.</Text>
              )}
            </GridItem>

            {!org && (
              <GridItem
                light={{ bg: "white" }}
                dark={{ bg: "gray.700" }}
                pl={3}
                pb={3}
              >
                {event.eventOrgs.map((eventOrg) => {
                  return (
                    <Link key={eventOrg.orgUrl} href={`/${eventOrg.orgUrl}`}>
                      <Tag>
                        <Icon as={IoIosPeople} mr={1} />
                        {eventOrg.orgName}
                      </Tag>
                    </Link>
                  );
                })}
              </GridItem>
            )}
          </Grid>
        </div>
      );
    });
  }, [props.events, session, isLoading]);

  return (
    <div>
      {org && (
        <>
          <Button
            colorScheme="teal"
            leftIcon={<AddIcon />}
            mb={5}
            onClick={addEvent}
            data-cy="addEvent"
          >
            Ajouter un événement
          </Button>

          {session && isEventModalOpen && (
            <EventModal
              session={session}
              initialEventOrgs={[org]}
              onCancel={() => setIsEventModalOpen(false)}
              onSubmit={async (eventUrl) => {
                await router.push(`/${eventUrl}`, `/${eventUrl}`, {
                  shallow: true
                });
              }}
              onClose={() => setIsEventModalOpen(false)}
            />
          )}
        </>
      )}

      {events}

      {eventToShow && (
        <DescriptionModal
          onClose={() => {
            setEventToShow(null);
          }}
          header={
            <Link
              href={`/${eventToShow.eventUrl}`}
              css={css`
                letter-spacing: 0.1em;
              `}
              size="larger"
              className="rainbow-text"
            >
              {eventToShow.eventName}
            </Link>
          }
        >
          {eventToShow.eventDescription &&
          eventToShow.eventDescription.length > 0 &&
          eventToShow.eventDescription !== "<p><br></p>" ? (
            <div className="ql-editor">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(eventToShow.eventDescription)
                }}
              />
            </div>
          ) : (
            <Text fontStyle="italic">Aucune description.</Text>
          )}
        </DescriptionModal>
      )}

      {eventToForward && (
        <ForwardModal
          event={eventToForward}
          onCancel={() => {
            setEventToForward(null);
          }}
          onClose={() => {
            setEventToForward(null);
          }}
          onSubmit={() => {
            setEventToForward(null);
          }}
        />
      )}
    </div>
  );
};
