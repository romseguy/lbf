import { CalendarIcon } from "@chakra-ui/icons";
import { Box, Icon, Text, useColorMode } from "@chakra-ui/react";
import MarkerClusterer, {
  ClusterIconStyle
} from "@googlemaps/markerclustererplus";
import GoogleMap from "google-map-react";
import DOMPurify from "isomorphic-dompurify";
import React, { useRef, useState } from "react";
import { render } from "react-dom";
import { IoIosPeople } from "react-icons/io";
import { LatLon } from "use-places-autocomplete";
import { css } from "twin.macro";
import { Link } from "features/common";
import { EventTimeline } from "features/events/EventTimeline";
import { DescriptionModal } from "features/modals/DescriptionModal";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { FullscreenControl } from "./FullscreenControl";
import { withGoogleApi } from "./GoogleApiWrapper";
import { Marker } from "./Marker";
import { OrgInfo } from "features/orgs/OrgInfo";
import { EventInfo } from "features/events/EventInfo";
import { getMarkerUrl } from "utils/maps";

export type SizeMap = {
  defaultSize: {
    enabled: boolean;
  };
  fullSize: {
    enabled: boolean;
  };
};

const defaultCenter = {
  lat: 46.227638,
  lng: 2.213749
};
const defaultZoomLevel = 5;

export const Map = withGoogleApi({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
})(
  ({
    center,
    events,
    orgs,
    size,
    height,
    style,
    onFullscreenControlClick,
    ...props
  }: {
    google: typeof google;
    loaded: boolean;
    center?: LatLon;
    events?: IEvent[];
    orgs?: IOrg[];
    size: SizeMap;
    height?: string;
    style: { [key: string]: string | number };
    onGoogleApiLoaded: () => void;
    onFullscreenControlClick?: (isFull: boolean) => void;
  }) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === "dark";

    const mapRef = useRef(null);

    const [itemToShow, setItemToShow] = useState<IEvent | IOrg | null>(null);
    const [zoomLevel, setZoomLevel] = useState<number>(defaultZoomLevel);

    const hash: { [key: string]: boolean } = {};
    const mapItem = (item: IOrg | IEvent, index: number) => {
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
    };

    const [markers, setMarkers] = useState(
      events ? events.map(mapItem) : orgs ? orgs.map(mapItem) : []
    );

    const onGoogleApiLoaded = ({
      map,
      maps: api
    }: {
      map: google.maps.Map;
      maps: typeof google.maps;
    }) => {
      if (!map || !api) return;

      props.onGoogleApiLoaded && props.onGoogleApiLoaded();

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

      const styles: ClusterIconStyle[] = [
        {
          url: getMarkerUrl({
            id: orgs ? "org" : "event",
            fill: "green",
            height: 25,
            width: 25
          }),
          anchorText: [17, 0],
          height: 25,
          width: 25
        }
      ];
      console.log(styles);

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

    return (
      <>
        <GoogleMap
          ref={mapRef}
          defaultCenter={defaultCenter}
          defaultZoom={10}
          center={center}
          zoom={zoomLevel}
          options={(maps) => ({
            fullscreenControl: false
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
            style || {
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

        {itemToShow && (
          <DescriptionModal
            onClose={() => {
              setItemToShow(null);
            }}
            header={
              <Box display="inline-flex" alignItems="center" maxWidth="90%">
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
            }
          >
            <>
              {"eventName" in itemToShow ? (
                <>
                  <EventInfo event={itemToShow} my={3} />
                  <EventTimeline event={itemToShow} />
                </>
              ) : (
                <OrgInfo org={itemToShow} />
              )}

              <Box
                mt={4}
                border={isDark ? "1px solid white" : "1px solid black"}
                borderRadius="lg"
                p={3}
              >
                {"eventName" in itemToShow ? (
                  itemToShow.eventDescription &&
                  itemToShow.eventDescription.length > 0 ? (
                    <div className="ql-editor">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            itemToShow.eventDescription
                          )
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
              </Box>
            </>
          </DescriptionModal>
        )}
      </>
    );
  }
);
