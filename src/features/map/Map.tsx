import type { LatLon } from "use-places-autocomplete";
import type { IEvent } from "models/Event";
import type { IOrg } from "models/Org";
import type { SizeMap } from "features/modals/MapModal";
import React, { useRef, useState } from "react";
import { render } from "react-dom";
import GoogleMap from "google-map-react";
import MarkerClusterer from "@googlemaps/markerclustererplus";
import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import { withGoogleApi } from "./GoogleApiWrapper";
import { FullscreenControl } from "./FullscreenControl";
import { Marker } from "./Marker";

const defaultCenter = {
  lat: 44.940694,
  lng: 1.989113
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
    const mapRef = useRef(null);
    const options = {
      fullscreenControl: false
      // zoomControl: boolean,
      // mapTypeControl: boolean,
      // scaleControl: boolean,
      // streetViewControl: boolean,
      // rotateControl: boolean,
    };
    const [zoomLevel, setZoomLevel] = useState<number>(10);

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
          />
        ))}
      </GoogleMap>
    );
  }
);
