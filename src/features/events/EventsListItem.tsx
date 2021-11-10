import {
  CheckCircleIcon,
  DeleteIcon,
  EmailIcon,
  InfoIcon,
  UpDownIcon,
  WarningIcon
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Tag,
  Td,
  Text,
  Tooltip
} from "@chakra-ui/react";
import { format, formatISO, getMinutes, getDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaRetweet } from "react-icons/fa";
import { IoIosPerson } from "react-icons/io";
import { css } from "twin.macro";
import { Link, GridItem, EntityBadge } from "features/common";
import { ModalState } from "features/modals/NotifyModal";
import { Category, IEvent } from "models/Event";
import { IOrg, orgTypeFull } from "models/Org";
import { hasItems } from "utils/array";
import { EventsListItemVisibility } from "./EventsListItemVisibility";

export const EventsListItem = ({
  deleteEvent,
  editEvent,
  editOrg,
  event,
  index,
  isCreator,
  isDark,
  isLoading,
  setIsLoading,
  org,
  orgQuery,
  orgFollowersCount,
  length,
  session,
  eventToForward,
  setEventToForward,
  notifyModalState,
  setNotifyModalState,
  eventToShow,
  setEventToShow,
  city,
  toast,
  ...props
}: {
  deleteEvent: any;
  editEvent: any;
  editOrg: any;
  event: IEvent<Date>;
  index: number;
  isCreator?: boolean;
  isDark: boolean;
  length: number;
  org?: IOrg;
  orgQuery?: any;
  orgFollowersCount?: number;
  eventToForward: IEvent | null;
  setEventToForward: (event: IEvent | null) => void;
  notifyModalState: ModalState<IEvent<string | Date>>;
  setNotifyModalState: (modalState: ModalState<IEvent<string | Date>>) => void;
  eventToShow: IEvent | null;
  setEventToShow: (event: IEvent | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  session: Session | null;
  city: string | null;
  toast: any;
}) => {
  const router = useRouter();
  const [eventNameClassName, setEventNameClassName] = useState("");

  const minDate = event.eventMinDate;
  const maxDate = event.eventMaxDate;
  const showIsApproved = !!(org && isCreator);
  const showEventCategory = !!event.eventCategory;
  const showEventVisiblity = !!org;
  const showSend = !!(org && isCreator);
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
    <>
      <Td
        borderBottomLeftRadius={index === length - 1 ? "lg" : undefined}
        borderWidth={0}
        p={2}
        pl={3}
        textAlign="center"
      >
        {/* eventCategory */}
        {typeof event.eventCategory === "number" && event.eventCategory !== 0 && (
          <GridItem mb={2}>
            <Tag
              color="white"
              bgColor={
                Category[event.eventCategory].bgColor === "transparent"
                  ? isDark
                    ? "whiteAlpha.100"
                    : "blackAlpha.600"
                  : Category[event.eventCategory].bgColor
              }
              css={css`
                font-size: 0.8rem;
                @media (min-width: 730px) {
                  font-size: 0.9rem;
                }
              `}
            >
              {Category[event.eventCategory].label}
            </Tag>
          </GridItem>
        )}

        {/* eventCity */}
        {event.eventCity && event.eventAddress && (
          <GridItem mb={2}>
            <Tooltip
              hasArrow
              label={event.eventAddress[0].address}
              placement="right"
            >
              <span>
                <Link variant="underline" fontWeight="bold">
                  {event.eventCity}
                </Link>
              </span>
            </Tooltip>
          </GridItem>
        )}

        {/* eventDistance */}
        {event.eventDistance && (
          <GridItem mb={2}>
            <Tooltip
              hasArrow
              label={`Événement à ${event.eventDistance} de ${city}`}
              placement="right"
            >
              <Tag colorScheme="purple" color="white">
                {event.eventDistance}
              </Tag>
            </Tooltip>
          </GridItem>
        )}

        {/* eventMinDate */}
        <Text
          mt={1}
          title={
            process.env.NODE_ENV === "development"
              ? `${event.repeat}`
              : undefined
          }
        >
          {format(minDate, `H'h'${getMinutes(minDate) !== 0 ? "mm" : ""}`, {
            locale: fr
          })}
        </Text>

        <Icon as={UpDownIcon} mt={2} mb={3} />

        {/* eventMaxDate */}
        <Text mb={1}>
          {getDay(minDate) !== getDay(maxDate) &&
            format(maxDate, `EEEE`, { locale: fr })}{" "}
          {format(maxDate, `H'h'${getMinutes(maxDate) !== 0 ? "mm" : ""}`, {
            locale: fr
          })}
        </Text>
      </Td>

      <Td
        borderBottomRightRadius={index === length - 1 ? "lg" : undefined}
        borderWidth={0}
        p={0}
        verticalAlign="top"
        width="100%"
      >
        <Flex alignItems="center" flexWrap="wrap" p={2}>
          <Box>
            {/* isApproved */}
            {showIsApproved && (
              <GridItem pl={1}>
                {event.isApproved ? (
                  <Tooltip label="Événement approuvé">
                    <CheckCircleIcon color="green" />
                  </Tooltip>
                ) : (
                  <Tooltip label="Événement en attente de modération">
                    <WarningIcon color="orange" />
                  </Tooltip>
                )}

                {org && isCreator && (
                  <Tooltip
                    label={
                      canSendCount === 0
                        ? "Tous les abonnés ont reçu l'invitation"
                        : `${canSendCount} abonné${
                            canSendCount > 1 ? "s" : ""
                          } ${orgTypeFull(org.orgType)} ${org.orgName} n'${
                            canSendCount > 1 ? "ont" : "a"
                          } pas encore reçu d'invitation.`
                    }
                  >
                    <IconButton
                      aria-label={
                        canSendCount === 0
                          ? "Aucun abonné à inviter"
                          : `Inviter les abonnés de ${org.orgName}`
                      }
                      icon={<EmailIcon />}
                      isLoading={isLoading}
                      isDisabled={
                        !event.isApproved || !hasItems(org.orgSubscriptions)
                      }
                      title={
                        !event.isApproved
                          ? "L'événement est en attente de modération"
                          : !hasItems(org.orgSubscriptions)
                          ? "Aucun abonné à inviter"
                          : ""
                      }
                      bg="transparent"
                      height="auto"
                      minWidth={0}
                      mx={2}
                      _hover={{
                        background: "transparent",
                        color: "green"
                      }}
                      onClick={(e) => {
                        setNotifyModalState({
                          ...notifyModalState,
                          entity: event
                        });
                      }}
                    />
                  </Tooltip>
                )}
              </GridItem>
            )}
          </Box>

          <Box flexGrow={1} px={2}>
            {/* eventName */}
            <GridItem mb={2}>
              <Link
                className={eventNameClassName}
                fontSize={["sm", "lg"]}
                href={`/${encodeURIComponent(event.eventUrl)}`}
                shallow
                onMouseEnter={() => setEventNameClassName("rainbow-text")}
                onMouseLeave={() => setEventNameClassName("")}
              >
                {event.eventName}
              </Link>
            </GridItem>
            <GridItem mb={2}>
              {event.eventDescription && event.eventDescription.length > 0 ? (
                <Box>
                  <Button
                    colorScheme="teal"
                    leftIcon={<InfoIcon />}
                    fontSize="small"
                    fontWeight="normal"
                    height="auto"
                    py={2}
                    whiteSpace="normal"
                    onClick={() =>
                      setEventToShow({
                        ...event,
                        eventMinDate: formatISO(minDate),
                        eventMaxDate: formatISO(maxDate)
                      })
                    }
                  >
                    Voir l'affiche de l'événement
                  </Button>
                </Box>
              ) : (
                <Text fontSize="smaller">Aucune affiche disponible.</Text>
              )}
            </GridItem>

            {!org && (
              <GridItem mb={2}>
                {hasItems(event.eventOrgs)
                  ? event.eventOrgs.map((eventOrg: any) => {
                      return (
                        <EntityBadge
                          key={eventOrg._id}
                          org={eventOrg}
                          px={2}
                          py={1}
                          bg={isDark ? "whiteAlpha.400" : "blackAlpha.200"}
                          onClick={() => {
                            router.push(
                              `/${eventOrg.orgUrl}`,
                              `/${eventOrg.orgUrl}`,
                              {
                                shallow: true
                              }
                            );
                          }}
                        />
                      );
                    })
                  : typeof event.createdBy === "object" && (
                      <Link href={`/${event.createdBy.userName}`} shallow>
                        <Tag
                          bg={isDark ? "whiteAlpha.500" : "blackAlpha.200"}
                          color="black"
                        >
                          <Icon as={IoIosPerson} mr={1} />
                          {event.createdBy.userName}
                        </Tag>
                      </Link>
                    )}
              </GridItem>
            )}
          </Box>

          <Box>
            <GridItem whiteSpace="nowrap">
              {/* eventVisibility */}
              {org && (
                <EventsListItemVisibility
                  eventVisibility={event.eventVisibility}
                />
              )}

              {/* eventForwardedFrom */}
              {session && !event.forwardedFrom ? (
                <Tooltip label="Rediffuser">
                  <span>
                    <IconButton
                      aria-label="Rediffuser"
                      icon={<FaRetweet />}
                      bg="transparent"
                      _hover={{ background: "transparent", color: "green" }}
                      minWidth={0}
                      ml={org ? 2 : 0}
                      height="auto"
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
              ) : org &&
                event.forwardedFrom &&
                event.forwardedFrom.eventId &&
                session?.user.userId === event.createdBy ? (
                <Tooltip label="Annuler la rediffusion">
                  <IconButton
                    aria-label="Annuler la rediffusion"
                    icon={<DeleteIcon />}
                    bg="transparent"
                    height="auto"
                    minWidth={0}
                    ml={2}
                    mr={3}
                    _hover={{ background: "transparent", color: "red" }}
                    onClick={async () => {
                      const confirmed = confirm(
                        "Êtes vous sûr de vouloir annuler la rediffusion ?"
                      );

                      if (confirmed) {
                        if (event.eventOrgs.length <= 1) {
                          await deleteEvent({
                            eventUrl: event.forwardedFrom?.eventId
                          }).unwrap();
                        } else {
                          await editEvent({
                            eventUrl: event.forwardedFrom?.eventId,
                            payload: {
                              eventOrgs: event.eventOrgs.filter((eventOrg) =>
                                typeof eventOrg === "object"
                                  ? eventOrg._id !== org._id
                                  : eventOrg !== org._id
                              )
                            }
                          });
                          await editOrg({
                            orgUrl: org.orgUrl,
                            payload: {
                              orgEvents: org.orgEvents.filter(
                                (orgEvent) => orgEvent._id !== event._id
                              )
                            }
                          });
                        }

                        orgQuery.refetch();
                        toast({
                          title: `La rediffusion a bien été annulée.`,
                          status: "success",
                          isClosable: true
                        });
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
            </GridItem>
          </Box>
        </Flex>
      </Td>
    </>
  );
};
