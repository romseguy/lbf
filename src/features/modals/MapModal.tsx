import type { LatLon } from "use-places-autocomplete";
import type { IOrg } from "models/Org";
import type { IEvent } from "models/Event";
import React, { useRef, useState } from "react";
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
  Tooltip
} from "@chakra-ui/react";
import { Map, SizeMap } from "features/map/Map";
import { MapSearch } from "features/map/MapSearch";
import { withGoogleApi } from "features/map/GoogleApiWrapper";
import { hasItems } from "utils/array";
import { MapStyles } from "features/map/MapStyles";

export const MapModal = withGoogleApi({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
})(
  ({
    header,
    events,
    orgs,
    ...props
  }: {
    google: typeof google;
    loaded: boolean;
    isOpen: boolean;
    header?: React.ReactNode | React.ReactNodeArray;
    events?: IEvent[];
    orgs?: IOrg[];
    onClose: () => void;
  }) => {
    const isOffline = props.loaded && !props.google;

    const [center, setCenter] = useState<LatLon>();

    const divRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<SizeMap>({
      defaultSize: { enabled: true },
      fullSize: { enabled: false }
    });

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
                  {header
                    ? header
                    : `Carte des ${events ? "événements" : "organisations"}`}
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
                    setCenter={setCenter}
                    isVisible={size.defaultSize.enabled}
                  />
                  <Map
                    center={center}
                    events={events}
                    orgs={orgs}
                    size={size}
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
