import {
  AddIcon,
  CheckCircleIcon,
  DeleteIcon,
  EmailIcon,
  UpDownIcon,
  WarningIcon
} from "@chakra-ui/icons";
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
  Button,
  useColorMode
} from "@chakra-ui/react";
import {
  compareAsc,
  format,
  addHours,
  addWeeks,
  intervalToDuration,
  parseISO,
  formatISO,
  getMinutes,
  getDayOfYear,
  getDay,
  setDay,
  compareDesc,
  setHours
} from "date-fns";
import { fr } from "date-fns/locale";
import DOMPurify from "isomorphic-dompurify";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { FaGlobeEurope, FaRetweet } from "react-icons/fa";
import { IoIosPeople, IoIosPerson, IoMdPerson } from "react-icons/io";
import { css } from "twin.macro";
import { Link, GridHeader, GridItem, Spacer } from "features/common";
import { DescriptionModal } from "features/modals/DescriptionModal";
import { EventModal } from "features/modals/EventModal";
import { ForwardModal } from "features/modals/ForwardModal";
import { useSession } from "hooks/useAuth";
import { Category, IEvent, Visibility } from "models/Event";
import { IOrg, orgTypeFull } from "models/Org";
import { SubscriptionTypes } from "models/Subscription";
import { useDeleteEventMutation, useEditEventMutation } from "./eventsApi";

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

export const EventsList = ({
  org,
  orgQuery,
  isCreator,
  isSubscribed,
  isLogin,
  setIsLogin,
  ...props
}: {
  events: IEvent[];
  org?: IOrg;
  orgQuery?: any;
  eventHeader?: any;
  isCreator?: boolean;
  isSubscribed?: boolean;
  isLogin?: number;
  setIsLogin?: (isLogin: number) => void;
}) => {
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();
  const toast = useToast({ position: "top" });
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const today = setHours(new Date(), 0);

  const [deleteEvent, deleteQuery] = useDeleteEventMutation();
  const [editEvent, editEventMutation] = useEditEventMutation();

  //#region local state
  const [isLoading, setIsLoading] = useState(false);
  const [eventToShow, setEventToShow] = useState<IEvent | null>(null);
  const [eventToForward, setEventToForward] = useState<IEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  let currentDate: Date | undefined;
  let addGridHeader = true;
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

  const addRepeatedEvents = (events: IEvent[]) => {
    let array = [];

    for (const event of events) {
      if (
        isCreator ||
        event.eventVisibility === Visibility.PUBLIC ||
        (event.eventVisibility === Visibility.SUBSCRIBERS && isSubscribed)
      ) {
        const start = parseISO(event.eventMinDate);
        const end = parseISO(event.eventMaxDate);
        const { days = 0, hours = 0 } = intervalToDuration({
          start,
          end
        });

        if (compareDesc(today, start) !== -1) {
          array.push({
            ...event,
            eventMinDate: start,
            eventMaxDate: end
          });
        }

        if (event.otherDays) {
          for (const otherDay of event.otherDays) {
            const eventMinDate = otherDay.startDate
              ? parseISO(otherDay.startDate)
              : setDay(start, otherDay.dayNumber + 1);
            const eventMaxDate = otherDay.startDate
              ? addHours(parseISO(otherDay.startDate), hours)
              : setDay(end, otherDay.dayNumber + 1);

            if (compareDesc(today, eventMinDate) !== -1) {
              array.push({
                ...event,
                eventMinDate,
                eventMaxDate
              });
            }
          }
        }

        if (event.repeat) {
          const repeatCount = event.repeat === 99 ? 10 : event.repeat;

          for (let i = 1; i <= repeatCount; i++) {
            const eventMinDate = addWeeks(start, i);
            const eventMaxDate = addWeeks(end, i);
            array.push({
              ...event,
              eventMinDate,
              eventMaxDate,
              repeat: repeatCount + i
            });

            if (event.otherDays) {
              for (const otherDay of event.otherDays) {
                array.push({
                  ...event,
                  eventMinDate: otherDay.startDate
                    ? addWeeks(parseISO(otherDay.startDate), i)
                    : setDay(eventMinDate, otherDay.dayNumber + 1),
                  eventMaxDate: otherDay.startDate
                    ? addWeeks(addHours(parseISO(otherDay.startDate), hours), i)
                    : setDay(eventMaxDate, otherDay.dayNumber + 1)
                });
              }
            }
          }
        }
      }
    }

    return array;
  };

  const events = useMemo(() => {
    const repeatedEvents = addRepeatedEvents(props.events).sort((a, b) =>
      compareAsc(a.eventMinDate, b.eventMinDate)
    );

    return repeatedEvents.map((event, index) => {
      const minDate = event.eventMinDate;
      const maxDate = event.eventMaxDate;
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
        <div key={"event-" + index}>
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
                                eventMinDate: formatISO(minDate),
                                eventMaxDate: formatISO(maxDate),
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

                {event.eventCategory && (
                  <Tag
                    color="white"
                    bgColor={
                      Category[event.eventCategory].bgColor === "transparent"
                        ? isDark
                          ? "whiteAlpha.100"
                          : "blackAlpha.600"
                        : Category[event.eventCategory].bgColor
                    }
                    mr={1}
                  >
                    {Category[event.eventCategory].label}
                  </Tag>
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
                          setEventToForward({
                            ...event,
                            eventMinDate: formatISO(minDate),
                            eventMaxDate: formatISO(maxDate)
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
                <Link
                  variant="underline"
                  onClick={() =>
                    setEventToShow({
                      ...event,
                      eventMinDate: formatISO(minDate),
                      eventMaxDate: formatISO(maxDate)
                    })
                  }
                >
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
                {event.eventOrgs.length > 0
                  ? event.eventOrgs.map((eventOrg) => {
                      return (
                        <Link
                          key={eventOrg.orgUrl}
                          href={`/${eventOrg.orgUrl}`}
                        >
                          <Tag>
                            <Icon as={IoIosPeople} mr={1} />
                            {eventOrg.orgName}
                          </Tag>
                        </Link>
                      );
                    })
                  : typeof event.createdBy === "object" && (
                      <Link href={`/${event.createdBy.userName}`}>
                        <Tag>
                          <Icon as={IoIosPerson} mr={1} />
                          {event.createdBy.userName}
                        </Tag>
                      </Link>
                    )}
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
            onClick={() => {
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
            }}
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
