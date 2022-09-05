import {
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Text
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { LatLon } from "use-places-autocomplete";
import { withGoogleApi } from "features/map/GoogleApiWrapper";
import { Map, MapProps } from "features/map/Map";
import { MapSearch } from "features/map/MapSearch";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { hasItems } from "utils/array";
import { SizeMap } from "utils/maps";

export const MapModal = withGoogleApi({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
})(
  ({
    isOpen,
    isSearch = true,
    header,
    events,
    orgs,
    mapProps,
    zoomLevel,
    ...props
  }: {
    google: typeof google;
    loaded: boolean;
    isOpen: boolean;
    isSearch?: boolean;
    header?: React.ReactNode | React.ReactNodeArray;
    events?: IEvent[];
    orgs?: IOrg[];
    mapProps: Partial<MapProps>;
    center?: LatLon;
    zoomLevel?: number;
    onClose: () => void;
  }) => {
    const isOffline = props.loaded && !props.google;

    const canDisplay =
      props.loaded && props.google && hasItems(events || orgs || []);
    const [center, setCenter] = useState<LatLon | undefined>(props.center);

    const divRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<SizeMap>({
      defaultSize: { enabled: true },
      fullSize: { enabled: false }
    });

    let title = "Carte";

    return (
      <Modal
        closeOnOverlayClick
        isOpen={isOpen}
        size={size.fullSize.enabled ? "full" : "4xl"}
        onClose={() => {
          props.onClose && props.onClose();
        }}
      >
        <ModalOverlay>
          <ModalContent
            my={size.fullSize.enabled ? 0 : undefined}
            minHeight={
              !canDisplay
                ? 0
                : !isOffline && size.defaultSize.enabled
                ? "calc(100vh - 180px)"
                : size.fullSize.enabled
                ? "100vh"
                : undefined
            }
            width={canDisplay ? undefined : "auto"}
          >
            {/* Header */}
            {size.defaultSize.enabled && (
              <>
                <ModalHeader display="flex" alignItems="center" pb={0}>
                  {/* {icon} */}
                  {header ? header : title}
                </ModalHeader>
                <ModalCloseButton />
              </>
            )}

            <ModalBody
              ref={divRef}
              p={!canDisplay ? 5 : size.fullSize.enabled ? 0 : undefined}
              display="flex"
              flexDirection="column"
            >
              {canDisplay ? (
                <>
                  {isSearch && (
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
                  )}
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
                    {...mapProps}
                  />
                </>
              ) : isOffline ? (
                <Alert status="error" mt={3}>
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

{
  /**
    let icon: AppIcon | undefined;

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
        icon = <Icon as={IoIosPeople} mr={3} />;
      } else if (orgs.find(({ orgType }) => orgType === EOrgType.NETWORK))
        title = "Carte des réseaux";
      else title = "Carte des organisations";
 */
}
