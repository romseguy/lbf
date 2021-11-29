import { CalendarIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Alert,
  AlertIcon,
  Spinner,
  Flex,
  Icon
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { FaRegMap } from "react-icons/fa";
import { IoIosPerson } from "react-icons/io";
import { LatLon } from "use-places-autocomplete";
import { withGoogleApi } from "features/map/GoogleApiWrapper";
import { Map, SizeMap } from "features/map/Map";
import { MapSearch } from "features/map/MapSearch";
import { IEvent } from "models/Event";
import { IOrg, OrgTypes } from "models/Org";
import { hasItems } from "utils/array";
import { Link } from "features/common";

export const MapModal = withGoogleApi({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
})(
  ({
    header,
    events,
    orgs,
    zoomLevel,
    ...props
  }: {
    google: typeof google;
    loaded: boolean;
    isOpen: boolean;
    header?: React.ReactNode | React.ReactNodeArray;
    events?: IEvent[];
    orgs?: IOrg[];
    center?: LatLon;
    zoomLevel?: number;
    onClose: () => void;
  }) => {
    const isOffline = props.loaded && !props.google;

    const [center, setCenter] = useState<LatLon | undefined>(props.center);

    const divRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<SizeMap>({
      defaultSize: { enabled: true },
      fullSize: { enabled: false }
    });

    let title;
    let icon = <Icon as={FaRegMap} mr={3} />;
    if (events)
      if (events.length === 1) {
        title = (
          <Link
            href={`/${events[0].eventUrl}`}
            size="larger"
            className="rainbow-text"
          >
            {events[0].eventName}
          </Link>
        );
        icon = <CalendarIcon mr={3} />;
      } else title = "Carte des événements";
    else if (orgs)
      if (orgs.length === 1) {
        title = (
          <Link
            href={`/${orgs[0].orgUrl}`}
            size="larger"
            className="rainbow-text"
          >
            {orgs[0].orgName}
          </Link>
        );
        icon = <Icon as={IoIosPerson} mr={3} />;
      } else if (orgs.find(({ orgType }) => orgType === OrgTypes.NETWORK))
        title = "Carte des réseaux";
      else title = "Carte des organisations";

    return (
      <Modal
        isOpen={props.isOpen}
        onClose={() => {
          props.onClose && props.onClose();
        }}
        size={size.fullSize.enabled ? "full" : undefined}
        closeOnOverlayClick
      >
        <ModalOverlay>
          <ModalContent
            my={size.fullSize.enabled ? 0 : undefined}
            minHeight={
              !isOffline && size.defaultSize.enabled
                ? "calc(100vh - 180px)"
                : size.fullSize.enabled
                ? "100vh"
                : undefined
            }
          >
            {size.defaultSize.enabled && (
              <>
                <ModalHeader>
                  {header || (
                    <Flex alignItems="center">
                      {icon} {title}
                    </Flex>
                  )}
                </ModalHeader>
                <ModalCloseButton />
              </>
            )}
            <ModalBody
              ref={divRef}
              p={size.fullSize.enabled ? 0 : undefined}
              display="flex"
              flexDirection="column"
            >
              {props.loaded &&
              props.google &&
              hasItems(events || orgs || []) ? (
                <>
                  <MapSearch
                    entityAddress={
                      events
                        ? events.length === 1 && events[0].eventAddress
                          ? events[0].eventAddress[0].address
                          : undefined
                        : undefined
                    }
                    isVisible={size.defaultSize.enabled}
                    setCenter={setCenter}
                  />
                  <Map
                    center={center}
                    events={events}
                    orgs={orgs}
                    size={size}
                    zoomLevel={zoomLevel}
                    onFullscreenControlClick={(isFull: boolean) => {
                      setSize({
                        defaultSize: { enabled: !isFull },
                        fullSize: { enabled: isFull }
                      });
                    }}
                  />
                </>
              ) : isOffline ? (
                <Alert status="error" mb={3}>
                  <AlertIcon />
                  Échec du chargement de la carte. Êtes-vous connecté à internet
                  ?
                </Alert>
              ) : !props.loaded ? (
                <Spinner />
              ) : (
                <Text>
                  Il n'y a encore rien à afficher sur cette carte, revenez plus
                  tard !
                </Text>
              )}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    );
  }
);
