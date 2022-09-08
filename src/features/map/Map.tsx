import MarkerClusterer, {
  ClusterIconStyle
} from "@googlemaps/markerclustererplus";
import GoogleMap from "google-map-react";
import React, { useRef, useState } from "react";
import { render } from "react-dom";
import { LatLon } from "use-places-autocomplete";
import { IEvent } from "models/Event";
import { EOrgType, IOrg } from "models/Org";
import { FullscreenControl } from "./FullscreenControl";
import { withGoogleApi } from "./GoogleApiWrapper";
import { Marker } from "./Marker";
import { getMarkerUrl, SizeMap } from "utils/maps";
import { EntityModal } from "features/modals/EntityModal";
import { isEvent } from "models/Entity";

const defaultCenter = {
  lat: 46.227638,
  lng: 2.213749
};
const defaultZoomLevel = 5;

function getMarkers(items: IEvent[] | IOrg[]) {
  let hash: { [key: string]: boolean } = {};

  return items.map((item: IOrg | IEvent, index: number) => {
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

    const [itemToShow, setItemToShow] = useState<IEvent | IOrg | null>(null);
    const [zoomLevel, setZoomLevel] = useState<number>(
      props.zoomLevel || defaultZoomLevel
    );
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
          zoom={zoomLevel}
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
            setZoomLevel(e.zoom);
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
              zoomLevel={zoomLevel}
              setItemToShow={setItemToShow}
            />
          ))}
        </GoogleMap>

        {itemToShow ? (
          isEvent(itemToShow) ? (
            <EntityModal
              event={itemToShow}
              onClose={() => setItemToShow(null)}
            />
          ) : (
            <EntityModal org={itemToShow} onClose={() => setItemToShow(null)} />
          )
        ) : null}
      </>
    );
  }
);
