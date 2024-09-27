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
  useColorMode
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { compareAsc, getDayOfYear } from "date-fns";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { LatLon } from "use-places-autocomplete";
import {
  useDeleteEventMutation,
  useEditEventMutation
  //useAddEventNotifMutation
} from "features/api/eventsApi";
import { AppHeading, LocationButton } from "features/common";
import { useEditOrgMutation } from "features/api/orgsApi";
// import {
//   NotifModalState,
//   EntityNotifModal
// } from "features/modals/EntityNotifModal";
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

const EventsListTable = ({
  city,
  setCity,
  distance,
  setDistance,
  events,
  isCreator = false,
  origin,
  setOrigin,
  orgQuery,
  showPreviousEvents,
  setShowPreviousEvents,
  // modal props
  eventToForward,
  setEventToForward,
  eventToShow,
  setEventToShow,
  eventToShowOnMap,
  setEventToShowOnMap,
  // notifyModalState,
  // setNotifyModalState,
  ...props
}: EventsListProps & {
  city: string | null;
  setCity: React.Dispatch<React.SetStateAction<string | null>>;
  distance: number;
  setDistance: React.Dispatch<React.SetStateAction<number>>;
  origin?: LatLon;
  setOrigin: React.Dispatch<React.SetStateAction<LatLon | undefined>>;
  showPreviousEvents: boolean;
  setShowPreviousEvents: React.Dispatch<React.SetStateAction<boolean>>;
  // modal props
  eventToForward: IEvent<Date> | null;
  setEventToForward: React.Dispatch<React.SetStateAction<IEvent<Date> | null>>;
  eventToShow: IEvent | null;
  setEventToShow: React.Dispatch<React.SetStateAction<IEvent<string> | null>>;
  eventToShowOnMap: IEvent<string | Date> | null;
  setEventToShowOnMap: React.Dispatch<
    React.SetStateAction<IEvent<string | Date> | null>
  >;
  // notifyModalState: NotifModalState<IEvent<string | Date>>;
  // setNotifyModalState: React.Dispatch<
  //   React.SetStateAction<NotifModalState<IEvent<string | Date>>>
  // >;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const toast = useToast({ position: "top" });
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  //#region event
  const [deleteEvent] = useDeleteEventMutation();
  const [editEvent] = useEditEventMutation();
  const [editOrg] = useEditOrgMutation();
  //#endregion

  //#region org
  const org = orgQuery?.data;
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

  //#region local state
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const selectedCategoriesCount = selectedCategories
    ? selectedCategories.length
    : 0;
  const [showLocationButton, setShowLocationButton] = useState(!!city);
  //#endregion

  const { previousEvents, currentEvents } = getEvents({
    events,
    isCreator,
    origin,
    distance,
    selectedCategories
  });
  let currentDateP: Date | null = null;
  let currentDate: Date | null = null;
  let currentDateN: Date | null = null;

  const showGeoFilter = false;
  // city ||
  // (showPreviousEvents &&
  //   previousEvents.length > 1 &&
  //   previousEvents.find(
  //     ({ eventLat, eventLng }) => !!eventLat && !!eventLng
  //   )) ||
  // (showNextEvents &&
  //   nextEvents.length > 1 &&
  //   nextEvents.find(({ eventLat, eventLng }) => !!eventLat && !!eventLng)) ||
  // (!showPreviousEvents &&
  //   !showNextEvents &&
  //   currentEvents.length > 1 &&
  //   currentEvents.find(({ eventLat, eventLng }) => !!eventLat && !!eventLng));

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
    isLoading,
    setIsLoading,
    selectedCategories,
    setSelectedCategories,
    city,
    toast,
    eventToForward,
    setEventToForward,
    eventToShow,
    setEventToShow,
    eventToShowOnMap,
    setEventToShowOnMap
    // notifyModalState,
    // setNotifyModalState
  };

  return (
    <>
      {router.asPath !== "/agenda" &&
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

      {showGeoFilter && currentEvents.length > 0 && (
        <Flex alignItems="center" flexWrap="wrap" mb={3} mt={-3}>
          {!!city && !showLocationButton && (
            <Box mr={3} mt={3}>
              <EventsListDistanceSelect
                city={city}
                distance={distance}
                setDistance={setDistance}
                borderColor={isDark ? undefined : "black"}
                borderRadius="md"
                //isDisabled={city === null}
                size="sm"
              />
            </Box>
          )}

          <Box mt={3}>
            {!showLocationButton ? (
              <Tooltip label={city ? "Changer de localité" : city}>
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
                  {city || "Afficher les événements autour de..."}
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
          </Box>
        </Flex>
      )}

      {previousEvents.length > 0 && (
        <EventsListToggle
          previousEvents={previousEvents}
          showPreviousEvents={showPreviousEvents}
          setShowPreviousEvents={setShowPreviousEvents}
          currentEvents={currentEvents}
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

      {!showPreviousEvents && (
        <>
          {currentEvents.length > 0 ? (
            <>
              <Table>
                <Tbody>
                  {currentEvents
                    .sort((a, b) => compareAsc(a.eventMinDate, b.eventMinDate))
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
                Aucun événements
                {selectedCategoriesCount === 1 ? (
                  <>
                    {" "}
                    de la catégorie
                    <EventCategoryTag
                      org={org}
                      selectedCategory={selectedCategories[0]}
                      mx={1}
                    />
                  </>
                ) : selectedCategoriesCount > 1 ? (
                  <>
                    {" "}
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
                  " à venir."
                )}
              </Box>
            </Alert>
          )}
        </>
      )}

      {/* {((showPreviousEvents && previousEvents.length > 0) ||
        currentEvents.length > 0) && (
        <EventsListToggle
          previousEvents={previousEvents}
          showPreviousEvents={showPreviousEvents}
          setShowPreviousEvents={setShowPreviousEvents}
          currentEvents={currentEvents}
          mt={3}
        />
      )} */}
    </>
  );
};

interface EventsListProps {
  events: IEvent[];
  orgQuery?: AppQueryWithData<IOrg>;
  isCreator?: boolean;
  setTitle?: (title?: string) => void;
}

export const EventsList = ({
  events,
  orgQuery,
  isCreator = false,
  setTitle,
  ...props
}: BoxProps & EventsListProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const toast = useToast({ position: "top" });
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const org = orgQuery?.data;
  //const addEventNotifMutation = useAddEventNotifMutation();

  //#region local state
  const [showPreviousEvents, setShowPreviousEvents] = useState(false);
  useEffect(() => {
    if (setTitle) {
      if (showPreviousEvents) setTitle("Événements précédents");
      else setTitle();
    }
  }, [showPreviousEvents]);
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

  //#region modal state
  const [eventToShow, setEventToShow] = useState<IEvent | null>(null);
  const [eventToShowOnMap, setEventToShowOnMap] = useState<IEvent<
    string | Date
  > | null>(null);
  const [eventToForward, setEventToForward] = useState<IEvent<Date> | null>(
    null
  );
  // const [notifyModalState, setNotifyModalState] = useState<
  //   NotifModalState<IEvent<string | Date>>
  // >({});
  // useEffect(() => {
  //   if (notifyModalState.entity) {
  //     setNotifyModalState({
  //       entity: events.find(({ _id }) => _id === notifyModalState.entity!._id)
  //     });
  //   }
  // }, [events]);
  //#endregion

  return (
    <>
      {org && (
        <Flex>
          {isCreator && (
            <Button
              colorScheme="teal"
              leftIcon={<AddIcon />}
              mb={5}
              onClick={() => {
                try {
                  let url = "/agenda/ajouter";

                  if (org && !isCreator)
                    throw new Error(
                      `Vous n'avez pas la permission ${orgTypeFull(
                        org.orgType
                      )} pour ajouter un événement`
                    );

                  url = `/agenda/ajouter?orgId=${org._id}`;
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
          )}
        </Flex>
      )}

      <EventsListTable
        city={city}
        setCity={setCity}
        distance={distance}
        setDistance={setDistance}
        events={events}
        isCreator={isCreator}
        origin={origin}
        setOrigin={setOrigin}
        orgQuery={orgQuery}
        showPreviousEvents={showPreviousEvents}
        setShowPreviousEvents={setShowPreviousEvents}
        // modal props
        eventToForward={eventToForward}
        setEventToForward={setEventToForward}
        eventToShow={eventToShow}
        setEventToShow={setEventToShow}
        eventToShowOnMap={eventToShowOnMap}
        setEventToShowOnMap={setEventToShowOnMap}
        // notifyModalState={notifyModalState}
        // setNotifyModalState={setNotifyModalState}
        {...props}
      />

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

      {/* {session && orgQuery && (
        <EntityNotifModal
          query={orgQuery}
          mutation={addEventNotifMutation}
          setModalState={setNotifyModalState}
          modalState={notifyModalState}
          session={session}
        />
      )} */}
    </>
  );
};
