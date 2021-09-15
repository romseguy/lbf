import { Visibility } from "models/Event";
import React, { useEffect, useState } from "react";
import {
  Flex,
  Icon,
  IconButton,
  Text,
  Tooltip,
  useDisclosure
} from "@chakra-ui/react";
import { EventModal } from "features/modals/EventModal";
import { useRouter } from "next/router";
import { Button, IconFooter, Link } from "features/common";
import { AddIcon } from "@chakra-ui/icons";
import { useSession } from "hooks/useAuth";
import { useGetEventsQuery } from "./eventsApi";
import { EventsList } from "./EventsList";
import { MapModal } from "features/modals/MapModal";
import { FaMapMarkerAlt } from "react-icons/fa";

export const EventsPage = ({
  isLogin,
  setIsLogin
}: {
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
}) => {
  const router = useRouter();
  const eventsQuery = useGetEventsQuery("eventOrgs");
  useEffect(() => {
    console.log("refetching events");
    eventsQuery.refetch();
  }, [router.asPath]);
  const events = eventsQuery.data?.filter((event) => {
    if (event.forwardedFrom && event.forwardedFrom.eventId) return false;
    if (event.eventVisibility !== Visibility.PUBLIC) return false;
    return true;
  });

  const { data: session, loading: isSessionLoading } = useSession();

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const {
    isOpen: isMapModalOpen,
    onOpen: openMapModal,
    onClose: closeMapModal
  } = useDisclosure({ defaultIsOpen: false });

  const addEvent = () => {
    if (!isSessionLoading) {
      if (session) {
        setIsEventModalOpen(true);
      } else {
        setIsLogin(isLogin + 1);
      }
    }
  };

  return (
    <>
      <>
        <Flex justifyContent="space-between">
          <Button
            colorScheme="teal"
            leftIcon={<AddIcon />}
            mb={5}
            onClick={addEvent}
            data-cy="addEvent"
          >
            Ajouter un événement
          </Button>

          <Tooltip label="Carte des événements">
            <IconButton
              aria-label="Carte des événements"
              colorScheme="teal"
              isLoading={eventsQuery.isLoading}
              isDisabled={!events || !events.length}
              icon={<FaMapMarkerAlt />}
              onClick={openMapModal}
            />
          </Tooltip>
        </Flex>

        {isEventModalOpen && session && (
          <EventModal
            session={session}
            onCancel={() => setIsEventModalOpen(false)}
            onSubmit={async (eventUrl) => {
              await router.push(`/${eventUrl}`, `/${eventUrl}`, {
                shallow: true
              });
            }}
            onClose={() => setIsEventModalOpen(false)}
          />
        )}

        {isMapModalOpen && (
          <MapModal
            isOpen={isMapModalOpen}
            items={
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

      {eventsQuery.isLoading ? (
        <Text>Chargement des événements publics...</Text>
      ) : Array.isArray(events) && events.length > 0 ? (
        <div>
          <EventsList events={events} />
          <IconFooter />
        </div>
      ) : (
        <>
          Aucun événement public prévu,{" "}
          <Link variant="underline" onClick={addEvent}>
            cliquez ici
          </Link>{" "}
          pour en ajouter un.
        </>
      )}
    </>
  );
};
