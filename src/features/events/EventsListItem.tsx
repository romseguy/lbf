import {
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
  IconButton,
  Tag
} from "@chakra-ui/react";
import { format, formatISO, getMinutes, getDayOfYear, getDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Session } from "next-auth";
import React from "react";
import { FaGlobeEurope, FaRetweet } from "react-icons/fa";
import { IoIosPeople, IoIosPerson, IoMdPerson } from "react-icons/io";
import { css } from "twin.macro";
import { Link, GridHeader, GridItem, Spacer } from "features/common";
import { Category, IEvent, Visibility } from "models/Event";
import { IOrg } from "models/Org";
import { useEditOrgMutation } from "features/orgs/orgsApi";
import { EventsListItemVisibility } from "./EventsListItemVisibility";
import { ModalState } from "features/modals/NotifyModal";

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
  toast,
  ...props
}: {
  deleteEvent: any;
  editEvent: any;
  editOrg: any;
  event: IEvent<Date>;
  eventHeader?: any;
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
  toast: any;
}) => {
  const minDate = event.eventMinDate;
  const maxDate = event.eventMaxDate;
  const showIsApproved = org && isCreator;
  const showEventCategory: boolean = event.eventCategory ? true : false;
  const showEventVisiblity = !!org;
  const extraColumns = [showIsApproved, showEventCategory, showEventVisiblity]
    .filter((b) => b)
    .flatMap((b) => "auto ");

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
      <GridItem
        rowSpan={3}
        light={{ bg: "orange.100" }}
        dark={{ bg: "gray.500" }}
        borderBottomLeftRadius={index === length - 1 ? "lg" : undefined}
      >
        <Box pt={2} pl={2} pr={2}>
          <Text
            pb={1}
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
          <Icon as={UpDownIcon} />
          <Text pt={2}>
            {getDay(minDate) !== getDay(maxDate) &&
              format(maxDate, `EEEE`, { locale: fr })}{" "}
            {format(maxDate, `H'h'${getMinutes(maxDate) !== 0 ? "mm" : ""}`, {
              locale: fr
            })}
          </Text>
        </Box>
      </GridItem>

      <GridItem
        light={{ bg: "white" }}
        dark={{ bg: "gray.700" }}
        alignItems="center"
      >
        {/* <Flex pl={3} alignItems="center"> */}
        <Grid
          alignItems="center"
          css={css`
            grid-template-columns: auto auto ${extraColumns[0]} 1fr;

            @media (max-width: 700px) {
              grid-template-columns: 1fr !important;

              &:first-of-type {
                padding-top: 4px;
              }
            }
          `}
        >
          {/* isApproved */}
          {showIsApproved && (
            <GridItem pl={1}>
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
                  // onClick={async () => {
                  //   setIsLoading(true);
                  //   const notify = confirm(
                  //     `Êtes-vous sûr de vouloir notifier ${canSendCount} abonné${
                  //       canSendCount > 1 ? "s" : ""
                  //     } de l'organisation : ${org!.orgName}`
                  //   );

                  //   if (!notify) return;

                  //   try {
                  //     const res = await editEvent({
                  //       eventUrl: event.eventUrl,
                  //       payload: {
                  //         eventNotif: [org!._id]
                  //       }
                  //     }).unwrap();

                  //     if (
                  //       Array.isArray(res.emailList) &&
                  //       res.emailList.length > 0
                  //     ) {
                  //       orgQuery.refetch();
                  //       toast({
                  //         title: `Une invitation a été envoyée à ${
                  //           res.emailList.length
                  //         } abonné${res.emailList.length > 1 ? "s" : ""}`,
                  //         status: "success",
                  //         isClosable: true
                  //       });
                  //     } else {
                  //       toast({
                  //         title: "Aucune invitation envoyée",
                  //         status: "warning",
                  //         isClosable: true
                  //       });
                  //     }
                  //   } catch (error) {
                  //     toast({
                  //       title: "Une erreur est survenue",
                  //       status: "error",
                  //       isClosable: true
                  //     });
                  //   } finally {
                  //     setIsLoading(false);
                  //   }
                  // }}
                />
              </Tooltip>
            </GridItem>
          )}

          {/* eventCategory */}
          {event.eventCategory && (
            <GridItem pl={1}>
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
            </GridItem>
          )}

          {/* eventName */}
          <GridItem pl={1}>
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
          </GridItem>

          <GridItem pl={1}>
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
                    ml={2}
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
                  _hover={{ background: "transparent", color: "red" }}
                  onClick={async () => {
                    const confirmed = confirm(
                      "Êtes vous sûr de vouloir annuler la rediffusion ?"
                    );

                    if (confirmed) {
                      if (event.eventOrgs.length <= 1) {
                        await deleteEvent({
                          eventUrl: event.forwardedFrom.eventId
                        }).unwrap();
                      } else {
                        await editEvent({
                          eventUrl: event.forwardedFrom.eventId,
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
        </Grid>
        {/* </Flex> */}
      </GridItem>

      <GridItem
        rowSpan={3}
        light={{ bg: "orange.100" }}
        dark={{ bg: "gray.500" }}
        borderBottomRightRadius={index === length - 1 ? "lg" : undefined}
      >
        <Text pt={2} pl={2}>
          {event.eventCity || "À définir"}
        </Text>
      </GridItem>

      <GridItem pl={3} pb={3} light={{ bg: "white" }} dark={{ bg: "gray.700" }}>
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
            ? event.eventOrgs.map((eventOrg: any) => {
                return (
                  <Link key={eventOrg.orgUrl} href={`/${eventOrg.orgUrl}`}>
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
    </>
  );
};
