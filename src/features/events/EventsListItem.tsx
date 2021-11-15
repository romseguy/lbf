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
import { Link, GridItem, EntityButton } from "features/common";
import { ModalState } from "features/modals/EntityNotifModal";
import { Category, IEvent } from "models/Event";
import { IOrg, orgTypeFull2 } from "models/Org";
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
  let label = org
    ? `Ajoutez des adhérents ou des abonnés ${orgTypeFull2(
        org.orgType
      )} pour envoyer des invitations à cet événement`
    : "";

  if (
    org &&
    Array.isArray(org.orgSubscriptions) &&
    org.orgSubscriptions.length > 0
  ) {
    notifiedCount = Array.isArray(event.eventNotified)
      ? event.eventNotified.length
      : 0;
    canSendCount = org.orgSubscriptions.length - notifiedCount;
    label = canSendCount > 0 ? `Envoyer des invitations` : label;
  }

  return (
    <>
      <Td
        borderBottomLeftRadius={index === length - 1 ? "lg" : undefined}
        borderWidth={0}
        p={2}
        pl={3}
        textAlign="center"
        verticalAlign="middle"
      >
        <Flex flexDirection="column" alignItems="center">
          {/* eventCategory */}
          {typeof event.eventCategory === "number" &&
            event.eventCategory !== 0 && (
              <GridItem mb={2}>
                <Button
                  color="white"
                  colorScheme={
                    Category[event.eventCategory].bgColor === "transparent"
                      ? isDark
                        ? "whiteAlpha"
                        : "blackAlpha"
                      : Category[event.eventCategory].bgColor
                  }
                  fontSize="small"
                  fontWeight="normal"
                  height="auto"
                  p={1}
                >
                  {Category[event.eventCategory].label}
                </Button>
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
                <Button
                  colorScheme="purple"
                  color="white"
                  fontWeight="normal"
                  fontSize="small"
                  height="auto"
                  p={1}
                  size="sm"
                >
                  {event.eventDistance}
                </Button>
              </Tooltip>
            </GridItem>
          )}

          {/* eventMinDate */}
          <Text fontWeight="bold">
            {format(minDate, `H'h'${getMinutes(minDate) !== 0 ? "mm" : ""}`, {
              locale: fr
            })}
          </Text>

          <Icon as={UpDownIcon} />

          {/* eventMaxDate */}
          <Text fontWeight="bold" mt={1}>
            {getDay(minDate) !== getDay(maxDate) &&
              format(maxDate, `EEEE`, { locale: fr })}{" "}
            {format(maxDate, `H'h'${getMinutes(maxDate) !== 0 ? "mm" : ""}`, {
              locale: fr
            })}
          </Text>
        </Flex>
      </Td>

      <Td
        borderBottomRightRadius={index === length - 1 ? "lg" : undefined}
        borderWidth={0}
        p={0}
        verticalAlign="middle"
        width="100%"
      >
        <Flex alignItems="center" pt={1} pr={1}>
          {/* isApproved */}
          {showIsApproved && (
            <>
              {!event.isApproved && (
                <Tooltip label="Événement en attente de modération">
                  <WarningIcon color="orange" />
                </Tooltip>
              )}

              {org && isCreator && (
                <Tooltip label={label} placement="right" hasArrow>
                  <span>
                    <IconButton
                      aria-label={label}
                      icon={<EmailIcon />}
                      isLoading={isLoading}
                      isDisabled={
                        !event.isApproved || !hasItems(org.orgSubscriptions)
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
                  </span>
                </Tooltip>
              )}
            </>
          )}

          <Box flexGrow={1} px={2}>
            {/* eventName */}
            <GridItem mb={2}>
              <Link
                className={eventNameClassName}
                fontSize={["sm", "lg"]}
                fontWeight="bold"
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
                        <EntityButton
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
                      <EntityButton
                        key={event.createdBy._id}
                        user={event.createdBy}
                        px={2}
                        py={1}
                        bg={isDark ? "whiteAlpha.500" : "blackAlpha.200"}
                        onClick={() => {
                          if (typeof event.createdBy === "object") {
                            router.push(
                              `/${event.createdBy.userName}`,
                              `/${event.createdBy.userName}`,
                              {
                                shallow: true
                              }
                            );
                          }
                        }}
                      />
                    )}
              </GridItem>
            )}
          </Box>

          <Flex alignItems="center">
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
          </Flex>
        </Flex>
      </Td>
    </>
  );
};
