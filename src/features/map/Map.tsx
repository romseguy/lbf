import type { LatLon } from "use-places-autocomplete";
import type { IEvent } from "models/Event";
import type { IOrg } from "models/Org";
import type { SizeMap } from "features/modals/MapModal";
import React, { useRef, useState } from "react";
import { render } from "react-dom";
import GoogleMap from "google-map-react";
import MarkerClusterer from "@googlemaps/markerclustererplus";
import { Alert, AlertIcon, Box, Icon, Spinner, Text } from "@chakra-ui/react";
import { withGoogleApi } from "./GoogleApiWrapper";
import { FullscreenControl } from "./FullscreenControl";
import { Marker } from "./Marker";
import { DescriptionModal } from "features/modals/DescriptionModal";
import { Link } from "features/common";
import { FaMapMarkerAlt } from "react-icons/fa";
import DOMPurify from "isomorphic-dompurify";
import { CalendarIcon } from "@chakra-ui/icons";
import { IoIosPeople } from "react-icons/io";
import { css } from "twin.macro";

const defaultCenter = {
  lat: 42.888663,
  lng: 1.347818
};

export const Map = withGoogleApi({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
})(
  ({
    center,
    items,
    size,
    onFullscreenControlClick,
    ...props
  }: {
    google: any;
    loaded: boolean;
    center?: LatLon;
    items: IEvent[] | IOrg[];
    size: SizeMap;
    onGoogleApiLoaded: () => void;
    onFullscreenControlClick?: (isFull: boolean) => void;
  }) => {
    const [itemToShow, setItemToShow] = useState<IEvent | IOrg | null>(null);
    const [zoomLevel, setZoomLevel] = useState<number>(10);

    const mapRef = useRef(null);
    const options = {
      fullscreenControl: false
      // zoomControl: boolean,
      // mapTypeControl: boolean,
      // scaleControl: boolean,
      // streetViewControl: boolean,
      // rotateControl: boolean,
    };

    const hash: { [key: string]: boolean } = {};

    const [markers, setMarkers] = useState(
      items.map((item, index) => {
        const key = `marker-${index}`;
        let lat = "eventName" in item ? item.eventLat : item.orgLat;
        let lng = "eventName" in item ? item.eventLng : item.orgLng;

        if (lat && lng) {
          const latLng = `${lat}_${lng}`;

          if (hash[latLng]) {
            lat = lat + (Math.random() - 0.5) / 1500;
            lng = lng + (Math.random() - 0.5) / 1500;
          } else hash[latLng] = true;
        }

        return {
          key,
          lat,
          lng,
          item
        };
      })
    );

    const onGoogleApiLoaded = ({ map, maps: api }: { map: any; maps: any }) => {
      if (!map || !api) return;

      props.onGoogleApiLoaded && props.onGoogleApiLoaded();

      // if (mapRef.current) {
      //   console.log(mapRef.current);
      // }

      if (!options.fullscreenControl) {
        const controlButtonDiv = document.createElement("div");
        render(
          <FullscreenControl onClick={onFullscreenControlClick} />,
          controlButtonDiv
        );
        map.controls[api.ControlPosition.TOP_RIGHT].push(controlButtonDiv);
      }

      const gMarkers = markers.map(({ lat, lng }) => {
        const gMarker = new api.Marker({
          position: { lat, lng }
        });
        gMarker.setVisible(false);
        return gMarker;
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

        const newMarkers = [];

        for (const marker of markers) {
          if (
            positions &&
            positions.find(
              (position: { lat: number; lng: number }) =>
                position.lat === marker.lat && position.lng === marker.lng
            )
          )
            continue;

          newMarkers.push(marker);
        }

        setMarkers(newMarkers);
      });
    };

    const isOffline = props.loaded && !props.google;

    if (!props.loaded) {
      return <Spinner />;
    } else if (isOffline) {
      return (
        <Alert status="error">
          <AlertIcon />
          Nous n'avons pas pu charger la carte. Êtes-vous connecté à internet ?
        </Alert>
      );
    }

    return (
      <>
        <GoogleMap
          ref={mapRef}
          defaultCenter={defaultCenter}
          defaultZoom={10}
          center={center}
          zoom={zoomLevel}
          options={(maps) => options}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onGoogleApiLoaded}
          onChange={(e) => {
            setZoomLevel(e.zoom);
          }}
          style={{
            position: "relative",
            flex: 1
          }}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.key}
              lat={marker.lat}
              lng={marker.lng}
              item={marker.item}
              zoomLevel={zoomLevel}
              setItemToShow={setItemToShow}
            />
          ))}
        </GoogleMap>

        {itemToShow && (
          <DescriptionModal
            onClose={() => {
              setItemToShow(null);
            }}
            header={
              <>
                <Box display="inline-flex" alignItems="center">
                  {"eventName" in itemToShow ? (
                    <Icon as={CalendarIcon} mr={1} boxSize={6} />
                  ) : (
                    <Icon as={IoIosPeople} mr={1} boxSize={6} />
                  )}{" "}
                  <Link
                    href={`/${
                      "eventName" in itemToShow
                        ? itemToShow.eventUrl
                        : itemToShow.orgUrl
                    }`}
                    css={css`
                      letter-spacing: 0.1em;
                    `}
                    size="larger"
                    className="rainbow-text"
                  >
                    {"eventName" in itemToShow
                      ? itemToShow.eventName
                      : itemToShow.orgName}
                  </Link>
                </Box>
                <br />
                <Box display="inline-flex" alignItems="center">
                  <Icon as={FaMapMarkerAlt} mr={2} color="red" />
                  {"eventName" in itemToShow
                    ? itemToShow.eventAddress
                    : itemToShow.orgAddress}
                </Box>
              </>
            }
          >
            {"eventName" in itemToShow ? (
              itemToShow.eventDescription &&
              itemToShow.eventDescription.length > 0 ? (
                <div className="ql-editor">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(itemToShow.eventDescription)
                    }}
                  />
                </div>
              ) : (
                <Text fontStyle="italic">Aucune description.</Text>
              )
            ) : itemToShow.orgDescription &&
              itemToShow.orgDescription.length > 0 ? (
              <div className="ql-editor">
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(itemToShow.orgDescription)
                  }}
                />
              </div>
            ) : (
              <Text fontStyle="italic">Aucune description.</Text>
            )}
          </DescriptionModal>
        )}
      </>
    );
  }
);
