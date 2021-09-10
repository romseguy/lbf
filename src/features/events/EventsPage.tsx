import { IEvent, Visibility, VisibilityV } from "models/Event";
import React, { useEffect, useState } from "react";
import { Flex, IconButton, Spinner, useDisclosure } from "@chakra-ui/react";
import { EventModal } from "features/modals/EventModal";
import { useRouter } from "next/router";
import { Button, IconFooter, Link } from "features/common";
import { AddIcon } from "@chakra-ui/icons";
import { useSession } from "hooks/useAuth";
import { useGetEventsQuery } from "./eventsApi";
import { EventsList } from "./EventsList";
import { MapModal } from "features/modals/MapModal";
import { FaMapMarkerAlt } from "react-icons/fa";
import { isMobile } from "react-device-detect";
import { isServer } from "utils/isServer";

export const EventsPage = ({
  isLogin,
  setIsLogin
}: {
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
}) => {
  const router = useRouter();
  const query = useGetEventsQuery("eventOrgs");
  useEffect(() => {
    console.log("refetching events");
    query.refetch();
  }, [router.asPath]);
  const events = query.data?.filter((event) => {
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

          {isMobile ? (
            <IconButton
              colorScheme="teal"
              isDisabled={!events || !events.length}
              aria-label="Carte des événements"
              icon={<FaMapMarkerAlt />}
              onClick={openMapModal}
            />
          ) : (
            <>
              {isServer() ? (
                <Spinner />
              ) : (
                <Button
                  colorScheme="teal"
                  isDisabled={!events || !events.length}
                  leftIcon={<FaMapMarkerAlt />}
                  onClick={openMapModal}
                >
                  Carte des événements
                </Button>
              )}
            </>
          )}
        </Flex>

        {isEventModalOpen && session && (
          <EventModal
            session={session}
            onCancel={() => setIsEventModalOpen(false)}
            onSubmit={async (eventUrl) => {
              await router.push(`/${eventUrl}`);
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

      {query.isLoading ? (
        <Spinner />
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
