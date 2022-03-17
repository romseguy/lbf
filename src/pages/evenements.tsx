import { Text, Tooltip, useColorMode, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaRegMap } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Column } from "features/common";
import { useGetEventsQuery } from "features/events/eventsApi";
import { EventsList } from "features/events/EventsList";
import { Layout } from "features/layout";
import { MapModal } from "features/modals/MapModal";
import { selectIsOffline } from "features/session/sessionSlice";
import { EEventVisibility } from "models/Event";
import { PageProps } from "./_app";

const EventsPage = ({ ...props }: PageProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(0);
  const isOffline = useSelector(selectIsOffline);

  const eventsQuery = useGetEventsQuery();

  const events = eventsQuery.data?.filter((event) => {
    if (event.forwardedFrom && event.forwardedFrom.eventId) return false;
    if (event.eventVisibility !== EEventVisibility.PUBLIC) return false;
    return event.isApproved;
  });

  const {
    isOpen: isMapModalOpen,
    onOpen: openMapModal,
    onClose: closeMapModal
  } = useDisclosure({ defaultIsOpen: false });

  const [title = "Événements des 7 prochains jours", setTitle] = useState<
    string | undefined
  >();

  return (
    <Layout {...props} isLogin={isLogin} pageTitle={title}>
      <Tooltip
        label={
          !eventsQuery.data || !eventsQuery.data.length
            ? "Aucun événements"
            : isOffline
            ? "Vous devez être connecté à internet pour afficher la carte des événements"
            : ""
        }
        hasArrow
        placement="left"
      >
        <span>
          <Button
            colorScheme="teal"
            isDisabled={isOffline || !events || !events.length}
            leftIcon={<FaRegMap />}
            onClick={openMapModal}
            mb={3}
          >
            Carte des événements
          </Button>
        </span>
      </Tooltip>

      <Column bg={isDark ? "black" : "lightcyan"}>
        {eventsQuery.isLoading ? (
          <Text>Chargement des événements publics...</Text>
        ) : (
          events && (
            <EventsList
              events={events}
              isLogin={isLogin}
              setIsLogin={setIsLogin}
              setTitle={setTitle}
            />
          )
        )}
      </Column>

      {isMapModalOpen && (
        <MapModal
          isOpen={isMapModalOpen}
          events={
            events?.filter((event) => {
              return (
                typeof event.eventLat === "number" &&
                typeof event.eventLng === "number" &&
                event.eventVisibility === EEventVisibility.PUBLIC
              );
            }) || []
          }
          onClose={closeMapModal}
        />
      )}
    </Layout>
  );
};

export default EventsPage;
