import MarkerClusterer, {
  ClusterIconStyle
} from "@googlemaps/markerclustererplus";
import GoogleMap from "google-map-react";
import React, { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { LatLon } from "use-places-autocomplete";
import { IEvent } from "models/Event";
import { EOrgType, IOrg } from "models/Org";
import { FullscreenControl } from "./FullscreenControl";
import { withGoogleApi } from "hocs/withGoogleApi";
import { Marker } from "./Marker";
import { getMarkerUrl, SizeMap } from "utils/maps";
import { EntityModal } from "features/modals/EntityModal";
import { IEntity, isEvent, isOrg } from "models/Entity";

const defaultCenter = {
  lat: 46.227638,
  lng: 2.213749
};
export const defaultZoomLevel = 5;

function getMarkers(items: IEntity[]) {
  let hash: { [key: string]: boolean } = {};

  return items.map((item, index: number) => {
    const isE = isEvent(item);
    const isO = isOrg(item);
    const key = `marker-${index}`;
    let lat = isE ? item.eventLat : isO ? item.orgLat : undefined;
    let lng = isE ? item.eventLng : isO ? item.orgLng : undefined;

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
  });
}

export interface MapProps {
  events?: IEvent[];
  orgs?: IOrg[];
  center?: LatLon;
  height?: string;
  size?: SizeMap;
  style: { [key: string]: string | number };
  zoomLevel?: number;
  setZoomLevel?: React.Dispatch<React.SetStateAction<number>>;
  onFullscreenControlClick?: (isFull: boolean) => void;
}

export const Map = withGoogleApi({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
})(
  ({
    events,
    orgs,
    center,
    size,
    height,
    style,
    onFullscreenControlClick,
    ...props
  }: MapProps & {
    google: typeof google;
    loaded: boolean;
  }) => {
    const mapRef = useRef(null);
    const [itemToShow, setItemToShow] = useState<IEntity | null>(null);
    const [zoomLevel, setZoomLevel] = useState<number>(defaultZoomLevel);
    const [markers, setMarkers] = useState(getMarkers(events || orgs || []));
    const onGoogleApiLoaded = ({
      map,
      maps: api
    }: {
      map: google.maps.Map;
      maps: typeof google.maps;
    }) => {
      if (!map || !api) return;

      if (onFullscreenControlClick) {
        const controlButtonDiv = document.createElement("div");
        render(
          <FullscreenControl onClick={onFullscreenControlClick} />,
          controlButtonDiv
        );
        map.controls[api.ControlPosition.TOP_RIGHT].push(controlButtonDiv);
      }

      const gMarkers: google.maps.Marker[] = markers.map(({ lat, lng }) => {
        const gMarker = new api.Marker({
          position: lat && lng ? { lat, lng } : null
        });
        gMarker.setVisible(false);
        return gMarker;
      });

      const orgType = orgs
        ? orgs[0].orgType === EOrgType.NETWORK
          ? EOrgType.NETWORK
          : EOrgType.GENERIC
        : undefined;
      const height = 25;
      const width = 25;
      const styles: ClusterIconStyle[] = [
        {
          url: getMarkerUrl({
            id: !orgType
              ? "event"
              : orgType === EOrgType.NETWORK
              ? "planet"
              : "trees",
            fill: "green",
            height,
            width
          }),
          anchorText: [23, 0],
          height,
          width
        }
      ];

      const clusterer = new MarkerClusterer(map, gMarkers, {
        calculator: (gMarkers, clusterIconStylesCount) => {
          return {
            text: `${gMarkers.length}`,
            index: clusterIconStylesCount + 1,
            title: `${gMarkers.length} ${
              orgs ? "organisations" : "événements"
            } à cet endroit`
          };
        },
        minimumClusterSize: 2,
        styles
      });

      api.event.addListener(clusterer, "clusteringend", () => {
        const clusters = clusterer.getClusters();
        const gMarkerGroups: { lat?: number; lng?: number }[][] = [];

        for (const cluster of clusters) {
          if (cluster.getSize() > 1)
            gMarkerGroups.push(
              cluster.getMarkers().map((gMarker) => ({
                lat: gMarker.getPosition()?.lat(),
                lng: gMarker.getPosition()?.lng()
              }))
            );
        }

        const gMarkers = gMarkerGroups.flat();

        setMarkers(
          markers.filter(
            (marker) =>
              !gMarkers.find(
                ({ lat, lng }) => lat === marker.lat && lng === marker.lng
              )
          )
        );
      });
    };

    if (!events && !orgs) return null;

    return (
      <>
        <GoogleMap
          ref={mapRef}
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoomLevel}
          center={center}
          zoom={props.zoomLevel || zoomLevel}
          options={(maps) => ({
            fullscreenControl: false,
            gestureHandling: "greedy"
            // zoomControl: boolean,
            // mapTypeControl: boolean,
            // scaleControl: boolean,
            // streetViewControl: boolean,
            // rotateControl: boolean,
          })}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onGoogleApiLoaded}
          onChange={(e) => {
            props.setZoomLevel
              ? props.setZoomLevel(e.zoom)
              : setZoomLevel(e.zoom);
          }}
          style={
            size?.fullSize.enabled
              ? {}
              : style || {
                  position: "relative",
                  flex: 1
                }
          }
        >
          {markers.map((marker) => (
            <Marker
              key={marker.key}
              lat={marker.lat}
              lng={marker.lng}
              item={marker.item}
              zoomLevel={props.zoomLevel || zoomLevel}
              setItemToShow={setItemToShow}
            />
          ))}
        </GoogleMap>

        {isEvent(itemToShow) ? (
          <EntityModal event={itemToShow} onClose={() => setItemToShow(null)} />
        ) : isOrg(itemToShow) ? (
          <EntityModal org={itemToShow} onClose={() => setItemToShow(null)} />
        ) : null}
      </>
    );
  }
);
