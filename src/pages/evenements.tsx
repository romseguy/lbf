import {
  Flex,
  Box,
  Heading,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaRegMap } from "react-icons/fa";
import { Button, IconFooter } from "features/common";
import { useGetEventsQuery } from "features/events/eventsApi";
import { EventsList } from "features/events/EventsList";
import { Layout } from "features/layout";
import { MapModal } from "features/modals/MapModal";
import { EEventVisibility } from "models/Event";
import { PageProps } from "./_app";

const EventsPage = ({ ...props }: PageProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  useEffect(() => {
    window.addEventListener("offline", () => setIsOffline(true));
    window.addEventListener("online", () => setIsOffline(false));
  }, []);

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

  useEffect(() => {
    console.log("refetching events with new route", router.asPath);
    eventsQuery.refetch();
  }, [router.asPath]);

  return (
    <Layout {...props} isLogin={isLogin} pageTitle="Événements">
      <Flex
        alignItems="center"
        flexWrap="wrap"
        background={isDark ? "black" : "lightcyan"}
        borderWidth={1}
        borderColor={isDark ? "gray.600" : "gray.200"}
        borderRadius="lg"
        m="0 auto"
        maxWidth="4xl"
        p={3}
        pt={0}
      >
        <Box flexGrow={1} mt={eventsQuery.isLoading ? 3 : undefined}>
          <Heading className="rainbow-text" fontFamily="DancingScript">
            {title}
          </Heading>
        </Box>

        {!eventsQuery.isLoading && (
          <Box mt={3}>
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
          </Box>
        )}

        <Box width="100%">
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
          <IconFooter />
        </Box>
      </Flex>

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
