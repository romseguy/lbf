import { Text, Tooltip, useColorMode, useDisclosure } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaRegMap } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Column, ColumnProps } from "features/common";
import { useGetEventsQuery } from "features/api/eventsApi";
import { EventsList } from "features/events/EventsList";
import { Layout } from "features/layout";
import { MapModal } from "features/modals/MapModal";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { EEventVisibility } from "models/Event";
import { EOrgVisibility } from "models/Org";
import { selectIsOffline } from "store/sessionSlice";

const EventsPage = ({ ...props }: PageProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const columnProps: ColumnProps = {
    bg: isDark ? "gray.700" : "lightblue"
  };
  const isOffline = useSelector(selectIsOffline);

  const eventsQuery = useGetEventsQuery();

  const events = eventsQuery.data?.filter((event) => {
    if (event.forwardedFrom && event.forwardedFrom.eventId) return false;
    if (event.eventVisibility !== EEventVisibility.PUBLIC) return false;
    if (
      event.eventOrgs.find(({ orgVisibility, createdBy }) => {
        return (
          orgVisibility === EOrgVisibility.PRIVATE &&
          createdBy !== session?.user.userId
        );
      })
    )
      return false;
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
    <Layout {...props} pageTitle={title}>
      <Tooltip
        label={
          !eventsQuery.data || !eventsQuery.data.length
            ? "Aucun événements"
            : isOffline
            ? "Vous devez être connecté à internet pour Afficher la carte des événements"
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

      <Column {...columnProps}>
        {eventsQuery.isLoading ? (
          <Text>Chargement des événements publics...</Text>
        ) : (
          events && <EventsList events={events} setTitle={setTitle} />
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
