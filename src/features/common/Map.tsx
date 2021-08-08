import type { IOrg } from "models/Org";
import type { IEvent } from "models/Event";
import React from "react";
import GoogleMap from "google-map-react";
import {
  Alert,
  AlertIcon,
  Button,
  Icon,
  IconButton,
  Spinner,
  Text
} from "@chakra-ui/react";
import { loadMapsSdk } from "utils/maps";
import { useEffect } from "react";
import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "./Link";
import { css } from "twin.macro";
import { DescriptionModal } from "features/modals/DescriptionModal";
import DOMPurify from "isomorphic-dompurify";
import MarkerClusterer from "@googlemaps/markerclustererplus";

const center = {
  lat: 44.940694,
  lng: 1.989113
};

const Marker = ({
  item,
  lat,
  lng
}: {
  item?: IEvent | IOrg;
  lat?: number;
  lng?: number;
}) => {
  if (!item || !lat || !lng) return null;

  const [isDescriptionOpen, setIsDescriptionOpen] = useState<{
    [key: string]: boolean;
  }>({});

  const name = "eventName" in item ? item.eventName : item.orgName;
  const description =
    "eventName" in item ? item.eventDescription : item.orgDescription;

  return (
    <>
      <Button
        cursor="pointer"
        onClick={() => {
          setIsDescriptionOpen({
            ...isDescriptionOpen,
            [name]: true
          });
        }}
        leftIcon={<Icon as={FaMapMarkerAlt} boxSize={8} />}
        color="red"
        _hover={{
          color: "green"
        }}
      >
        {name}
      </Button>

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
  const [mapsSdkState, setMapsSdkState] = useState({
    loaded: false,
    loading: false
  });

  useEffect(() => {
    const xhr = async () => {
      try {
        setMapsSdkState({ loaded: false, loading: true });
        await loadMapsSdk();
        setMapsSdkState({ loaded: true, loading: false });
      } catch (error) {
        console.log(error);
        setMapsSdkState({ loaded: false, loading: false });
      }
    };

    xhr();
  }, []);

  const hash: { [key: string]: boolean } = {};

  const [markers, setMarkers] = useState(
    items.map((item, index) => {
      const key = `marker-${index}`;
      let lat = "eventName" in item ? item.eventLat : item.orgLat;
      let lng = "eventName" in item ? item.eventLng : item.orgLng;

      if (!lat || !lng || !item) return {};

      const latLng = `${lat}_${lng}`;

      if (hash[latLng]) {
        lat = lat + (Math.random() - 0.5) / 1500;
        lng = lng + (Math.random() - 0.5) / 1500;
      } else hash[latLng] = true;

      return {
        key,
        lat,
        lng,
        item
      };
    })
  );

  if (!mapsSdkState.loading && !mapsSdkState.loaded)
    return (
      <Alert status="error">
        <AlertIcon />
        Nous n'avons pas pu charger la carte. Êtes-vous connecté à internet ?
      </Alert>
    );

  return mapsSdkState.loading ? (
    <Spinner />
  ) : (
    <div style={{ height: "400px", width: "100%" }}>
      <GoogleMap
        defaultCenter={center}
        defaultZoom={10}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps: api }) => {
          const gMarkers = markers.map(
            ({ lat, lng }) =>
              new api.Marker({
                position: { lat, lng }
              })
          );

          gMarkers.map((marker) => {
            return marker.setVisible(false);
          });

          const cluster = new MarkerClusterer(map, gMarkers, {
            imagePath:
              "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
            minimumClusterSize: 2
          });

          api.event.addListener(cluster, "clusteringend", () => {
            const markersGrouped = cluster
              .getClusters()
              .map((cl) => cl.getMarkers())
              .filter((marker) => marker.length > 1);

            const positions = markersGrouped.map((markers) =>
              markers.map((marker) => ({
                lat: marker.getPosition().lat(),
                lng: marker.getPosition().lng()
              }))
            )[0];

            setMarkers(
              markers.filter(({ lat, lng }) => {
                let allow = true;
                if (
                  positions &&
                  positions.find(
                    (position: { lat: number; lng: number }) =>
                      position.lat === lat && position.lng === lng
                  )
                )
                  allow = false;
                return allow;
              })
            );
          });
        }}
      >
        {markers.map((marker) => (
          <Marker {...marker} />
        ))}
      </GoogleMap>
    </div>
  );
});
