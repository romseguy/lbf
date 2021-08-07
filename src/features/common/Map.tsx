import type { IOrg } from "models/Org";
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

const Marker = ({
  item,
  lat,
  lng
}: {
  item: IEvent | IOrg;
  lat?: number;
  lng?: number;
}) => {
  if (!lat || !lng) return null;

  const [isDescriptionOpen, setIsDescriptionOpen] = useState<{
    [key: string]: boolean;
  }>({});

  const name = "eventName" in item ? item.eventName : item.orgName;
  const description =
    "eventName" in item ? item.eventDescription : item.orgDescription;

  return (
    <>
      <Icon
        cursor="pointer"
        onClick={() => {
          setIsDescriptionOpen({
            ...isDescriptionOpen,
            [name]: true
          });
        }}
        as={FaMapMarkerAlt}
        boxSize={4}
        color="red"
      />

      <DescriptionModal
        defaultIsOpen={false}
        isOpen={isDescriptionOpen[name]}
        onClose={() => {
          setIsDescriptionOpen({
            ...isDescriptionOpen,
            [name]: false
          });
        }}
        header={
          <Link
            href={`/${encodeURIComponent(name)}`}
            css={css`
              letter-spacing: 0.1em;
            `}
            size="larger"
            className="rainbow-text"
          >
            {name}
          </Link>
        }
      >
        {description &&
        description.length > 0 &&
        description !== "<p><br></p>" ? (
          <div className="ql-editor">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(description)
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

export const Map = React.memo(({ items }: { items: IEvent[] | IOrg[] }) => {
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
        {items.map((item, index) => {
          const markerProps = {
            key: `item-${index}`,
            item,
            lat: "eventName" in item ? item.eventLat : item.orgLat,
            lng: "eventName" in item ? item.eventLng : item.orgLng
          };

          return <Marker {...markerProps} />;
        })}
      </GoogleMap>
    </div>
  );
});
