import type { IEvent } from "models/Event";
import React from "react";
import GoogleMap from "google-map-react";
import { Alert, AlertIcon, Icon, Spinner, Text } from "@chakra-ui/react";
import { loadMapsApi } from "utils/maps";
import { useEffect } from "react";
import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "./Link";
import { css } from "twin.macro";
import { DescriptionModal } from "features/modals/DescriptionModal";
import DOMPurify from "isomorphic-dompurify";

const center = {
  lat: 44.940694,
  lng: 1.989113
};

const Marker = ({ item }: { item: IEvent; lat: number; lng: number }) => {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState<{
    [key: string]: boolean;
  }>({});

  return (
    <>
      <Icon
        cursor="pointer"
        onClick={() => {
          setIsDescriptionOpen({
            ...isDescriptionOpen,
            [item.eventName]: true
          });
        }}
        as={FaMapMarkerAlt}
        boxSize={4}
        color="red"
      />

      <DescriptionModal
        defaultIsOpen={false}
        isOpen={isDescriptionOpen[item.eventName]}
        onClose={() => {
          setIsDescriptionOpen({
            ...isDescriptionOpen,
            [item.eventName]: false
          });
        }}
        header={
          <Link
            href={`/${encodeURIComponent(item.eventName)}`}
            css={css`
              letter-spacing: 0.1em;
            `}
            size="larger"
            className="rainbow-text"
          >
            {item.eventName}
          </Link>
        }
      >
        {item.eventDescription &&
        item.eventDescription.length > 0 &&
        item.eventDescription !== "<p><br></p>" ? (
          <div className="ql-editor">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(item.eventDescription)
              }}
            />
          </div>
        ) : (
          <Text fontStyle="italic">Aucune description.</Text>
        )}
      </DescriptionModal>
    </>
  );
};

export const Map = React.memo(({ items }: { items?: IEvent[] }) => {
  const [mapsApiState, setMapsApiState] = useState({
    loaded: false,
    loading: false
  });

  useEffect(() => {
    const xhr = async () => {
      try {
        setMapsApiState({ loaded: false, loading: true });
        await loadMapsApi();
        setMapsApiState({ loaded: true, loading: false });
      } catch (error) {
        console.log(error);
        setMapsApiState({ loaded: false, loading: false });
      }
    };

    xhr();
  }, []);

  if (!mapsApiState.loading && !mapsApiState.loaded)
    return (
      <Alert status="error">
        <AlertIcon />
        Nous n'avons pas pu charger la carte. Êtes-vous connecté à internet ?
      </Alert>
    );

  return mapsApiState.loading ? (
    <Spinner />
  ) : (
    <div style={{ height: "400px", width: "100%" }}>
      <GoogleMap defaultCenter={center} defaultZoom={10}>
        {items?.map((item, index) => {
          if (!item.eventLat || !item.eventLng) return null;
          return (
            <Marker
              key={`item-${index}`}
              lat={item.eventLat}
              lng={item.eventLng}
              item={item}
            />
          );
        })}
      </GoogleMap>
    </div>
  );
});
