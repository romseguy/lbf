import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Spinner,
  useColorModeValue
} from "@chakra-ui/react";
import { Layout } from "features/layout";
import { EventModal } from "features/modals/EventModal";
import { useRouter } from "next/router";
import { Button, IconFooter } from "features/common";
import type { IEvent } from "models/Event";
import { AddIcon } from "@chakra-ui/icons";
import { useSession } from "hooks/useAuth";
import { useGetEventsQuery } from "./eventsApi";
import { EventsList } from "./EventsList";
import { MapModal } from "features/modals/MapModal";
import { FaMap, FaMapMarker } from "react-icons/fa";
import { IoIosMap, IoIosPlanet, IoMdMap, IoMdPlanet } from "react-icons/io";

export const EventsPage = ({
  isLogin,
  setIsLogin,
  ...props
}: {
  events?: IEvent[];
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
}) => {
  const router = useRouter();
  const query = useGetEventsQuery();
  useEffect(() => {
    console.log("refetching events");
    query.refetch();
  }, [router.asPath]);
  const events = query.data || props.events;

  const { data: session, loading: isSessionLoading } = useSession();

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  return (
    <>
      <>
        <Flex justifyContent="space-between">
          <Button
            colorScheme="teal"
            leftIcon={<AddIcon />}
            mb={5}
            onClick={() => {
              if (!isSessionLoading) {
                if (session) {
                  setIsEventModalOpen(true);
                } else {
                  setIsLogin(isLogin + 1);
                }
              }
            }}
            data-cy="addEvent"
          >
            Ajouter un événement
          </Button>

          <Button
            leftIcon={<FaMapMarker />}
            onClick={() => setIsMapModalOpen(true)}
          >
            Carte des événements
          </Button>
        </Flex>

        {isEventModalOpen && (
          <EventModal
            onCancel={() => setIsEventModalOpen(false)}
            onSubmit={async (eventName) => {
              await router.push(`/${encodeURIComponent(eventName)}`);
            }}
            onClose={() => setIsEventModalOpen(false)}
          />
        )}

        {isMapModalOpen && (
          <MapModal onClose={() => setIsMapModalOpen(false)} />
        )}
      </>

      {Array.isArray(events) && events.length > 0 ? (
        <div>
          <EventsList events={events} />
          <IconFooter />
        </div>
      ) : null}
    </>
  );
};
