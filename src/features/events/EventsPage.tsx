import { Box, Flex, Heading, Text, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaRegMap } from "react-icons/fa";
import { Button, IconFooter, Link } from "features/common";
import { MapModal } from "features/modals/MapModal";
import { Visibility } from "models/Event";
import { useGetEventsQuery } from "./eventsApi";
import { EventsList } from "./EventsList";

export const EventsPage = ({
  isLogin,
  setIsLogin
}: {
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
}) => {
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

  const [title = "Événements des 7 prochains jours", setTitle] = useState<
    string | undefined
  >();

  return (
    <>
      <Flex flexWrap="wrap" margin="0 auto" maxWidth="4xl">
        <Box flexGrow={1}>
          <Heading className="rainbow-text" fontFamily="DancingScript">
            {title}
          </Heading>
        </Box>

        {!eventsQuery.isLoading && (
          <Box mt={3}>
            <Button
              colorScheme="teal"
              isDisabled={!events || !events.length}
              leftIcon={<FaRegMap />}
              onClick={openMapModal}
              mb={3}
            >
              Carte des événements
            </Button>
          </Box>
        )}

        <Box width="100%">
          {eventsQuery.isLoading || eventsQuery.isFetching ? (
            <Text>Chargement des événements publics...</Text>
          ) : (
            events && (
              <EventsList
                events={events}
                eventsQuery={eventsQuery}
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
