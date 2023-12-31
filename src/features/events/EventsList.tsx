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
  Tooltip,
  Tr,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { compareAsc, getDayOfYear } from "date-fns";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { LatLon } from "use-places-autocomplete";
import {
  useDeleteEventMutation,
  useEditEventMutation,
  useAddEventNotifMutation
} from "features/api/eventsApi";
import { AppHeading, LocationButton } from "features/common";
import { useEditOrgMutation } from "features/api/orgsApi";
import {
  NotifModalState,
  EntityNotifModal
} from "features/modals/EntityNotifModal";
import { EntityModal } from "features/modals/EntityModal";
import { EventForwardFormModal } from "features/modals/EventForwardFormModal";
import { MapModal } from "features/modals/MapModal";
import { useSession } from "hooks/useSession";
import { getEvents, IEvent } from "models/Event";
import { IOrg, orgTypeFull } from "models/Org";
import { EOrgSubscriptionType } from "models/Subscription";
import { AppQueryWithData } from "utils/types";
import { hasItems } from "utils/array";
import { EventsListCategories } from "./EventsListCategories";
import { EventCategoryTag } from "./EventCategoryTag";
import { EventsListDistanceSelect } from "./EventsListDistance";
import { EventsListItem } from "./EventsListItem";
import { EventsListToggle } from "./EventsListToggle";
import { EventsListHeader } from "./EventsListHeader";

export const EventsList = ({
  events,
  orgQuery,
  isCreator = false,
  setTitle
}: BoxProps & {
  events: IEvent[];
  orgQuery?: AppQueryWithData<IOrg>;
  isCreator?: boolean;
  setTitle?: (title?: string) => void;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
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
            orgSubscription.type === EOrgSubscriptionType.FOLLOWER
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

  const { previousEvents, currentEvents, nextEvents } = useMemo(() => {
    return getEvents({
      events,
      isCreator,
      origin,
      distance,
      selectedCategories
    });
  }, [events, isCreator, origin, distance, selectedCategories]);

  const eventsList = useMemo(() => {
    let currentDateP: Date | null = null;
    let currentDate: Date | null = null;
    let currentDateN: Date | null = null;

    const showGeoFilter =
      city ||
      (showPreviousEvents &&
        previousEvents.length > 1 &&
        previousEvents.find(
          ({ eventLat, eventLng }) => !!eventLat && !!eventLng
        )) ||
      (showNextEvents &&
        nextEvents.length > 1 &&
        nextEvents.find(
          ({ eventLat, eventLng }) => !!eventLat && !!eventLng
        )) ||
      (!showPreviousEvents &&
        !showNextEvents &&
        currentEvents.length > 1 &&
        currentEvents.find(
          ({ eventLat, eventLng }) => !!eventLat && !!eventLng
        ));

    return (
      <>
        {router.asPath !== "/evenements" &&
          orgQuery &&
          hasItems(orgQuery.data.orgEventCategories) && (
            <Flex flexDirection="column" mb={5}>
              <AppHeading smaller>Catégories</AppHeading>
              <EventsListCategories
                events={events}
                orgQuery={orgQuery}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                isCreator={isCreator}
              />
            </Flex>
          )}

        {currentEvents.length > 0 && (
          <Flex alignItems="center" flexWrap="wrap" mb={3}>
            {showGeoFilter && (
              <>
                <EventsListDistanceSelect
                  distance={distance}
                  setDistance={setDistance}
                  borderColor={isDark ? undefined : "black"}
                  borderRadius="md"
                  isDisabled={!city}
                  size="sm"
                  mr={3}
                />

                {!showLocationButton ? (
                  <Tooltip label={city ? "Changer la ville" : city}>
                    <Button
                      colorScheme="purple"
                      color={isDark ? "black" : "white"}
                      isDisabled={!events.length}
                      leftIcon={<FaMapMarkerAlt />}
                      size="sm"
                      onClick={() => {
                        setShowLocationButton(!showLocationButton);
                      }}
                    >
                      {city || "Définir la ville"}
                    </Button>
                  </Tooltip>
                ) : (
                  <LocationButton
                    city={city}
                    setCity={setCity}
                    location={origin}
                    setLocation={setOrigin}
                    //--
                    colorScheme="purple"
                    color={isDark ? "black" : "white"}
                    isRound
                    size="sm"
                    mr={3}
                    inputProps={{
                      bg: isDark ? undefined : "white",
                      borderColor: isDark ? undefined : "black",
                      borderRadius: "lg",
                      color: isDark ? undefined : "black",
                      _placeholder: { color: isDark ? undefined : "black" }
                    }}
                    onClick={() => setShowLocationButton(false)}
                    //onLocationChange={(coordinates) => setOrigin(coordinates)}
                    onSuggestionSelect={() => {
                      setShowLocationButton(false);
                    }}
                  />
                )}
              </>
            )}
          </Flex>
        )}

        {(previousEvents.length > 0 || nextEvents.length > 0) && (
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
        )}

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
              try {
                let url = "/evenements/ajouter";

                if (org && !isCreator)
                  throw new Error(
                    `Vous n'avez pas la permission ${orgTypeFull(
                      org.orgType
                    )} pour ajouter un événement`
                  );

                url = `/evenements/ajouter?orgId=${org._id}`;
                router.push(url, url, { shallow: true });
              } catch (error: any) {
                toast({
                  status: "error",
                  title: error.message
                });
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
