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
  useDisclosure,
  Box,
  Text,
  Alert,
  AlertIcon,
  Spinner
} from "@chakra-ui/react";
import { Map } from "features/map/Map";
import { MapSearch } from "features/map/MapSearch";
import { withGoogleApi } from "features/map/GoogleApiWrapper";

type SizeMap = {
  defaultSize: {
    enabled: boolean;
    height?: number;
  };
  fullSize: {
    enabled: boolean;
    height?: number;
  };
};

export const MapModal = withGoogleApi({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
})(
  ({
    items,
    ...props
  }: {
    google: any;
    loaded: boolean;
    isOpen: boolean;
    onClose: () => void;
    items: IEvent[] | IOrg[];
  }) => {
    const isOffline = props.loaded && !props.google;

    const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });
    const [center, setCenter] = useState<LatLon>();

    const divRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number>();
    const [size, setSize] = useState<SizeMap>({
      defaultSize: { enabled: true },
      fullSize: { enabled: false }
    });

    return (
      <Modal
        isOpen={props.isOpen}
        onClose={() => {
          props.onClose && props.onClose();
          onClose();
        }}
        size={size.fullSize.enabled ? "full" : undefined}
        closeOnOverlayClick
      >
        <ModalOverlay
        // css={css`
        //   visibility: ${props.isOpen ? "visible" : "hidden"} !important;
        // `}
        >
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
                  {items &&
                    items[0] &&
                    `Carte des ${
                      "eventName" in items[0] ? "événements" : "organisations"
                    }`}
                </ModalHeader>
                <ModalCloseButton />
              </>
            )}
            <ModalBody ref={divRef} p={size.fullSize.enabled ? 0 : undefined}>
              {props.loaded &&
              props.google &&
              Array.isArray(items) &&
              items.length > 0 ? (
                <>
                  <MapSearch
                    setCenter={setCenter}
                    isVisible={size.defaultSize.enabled}
                  />
                  <Map
                    center={center}
                    height={height}
                    items={items}
                    onGoogleApiLoaded={() => {
                      if (divRef && divRef.current) {
                        const height = divRef.current.offsetHeight - 10;
                        const newSize: SizeMap = {
                          ...size,
                          defaultSize: { enabled: true, height }
                        };
                        setSize(newSize);
                        setHeight(height);
                      }
                    }}
                    onFullscreenControlClick={(isFull: boolean) => {
                      if (isFull) {
                        const newSize: SizeMap = {
                          fullSize: { enabled: true },
                          defaultSize: { enabled: false }
                        };
                        setSize(newSize);
                        setTimeout(() => {
                          if (divRef && divRef.current) {
                            const height = divRef.current.offsetHeight;
                            newSize.fullSize.height = height;
                            setSize(newSize);
                            setHeight(height);
                          }
                        }, 200);
                      } else {
                        const newSize: SizeMap = {
                          defaultSize: { enabled: true },
                          fullSize: { enabled: false }
                        };
                        setSize(newSize);
                        setTimeout(() => {
                          if (divRef && divRef.current) {
                            const height = divRef.current.offsetHeight - 320;
                            newSize.fullSize.height = height;
                            setSize(newSize);
                            setHeight(height);
                          }
                        }, 200);
                      }
                    }}
                  />
                </>
              ) : isOffline ? (
                <Alert status="error" mb={3}>
                  <AlertIcon />
                  Nous n'avons pas pu charger la carte. Êtes-vous connecté à
                  internet ?
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
