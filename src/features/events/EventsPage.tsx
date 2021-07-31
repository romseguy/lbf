import React, { useEffect, useState } from "react";
import { Box, Spinner, useColorModeValue } from "@chakra-ui/react";
import { Layout } from "features/layout";
import { EventModal } from "features/modals/EventModal";
import { useRouter } from "next/router";
import { Button } from "features/common";
import type { IEvent } from "models/Event";
import { AddIcon } from "@chakra-ui/icons";
import { useSession } from "hooks/useAuth";
import { useGetEventsQuery } from "./eventsApi";
import { EventsList } from "./EventsList";

export const Events = (props: { events?: IEvent[] }) => {
  const router = useRouter();
  const query = useGetEventsQuery();
  useEffect(() => {
    console.log("refetching events");
    query.refetch();
  }, [router.asPath]);
  const events = query.data || props.events;

  const { data: session, loading: isSessionLoading } = useSession();

  const [isLogin, setIsLogin] = useState(0);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const eventBg = useColorModeValue("blue.100", "blue.800");

  return (
    <Layout pageTitle="Votre Agenda Local" isLogin={isLogin}>
      <Box>
        <Button
          leftIcon={<AddIcon />}
          onClick={() => {
            if (!isSessionLoading) {
              if (session) {
                setIsEventModalOpen(true);
              } else {
                setIsLogin(isLogin + 1);
              }
            }
          }}
          mb={5}
          dark={{ bg: "gray.700", _hover: { bg: "gray.600" } }}
          data-cy="addEvent"
        >
          Ajouter un événement
        </Button>

        {isEventModalOpen && (
          <EventModal
            onCancel={() => setIsEventModalOpen(false)}
            onSubmit={async (eventName) => {
              await router.push(`/${encodeURIComponent(eventName)}`);
            }}
            onClose={() => setIsEventModalOpen(false)}
          />
        )}
      </Box>

      {Array.isArray(events) && events.length > 0 ? (
        <EventsList events={events} eventBg={eventBg} />
      ) : null}
    </Layout>
  );
};
