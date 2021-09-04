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
  Tag
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
import { DeleteIcon, EmailIcon, LockIcon, UpDownIcon } from "@chakra-ui/icons";
import { css } from "twin.macro";
import { DescriptionModal } from "features/modals/DescriptionModal";
import DOMPurify from "isomorphic-dompurify";
import { FaGlobeEurope, FaRetweet } from "react-icons/fa";
import { useAppDispatch } from "store";
import { useSession } from "hooks/useAuth";
import { ForwardModal } from "features/modals/ForwardModal";
import { useDeleteEventMutation, useEventNotifyMutation } from "./eventsApi";
import { IOrg, orgTypeFull } from "models/Org";
import { SubscriptionTypes } from "models/Subscription";
import { IoIosPeople } from "react-icons/io";

const EventVisibility = ({ eventVisibility }: { eventVisibility?: string }) =>
  eventVisibility === Visibility.SUBSCRIBERS ? (
    <Tooltip label="Événement réservé aux adhérents">
      <LockIcon boxSize={4} />
    </Tooltip>
  ) : // : topicVisibility === Visibility.FOLLOWERS ? (
  //   <Tooltip label="Événement réservé aux abonnés">
  //     <EmailIcon boxSize={4} />
  //   </Tooltip>
  // )
  eventVisibility === Visibility.PUBLIC ? (
    <Tooltip label="Événement visible par tous">
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
};

export const EventsList = (props: EventsProps) => {
  const toast = useToast({ position: "top" });
  const { data: session, loading: isSessionLoading } = useSession();
  const [deleteEvent, deleteQuery] = useDeleteEventMutation();
  const [eventNotify, q] = useEventNotifyMutation();
  let currentDate: Date | undefined;
  let addGridHeader = true;

  const [isDescriptionOpen, setIsDescriptionOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const [isForwardOpen, setIsForwardOpen] = useState<{
    [key: string]: boolean;
  }>({});

  const addRepeatedEvents = (events: IEvent[]) => {
    let array: IEvent[] = [];

    for (const event of events) {
      if (
        props.isCreator ||
        event.eventVisibility === Visibility.PUBLIC ||
        (event.eventVisibility === Visibility.SUBSCRIBERS && props.isSubscribed)
      ) {
        array.push(event);

        if (event.repeat) {
          const start = parseISO(event.eventMinDate);
          const end = parseISO(event.eventMaxDate);

          const { days = 0, hours = 0 } = intervalToDuration({
            start,
            end
          });

          for (let i = 1; i <= event.repeat; i++) {
            const eventMinDate = addWeeks(start, i);
            const eventMaxDate = addDays(addHours(eventMinDate, hours), days);
            array.push({
              ...event,
              eventMinDate: formatISO(eventMinDate),
              eventMaxDate: formatISO(eventMaxDate),
              repeat: event.repeat + i
            });
          }
        }
      }
    }

    return array;
  };

  const orgFollowersCount = props.org?.orgSubscriptions
    .map(
      (subscription) =>
        subscription.orgs.filter((orgSubscription) => {
          return (
            orgSubscription.orgId === props.org?._id &&
            orgSubscription.type === SubscriptionTypes.FOLLOWER
          );
        }).length
    )
    .reduce((a, b) => a + b, 0);

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

      if (orgFollowersCount && session?.user.userId === event.createdBy) {
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
                {props.org && session?.user.userId === event.createdBy && (
                  <Tooltip
                    label={
                      canSendCount === 0
                        ? "Aucun abonné à notifier"
                        : `Notifier ${canSendCount} abonné${
                            canSendCount > 1 ? "s" : ""
                          } de l'organisation : ${props.org.orgName}`
                    }
                  >
                    <IconButton
                      aria-label={
                        canSendCount === 0
                          ? "Aucun abonné à notifier"
                          : `Notifier les abonnés de ${props.org.orgName}`
                      }
                      icon={<EmailIcon />}
                      isDisabled={!event.isApproved}
                      title={
                        !event.isApproved
                          ? "L'événement est en attente de modération"
                          : ""
                      }
                      bg="transparent"
                      minWidth={0}
                      mr={2}
                      _hover={{
                        background: "transparent",
                        color: "green"
                      }}
                      onClick={async () => {
                        const notify = confirm(
                          `Êtes-vous sûr de vouloir notifier ${canSendCount} abonné${
                            canSendCount > 1 ? "s" : ""
                          } de l'organisation : ${props.org!.orgName}`
                        );

                        if (!notify) return;

                        try {
                          const res = await eventNotify({
                            eventId: event._id,
                            payload: {
                              event: {
                                ...event,
                                eventNotif: [props.org!._id]
                              }
                            }
                          }).unwrap();

                          if (
                            Array.isArray(res.emailList) &&
                            res.emailList.length > 0
                          ) {
                            props.orgQuery.refetch();
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
                        }
                      }}
                    />
                  </Tooltip>
                )}

                <Link
                  className="rainbow-text"
                  css={css`
                    letter-spacing: 0.1em;
                  `}
                  mr={1}
                  size="larger"
                  href={`/${encodeURIComponent(event.eventUrl)}`}
                >
                  {event.eventName}
                </Link>

                {props.org && (
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
                          setIsForwardOpen({
                            ...isForwardOpen,
                            [event.eventName]: true
                          });
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
                            props.orgQuery.refetch();
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
                  props.org && (
                    <Tooltip label={`Rediffusé par ${props.org.orgName}`}>
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
                <Link
                  variant="underline"
                  onClick={() =>
                    setIsDescriptionOpen({
                      ...isDescriptionOpen,
                      [event.eventName]: true
                    })
                  }
                >
                  Voir l'affiche de l'événement
                </Link>
              ) : (
                <Text fontSize="smaller">Aucune affiche disponible.</Text>
              )}
            </GridItem>

            {!props.org && (
              <GridItem light={{ bg: "white" }} dark={{ bg: "gray.700" }}>
                {event.eventOrgs.map((eventOrg) => {
                  return (
                    <Link key={eventOrg.orgUrl} href={`/${eventOrg.orgUrl}`}>
                      <Tag ml={3} mb={3}>
                        <Icon as={IoIosPeople} mr={1} />
                        {eventOrg.orgName}
                      </Tag>
                    </Link>
                  );
                })}
              </GridItem>
            )}
          </Grid>

          <DescriptionModal
            defaultIsOpen={false}
            isOpen={isDescriptionOpen[event.eventName]}
            onClose={() => {
              setIsDescriptionOpen({
                ...isDescriptionOpen,
                [event.eventName]: false
              });
            }}
            header={
              <Link
                href={`/${event.eventUrl}`}
                css={css`
                  letter-spacing: 0.1em;
                `}
                size="larger"
                className="rainbow-text"
              >
                {event.eventName}
              </Link>
            }
          >
            {event.eventDescription &&
            event.eventDescription.length > 0 &&
            event.eventDescription !== "<p><br></p>" ? (
              <div className="ql-editor">
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(event.eventDescription)
                  }}
                />
              </div>
            ) : (
              <Text fontStyle="italic">Aucune description.</Text>
            )}
          </DescriptionModal>

          {session && (
            <ForwardModal
              defaultIsOpen={false}
              isOpen={isForwardOpen[event.eventName]}
              event={event}
              session={session}
              onCancel={() => {
                setIsForwardOpen({
                  ...isForwardOpen,
                  [event.eventName]: false
                });
              }}
              onClose={() => {
                setIsForwardOpen({
                  ...isForwardOpen,
                  [event.eventName]: false
                });
              }}
              onSubmit={() => {
                setIsForwardOpen({
                  ...isForwardOpen,
                  [event.eventName]: false
                });
              }}
            />
          )}
        </div>
      );
    });
  }, [props.events, session, isDescriptionOpen, isForwardOpen]);

  return <div>{events}</div>;
};
