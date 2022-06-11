import { AddIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  BoxProps,
  Button,
  Flex,
  Table,
  Tbody,
  Tr,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { compareAsc, getDayOfYear } from "date-fns";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { LatLon } from "use-places-autocomplete";
import { Heading, LocationButton } from "features/common";
import { useEditOrgMutation } from "features/orgs/orgsApi";
import {
  NotifModalState,
  EntityNotifModal
} from "features/modals/EntityNotifModal";
import { EntityModal } from "features/modals/EntityModal";
import { EventForwardFormModal } from "features/modals/EventForwardFormModal";
import { MapModal } from "features/modals/MapModal";
import { useSession } from "hooks/useAuth";
import { getEvents, IEvent } from "models/Event";
import { IOrg, orgTypeFull } from "models/Org";
import { AppQueryWithData } from "utils/types";
import {
  useDeleteEventMutation,
  useEditEventMutation,
  useAddEventNotifMutation
} from "./eventsApi";
import { EventsListCategories } from "./EventsListCategories";
import { EventCategoryTag } from "./EventCategoryTag";
import { EventsListDistanceSelect } from "./EventsListDistance";
import { EventsListItem } from "./EventsListItem";
import { EventsListToggle } from "./EventsListToggle";
import { ESubscriptionType } from "models/Subscription";
import { EventsListHeader } from "./EventsListHeader";

export const EventsList = ({
  events,
  orgQuery,
  isCreator = false,
  isSubscribed,
  isLogin,
  setIsLogin,
  setTitle
}: BoxProps & {
  events: IEvent[];
  orgQuery?: AppQueryWithData<IOrg>;
  isCreator?: boolean;
  isSubscribed?: boolean;
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
  setTitle?: (title?: string) => void;
}) => {
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();
  const toast = useToast({ position: "top" });
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const org = orgQuery?.data;

  //#region event
  const [deleteEvent] = useDeleteEventMutation();
  const [editEvent] = useEditEventMutation();
  const [editOrg] = useEditOrgMutation();
  const addEventNotifMutation = useAddEventNotifMutation();
  //#endregion

  //#region org
  const orgFollowersCount = org?.orgSubscriptions
    .map(
      (subscription) =>
        (subscription.orgs || []).filter((orgSubscription) => {
          return (
            orgSubscription.orgId === org?._id &&
            orgSubscription.type === ESubscriptionType.FOLLOWER
          );
        }).length
    )
    .reduce((a, b) => a + b, 0);
  //#endregion

  //#region local storage sync
  const [city, setCity] = useState<string | null>(null);
  useEffect(() => {
    if (city) localStorage.setItem("city", city);
  }, [city]);
  const [distance, setDistance] = useState<number>(0);

  useEffect(() => {
    if (distance) localStorage.setItem("distance", "" + distance);
  }, [distance]);
  const [origin, setOrigin] = useState<LatLon | undefined>();
  useEffect(() => {
    if (origin) {
      localStorage.setItem("lat", origin.lat.toFixed(6));
      localStorage.setItem("lng", origin.lng.toFixed(6));
    }
  }, [origin]);

  useEffect(() => {
    const storedCity = localStorage.getItem("city");
    const storedDistance = localStorage.getItem("distance");
    const storedLat = localStorage.getItem("lat");
    const storedLng = localStorage.getItem("lng");

    if (storedCity && storedCity !== city) setCity(storedCity);

    if (storedDistance && parseInt(storedDistance) !== distance)
      setDistance(parseInt(storedDistance));

    if (storedLat && storedLng) {
      if (!origin)
        setOrigin({
          lat: parseFloat(storedLat),
          lng: parseFloat(storedLng)
        });
      else if (
        origin.lat !== parseFloat(storedLat) ||
        origin.lng !== parseFloat(storedLng)
      )
        setOrigin({
          lat: parseFloat(storedLat),
          lng: parseFloat(storedLng)
        });
    }
  }, []);
  //#endregion

  //#region local state
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const selectedCategoriesCount = selectedCategories
    ? selectedCategories.length
    : 0;
  const [showLocationButton, setShowLocationButton] = useState(!!city);
  const [showPreviousEvents, setShowPreviousEvents] = useState(false);
  const [showNextEvents, setShowNextEvents] = useState(false);
  useEffect(() => {
    if (setTitle) {
      if (showPreviousEvents) setTitle("Événements précédents");
      else if (showNextEvents) setTitle("Événements suivants");
      else setTitle();
    }
  }, [showPreviousEvents, showNextEvents]);
  //#endregion

  //#region modal state
  const [eventToShow, setEventToShow] = useState<IEvent | null>(null);
  const [eventToShowOnMap, setEventToShowOnMap] = useState<IEvent<
    string | Date
  > | null>(null);
  const [eventToForward, setEventToForward] = useState<IEvent<Date> | null>(
    null
  );
  const [notifyModalState, setNotifyModalState] = useState<
    NotifModalState<IEvent<string | Date>>
  >({});
  useEffect(() => {
    if (notifyModalState.entity) {
      setNotifyModalState({
        entity: events.find(({ _id }) => _id === notifyModalState.entity!._id)
      });
    }
  }, [events]);
  //#endregion

  const eventsListItemProps = {
    deleteEvent,
    editEvent,
    editOrg,
    isCreator,
    isDark,
    org,
    orgQuery,
    orgFollowersCount,
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
    toast
  };

  const eventsList = useMemo(() => {
    let currentDateP: Date | null = null;
    let currentDate: Date | null = null;
    let currentDateN: Date | null = null;
    let { previousEvents, currentEvents, nextEvents } = getEvents({
      events,
      isCreator,
      isSubscribed,
      origin,
      distance,
      selectedCategories
    });

    return (
      <>
        {router.asPath !== "/evenements" && orgQuery && (
          <Flex flexDirection="column" mb={5}>
            <Heading smaller>Catégories</Heading>
            <EventsListCategories
              events={events}
              orgQuery={orgQuery}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              isCreator={isCreator}
              // isLogin={isLogin}
              // setIsLogin={setIsLogin}
            />
          </Flex>
        )}

        <Flex alignItems="center" flexWrap="wrap" mb={5} mt={-3}>
          {!showLocationButton ? (
            <Button
              colorScheme="purple"
              color={isDark ? "black" : "white"}
              isDisabled={!events.length}
              leftIcon={<FaMapMarkerAlt />}
              mr={3}
              mt={3}
              size="sm"
              onClick={() => {
                setShowLocationButton(!showLocationButton);
              }}
            >
              Définir la ville
            </Button>
          ) : (
            <LocationButton
              colorScheme="purple"
              color={isDark ? "black" : "white"}
              mr={3}
              mt={3}
              size="sm"
              city={city}
              setCity={setCity}
              location={origin}
              setLocation={setOrigin}
              inputProps={{
                bg: isDark ? undefined : "white",
                borderColor: isDark ? undefined : "black",
                borderRadius: "lg",
                color: isDark ? undefined : "black",
                mr: 3,
                _placeholder: { color: isDark ? undefined : "black" }
              }}
              //onLocationChange={(coordinates) => setOrigin(coordinates)}
            />
          )}
          <EventsListDistanceSelect
            distance={distance}
            setDistance={setDistance}
            borderColor={isDark ? undefined : "black"}
            borderRadius="md"
            isDisabled={!events.length}
            size="sm"
            mt={3}
          />
        </Flex>

        <EventsListToggle
          previousEvents={previousEvents}
          showPreviousEvents={showPreviousEvents}
          setShowPreviousEvents={setShowPreviousEvents}
          currentEvents={currentEvents}
          nextEvents={nextEvents}
          showNextEvents={showNextEvents}
          setShowNextEvents={setShowNextEvents}
          mb={5}
        />

        {showPreviousEvents && (
          <Table>
            <Tbody>
              {previousEvents
                .sort((a, b) => compareAsc(a.eventMinDate, b.eventMinDate))
                .map((event, index) => {
                  const minDate = event.eventMinDate;
                  const addGridHeader =
                    !currentDateP ||
                    getDayOfYear(currentDateP) < getDayOfYear(minDate);
                  currentDateP = minDate;

                  return (
                    <React.Fragment key={`event-${index}`}>
                      {addGridHeader && (
                        <EventsListHeader
                          borderTopRadius={index === 0 ? "lg" : undefined}
                          bg={isDark ? "gray.800" : "orange.200"}
                          minDate={minDate}
                        />
                      )}

                      <Tr
                        bg={
                          isDark
                            ? index % 2 === 0
                              ? "gray.600"
                              : "gray.500"
                            : index % 2 === 0
                            ? "orange.100"
                            : "orange.50"
                        }
                      >
                        <EventsListItem
                          {...eventsListItemProps}
                          event={event}
                          index={index}
                          length={previousEvents.length}
                        />
                      </Tr>
                    </React.Fragment>
                  );
                })}
            </Tbody>
          </Table>
        )}

        {!showPreviousEvents && !showNextEvents && (
          <>
            {currentEvents.length > 0 ? (
              <>
                <Table>
                  <Tbody>
                    {currentEvents
                      .sort((a, b) =>
                        compareAsc(a.eventMinDate, b.eventMinDate)
                      )
                      .map((event, index) => {
                        const minDate = event.eventMinDate;
                        const addGridHeader =
                          !currentDate ||
                          getDayOfYear(currentDate) < getDayOfYear(minDate);
                        currentDate = minDate;

                        return (
                          <React.Fragment key={`event-${index}`}>
                            {addGridHeader && (
                              <EventsListHeader
                                borderTopRadius={index === 0 ? "lg" : undefined}
                                bg={isDark ? "gray.800" : "orange.200"}
                                minDate={minDate}
                              />
                            )}

                            <Tr
                              bg={
                                isDark
                                  ? index % 2 === 0
                                    ? "gray.600"
                                    : "gray.500"
                                  : index % 2 === 0
                                  ? "orange.100"
                                  : "orange.50"
                              }
                            >
                              <EventsListItem
                                {...eventsListItemProps}
                                event={event}
                                index={index}
                                length={currentEvents.length}
                              />
                            </Tr>
                          </React.Fragment>
                        );
                      })}
                  </Tbody>
                </Table>
              </>
            ) : (
              <Alert status="warning">
                <AlertIcon />
                <Box>
                  Aucun événements{" "}
                  {Array.isArray(selectedCategories) &&
                  selectedCategoriesCount === 1 ? (
                    <>
                      de la catégorie
                      <EventCategoryTag
                        org={org}
                        selectedCategory={selectedCategories[0]}
                        mx={1}
                      />
                    </>
                  ) : selectedCategoriesCount > 1 ? (
                    <>
                      dans les catégories
                      {selectedCategories.map((catNumber, index) => (
                        <EventCategoryTag
                          key={`cat-${index}`}
                          org={org}
                          selectedCategory={catNumber}
                          mx={1}
                        />
                      ))}
                    </>
                  ) : (
                    ""
                  )}
                  prévus
                  {previousEvents.length > 0 || nextEvents.length > 0
                    ? " cette semaine."
                    : "."}
                </Box>
              </Alert>
            )}
          </>
        )}

        {showNextEvents && (
          <Table>
            <Tbody>
              {nextEvents
                .sort((a, b) => compareAsc(a.eventMinDate, b.eventMinDate))
                .map((event, index) => {
                  const minDate = event.eventMinDate;
                  const addGridHeader =
                    !currentDateN ||
                    getDayOfYear(currentDateN) < getDayOfYear(minDate);
                  currentDateN = minDate;

                  return (
                    <React.Fragment key={`event-${index}`}>
                      {addGridHeader && (
                        <EventsListHeader
                          borderTopRadius={index === 0 ? "lg" : undefined}
                          bg={isDark ? "gray.800" : "orange.200"}
                          minDate={minDate}
                        />
                      )}

                      <Tr
                        bg={
                          isDark
                            ? index % 2 === 0
                              ? "gray.600"
                              : "gray.500"
                            : index % 2 === 0
                            ? "orange.100"
                            : "orange.50"
                        }
                      >
                        <EventsListItem
                          {...eventsListItemProps}
                          event={event}
                          index={index}
                          length={nextEvents.length}
                        />
                      </Tr>
                    </React.Fragment>
                  );
                })}
            </Tbody>
          </Table>
        )}

        {((showPreviousEvents && previousEvents.length > 0) ||
          showNextEvents ||
          currentEvents.length > 0) && (
          <EventsListToggle
            previousEvents={previousEvents}
            showPreviousEvents={showPreviousEvents}
            setShowPreviousEvents={setShowPreviousEvents}
            currentEvents={currentEvents}
            nextEvents={nextEvents}
            showNextEvents={showNextEvents}
            setShowNextEvents={setShowNextEvents}
            mt={3}
          />
        )}
      </>
    );
  }, [
    events,
    city,
    distance,
    isDark,
    isLoading,
    origin,
    org,
    selectedCategories,
    session,
    showLocationButton,
    showNextEvents,
    showPreviousEvents
  ]);

  return (
    <>
      {org && (
        <Flex>
          <Button
            colorScheme="teal"
            leftIcon={<AddIcon />}
            mb={5}
            onClick={() => {
              let url = "/evenements/ajouter";

              if (!isSessionLoading) {
                if (session) {
                  if (org) {
                    if (isCreator || isSubscribed) {
                      url = `/evenements/ajouter?orgId=${org._id}`;
                      router.push(url, url, { shallow: true });
                    } else
                      toast({
                        status: "error",
                        title: `Vous devez être adhérent ou créateur ${orgTypeFull(
                          org.orgType
                        )} pour ajouter un événement`
                      });
                  } else {
                    router.push(url, url, { shallow: true });
                  }
                } else setIsLogin(isLogin + 1);
              }
            }}
            data-cy="addEvent"
          >
            Ajouter un événement
          </Button>
        </Flex>
      )}

      {eventsList}

      {session && eventToForward && (
        <EventForwardFormModal
          event={eventToForward}
          session={session}
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

      {eventToShow && (
        <EntityModal event={eventToShow} onClose={() => setEventToShow(null)} />
      )}

      {eventToShowOnMap &&
        eventToShowOnMap.eventLat &&
        eventToShowOnMap.eventLng && (
          <MapModal
            isSearch={false}
            isOpen
            events={[eventToShowOnMap]}
            center={{
              lat: eventToShowOnMap.eventLat,
              lng: eventToShowOnMap.eventLng
            }}
            zoomLevel={16}
            onClose={() => setEventToShowOnMap(null)}
          />
        )}

      {session && orgQuery && (
        <EntityNotifModal
          query={orgQuery}
          mutation={addEventNotifMutation}
          setModalState={setNotifyModalState}
          modalState={notifyModalState}
          session={session}
        />
      )}
    </>
  );
};
