import type { LatLon } from "use-places-autocomplete";
import type { IOrg } from "models/Org";
import type { IEvent } from "models/Event";
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from "@chakra-ui/react";
import { Map } from "features/map/Map";
import { MapSearch } from "features/map/MapSearch";

export const MapModal = ({
  items,
  ...props
}: {
  onClose: () => void;
  items?: IEvent[] | IOrg[];
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const [center, setCenter] = useState<LatLon>();
  const [size, setSize] = useState<string | undefined>();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        props.onClose && props.onClose();
        onClose();
      }}
      size={size}
      closeOnOverlayClick
    >
      <ModalOverlay>
        <ModalContent mt={size === "full" ? 0 : undefined}>
          <ModalHeader>
            {items &&
              items[0] &&
              `Carte des ${
                "eventName" in items[0] ? "événements" : "organisations"
              }`}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <>
              {Array.isArray(items) && items.length > 0 ? (
                <>
                  <MapSearch setCenter={setCenter} />
                  <Map
                    center={center}
                    items={items}
                    onFullscreenControlClick={(isFull: boolean) => {
                      setSize(isFull ? "full" : undefined);
                    }}
                    {...props}
                  />
                </>
              ) : (
                "Il n'y a encore rien à afficher sur cette carte, revenez plus tard !"
              )}
            </>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
