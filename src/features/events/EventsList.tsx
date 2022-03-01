import { AddIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  BoxProps,
  Heading,
  Table,
  Tbody,
  Tr,
  Td,
  Text,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { compareAsc, format, getDayOfYear } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { LatLon } from "use-places-autocomplete";
import { GridHeader, GridItem, Spacer, LocationButton } from "features/common";
import { useEditOrgMutation } from "features/orgs/orgsApi";
import { refetchOrg } from "features/orgs/orgSlice";
import {
  NotifModalState,
  EntityNotifModal
} from "features/modals/EntityNotifModal";
import { EntityModal } from "features/modals/EntityModal";
import { EventFormModal } from "features/modals/EventFormModal";
import { EventForwardFormModal } from "features/modals/EventForwardFormModal";
import { MapModal } from "features/modals/MapModal";
import { useSession } from "hooks/useAuth";
import { getEvents, IEvent } from "models/Event";
import { IOrg, orgTypeFull } from "models/Org";
import { useAppDispatch } from "store";
import { AppQuery } from "utils/types";
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

export const EventsList = ({
  events,
  org,
  orgQuery,
  isCreator,
  isSubscribed,
  isLogin,
  setIsLogin,
  setTitle
}: BoxProps & {
  events: IEvent[];
  org?: IOrg;
  orgQuery?: AppQuery<IOrg>;
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
  const dispatch = useAppDispatch();

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
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

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
  const [isEventFormModalOpen, setIsEventFormModalOpen] = useState(false);
  const [eventToShow, setEventToShow] = useState<IEvent | null>(null);
  const [eventToShowOnMap, setEventToShowOnMap] = useState<IEvent<
    string | Date
  > | null>(null);
  const [eventToForward, setEventToForward] = useState<IEvent | null>(null);
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
        <Flex flexDirection="column" mb={5}>
          <Flex>
            <Text className="rainbow-text">Catégories</Text>
          </Flex>
          <EventsListCategories
            events={events}
            org={org}
            orgQuery={orgQuery}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            session={session}
            isLogin={isLogin}
            setIsLogin={setIsLogin}
          />
        </Flex>

        <Flex alignItems="center" mb={5}>
          {!showLocationButton ? (
            <Button
              colorScheme="purple"
              color={isDark ? "black" : "white"}
              isDisabled={!events.length}
              leftIcon={<FaMapMarkerAlt />}
              mr={3}
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

                  return [
                    <Tr key={`eventsList-header-${index}`}>
                      <Td border={0} colSpan={3} p={0}>
                        {addGridHeader ? (
                          <GridHeader
                            borderTopRadius={index === 0 ? "lg" : undefined}
                          >
                            <Heading size="sm" py={3}>
                              {format(minDate, "cccc d MMMM", {
                                locale: fr
                              })}
                            </Heading>
                          </GridHeader>
                        ) : (
                          <GridItem></GridItem>
                        )}
                      </Td>
                    </Tr>,

                    <Tr
                      key={`eventsList-item-${index}`}
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
                  ];
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

                        return [
                          <Tr key={`eventsList-header-${index}`}>
                            <Td border={0} colSpan={3} p={0}>
                              {addGridHeader ? (
                                <GridHeader
                                  borderTopRadius={
                                    index === 0 ? "lg" : undefined
                                  }
                                >
                                  <Heading size="sm" py={3}>
                                    {format(minDate, "cccc d MMMM", {
                                      locale: fr
                                    })}
                                  </Heading>
                                </GridHeader>
                              ) : (
                                <GridItem></GridItem>
                              )}
                            </Td>
                          </Tr>,

                          <Tr
                            key={`eventsList-item-${index}`}
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
                        ];
                      })}
                  </Tbody>
                </Table>
              </>
            ) : (
              <Alert status="warning">
                <AlertIcon />
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
                )}{" "}
                prévu
                {previousEvents.length > 0 || nextEvents.length > 0
                  ? " cette semaine."
                  : "."}
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

                  return [
                    <Tr key={`eventsList-header-${index}`}>
                      <Td colSpan={3} p={0}>
                        {addGridHeader ? (
                          <GridHeader
                            colSpan={3}
                            borderTopRadius={index === 0 ? "lg" : undefined}
                          >
                            <Heading size="sm" py={3}>
                              {format(minDate, "cccc d MMMM", {
                                locale: fr
                              })}
                            </Heading>
                          </GridHeader>
                        ) : (
                          <GridItem>
                            <Spacer borderWidth={1} />
                          </GridItem>
                        )}
                      </Td>
                    </Tr>,

                    <Tr
                      key={`eventsList-item-${index}`}
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
                  ];
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
        <>
          <Button
            colorScheme="teal"
            leftIcon={<AddIcon />}
            mb={5}
            onClick={() => {
              if (!isSessionLoading) {
                if (session) {
                  if (org) {
                    if (isCreator || isSubscribed)
                      setIsEventFormModalOpen(true);
                    else
                      toast({
                        status: "error",
                        title: `Vous devez être adhérent ${orgTypeFull(
                          org.orgType
                        )} pour ajouter un événement`
                      });
                  } else setIsEventFormModalOpen(true);
                } else if (setIsLogin) setIsLogin(isLogin + 1);
              }
            }}
            data-cy="addEvent"
          >
            Ajouter un événement
          </Button>

          {session && isEventFormModalOpen && (
            <EventFormModal
              initialEventOrgs={[org]}
              session={session}
              onCancel={() => setIsEventFormModalOpen(false)}
              onClose={() => setIsEventFormModalOpen(false)}
              onSubmit={async (eventUrl) => {
                if (org) {
                  dispatch(refetchOrg());
                }
                await router.push(`/${eventUrl}`, `/${eventUrl}`, {
                  shallow: true
                });
              }}
            />
          )}
        </>
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
          org={org}
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
