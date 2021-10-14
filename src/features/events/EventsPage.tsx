import { Text, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FaRegMap } from "react-icons/fa";
import { Button, IconFooter, Link } from "features/common";
import { MapModal } from "features/modals/MapModal";
import { Visibility } from "models/Event";
import { useGetEventsQuery } from "./eventsApi";
import { EventsList } from "./EventsList";

export const EventsPage = ({}: {}) => {
  const router = useRouter();

  const eventsQuery = useGetEventsQuery();
  useEffect(() => {
    console.log("refetching events");
    eventsQuery.refetch();
  }, [router.asPath]);

  const events = eventsQuery.data?.filter((event) => {
    if (event.forwardedFrom && event.forwardedFrom.eventId) return false;
    if (event.eventVisibility !== Visibility.PUBLIC) return false;
    return event.isApproved;
  });

  const {
    isOpen: isMapModalOpen,
    onOpen: openMapModal,
    onClose: closeMapModal
  } = useDisclosure({ defaultIsOpen: false });

  return (
    <>
      <Button
        colorScheme="teal"
        isLoading={eventsQuery.isLoading}
        isDisabled={!events || !events.length}
        leftIcon={<FaRegMap />}
        onClick={openMapModal}
        mb={5}
      >
        Carte des événements
      </Button>

      {eventsQuery.isLoading || eventsQuery.isFetching ? (
        <Text>Chargement des événements publics...</Text>
      ) : (
        events && (
          <div>
            <EventsList events={events} eventsQuery={eventsQuery} />
            <IconFooter />
          </div>
        )
      )}

      {isMapModalOpen && (
        <MapModal
          isOpen={isMapModalOpen}
          events={
            events?.filter((event) => {
              return (
                typeof event.eventLat === "number" &&
                typeof event.eventLng === "number" &&
                event.eventVisibility === Visibility.PUBLIC
              );
            }) || []
          }
          onClose={closeMapModal}
        />
      )}
    </>
  );
};
