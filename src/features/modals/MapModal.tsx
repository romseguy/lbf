import type { LatLon } from "use-places-autocomplete";
import type { IOrg } from "models/Org";
import type { IEvent } from "models/Event";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Text
} from "@chakra-ui/react";
import { Map } from "features/map/Map";
import { MapSearch } from "features/map/MapSearch";
import { css } from "twin.macro";

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

export const MapModal = ({
  items,
  ...props
}: {
  onClose: () => void;
  items?: IEvent[] | IOrg[];
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const [center, setCenter] = useState<LatLon>();

  const [size, setSize] = useState<SizeMap>({
    defaultSize: { enabled: true },
    fullSize: { enabled: false }
  });

  const [height, setHeight] = useState<number>();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        props.onClose && props.onClose();
        onClose();
      }}
      size={size.fullSize.enabled ? "full" : undefined}
      closeOnOverlayClick
    >
      <ModalOverlay>
        <ModalContent my={0} minHeight="100vh">
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
            {Array.isArray(items) && items.length > 0 ? (
              <>
                {size.defaultSize.enabled && (
                  <MapSearch setCenter={setCenter} />
                )}
                <Map
                  center={center}
                  height={height}
                  items={items}
                  onGoogleApiLoaded={() => {
                    if (divRef && divRef.current) {
                      const height = divRef.current.offsetHeight - 80;
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
                          const height = divRef.current.offsetHeight - 210;
                          newSize.fullSize.height = height;
                          setSize(newSize);
                          setHeight(height);
                        }
                      }, 200);
                    }
                  }}
                  {...props}
                />
              </>
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
};
