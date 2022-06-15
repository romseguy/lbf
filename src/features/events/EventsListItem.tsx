import {
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
import React, { useState } from "react";
import { FaRetweet } from "react-icons/fa";
import { Link, GridItem, EntityButton } from "features/common";
import { NotifModalState } from "features/modals/EntityNotifModal";
import { getEventCategories, IEvent } from "models/Event";
import { IOrg, IOrgEventCategory } from "models/Org";
import { hasItems } from "utils/array";
import { Session } from "utils/auth";
import { EventsListItemVisibility } from "./EventsListItemVisibility";

export const EventsListItem = ({
  deleteEvent,
  editEvent,
  editOrg,
  event,
  index,
  isCreator,
  isDark,
  org,
  orgFollowersCount,
  length,
  session,
  eventToForward,
  setEventToForward,
  eventToShow,
  setEventToShow,
  eventToShowOnMap,
  setEventToShowOnMap,
  isLoading,
  setIsLoading,
  notifyModalState,
  setNotifyModalState,
  selectedCategories,
  setSelectedCategories,
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
  orgFollowersCount?: number;
  eventToForward: IEvent<Date> | null;
  setEventToForward: (event: IEvent<Date> | null) => void;
  eventToShow: IEvent | null;
  setEventToShow: (event: IEvent | null) => void;
  eventToShowOnMap: IEvent<string | Date> | null;
  setEventToShowOnMap: (event: IEvent<string | Date> | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  notifyModalState: NotifModalState<IEvent<string | Date>>;
  setNotifyModalState: (
    modalState: NotifModalState<IEvent<string | Date>>
  ) => void;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  session: Session | null;
  city: string | null;
  toast: any;
}) => {
  const [eventNameClassName, setEventNameClassName] = useState("");

  const minDate = event.eventMinDate;
  const maxDate = event.eventMaxDate;
  const showIsApproved = !!(org && isCreator);
  const isCategorySelected =
    typeof event.eventCategory === "string"
      ? selectedCategories.includes(event.eventCategory)
      : false;

  const categories = getEventCategories(event);
  const eventCategory: IOrgEventCategory | undefined = event.eventCategory
    ? categories.find(({ catId }) => catId === event.eventCategory)
    : undefined;

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
          {eventCategory && (
            <GridItem mb={2}>
              <Tooltip
                label={
                  !isCategorySelected
                    ? `Afficher les événements de la catégorie "${eventCategory.label}"`
                    : ""
                }
              >
                <Button
                  variant={isCategorySelected ? "solid" : "outline"}
                  colorScheme={isCategorySelected ? "teal" : undefined}
                  fontSize="small"
                  fontWeight="normal"
                  height="auto"
                  p={1}
                  onClick={() => {
                    setSelectedCategories(
                      isCategorySelected
                        ? selectedCategories.filter(
                            (selectedCategory) =>
                              selectedCategory !== event.eventCategory!
                          )
                        : [...selectedCategories, event.eventCategory!]
                    );
                  }}
                >
                  {eventCategory.label}
                </Button>
              </Tooltip>
            </GridItem>
          )}

          {/* eventCity */}
          {event.eventCity &&
            Array.isArray(event.eventAddress) &&
            event.eventAddress.length > 0 && (
              <GridItem mb={2}>
                <Tooltip
                  hasArrow
                  label={event.eventAddress[0].address}
                  placement="right"
                >
                  <span>
                    <Link
                      variant="underline"
                      fontWeight="bold"
                      onClick={() => setEventToShowOnMap(event)}
                    >
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
                <Tooltip
                  label={`Envoyer des invitations à cet événement`}
                  placement="right"
                  hasArrow
                >
                  <IconButton
                    aria-label={`Envoyer des invitations à cet événement`}
                    icon={<EmailIcon />}
                    isLoading={isLoading}
                    isDisabled={!event.isApproved}
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
                        eventMinDate: minDate,
                        eventMaxDate: maxDate
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
                          eventId: event.forwardedFrom?.eventId
                        }).unwrap();
                      } else {
                        await editEvent({
                          eventId: event.forwardedFrom?.eventId,
                          payload: {
                            eventOrgs: event.eventOrgs.filter((eventOrg) =>
                              typeof eventOrg === "object"
                                ? eventOrg._id !== org._id
                                : eventOrg !== org._id
                            )
                          }
                        });
                        await editOrg({
                          orgId: org._id,
                          payload: {
                            orgEvents: org.orgEvents.filter(
                              (orgEvent) => orgEvent._id !== event._id
                            )
                          }
                        });
                      }

                      toast({
                        title: `La rediffusion a été annulée.`,
                        status: "success"
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
