import type { LatLon } from "use-places-autocomplete";
import type { IOrg } from "models/Org";
import type { IEvent } from "models/Event";
import React, { useRef } from "react";
import { css } from "twin.macro";
import GoogleMap from "google-map-react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Icon,
  IconButton,
  Spinner,
  Text,
  Tooltip
} from "@chakra-ui/react";
import { latLng2World, world2Screen } from "utils/maps";
import { useEffect } from "react";
import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "../common/Link";
import { DescriptionModal } from "features/modals/DescriptionModal";
import DOMPurify from "isomorphic-dompurify";
import MarkerClusterer from "@googlemaps/markerclustererplus";
import { render } from "react-dom";

const defaultCenter = {
  lat: 44.940694,
  lng: 1.989113
};

import { styled } from "twin.macro";
import { getStyleObjectFromString } from "utils/string";
import { withGoogleApi } from "./GoogleApiWrapper";

const styles = `
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  background-color: red;
  border: 2px solid #fff;
  border-radius: 100%;
  user-select: none;
  transform: translate(-50%, -50%);
  cursor: pointer;
`;

//cursor: ${(props) => (props.onClick ? "pointer" : "default")};
// const DMarker = ({ item, onClick }) => {

//   return <Wrapper onClick={onClick} />;
// };

const Marker = ({
  key,
  item,
  lat,
  lng,
  zoomLevel
}: {
  key: string;
  item: IEvent | IOrg;
  lat?: number;
  lng?: number;
  zoomLevel: number;
}) => {
  const name = "eventName" in item ? item.eventName : item.orgName;
  const [isDescriptionOpen, setIsDescriptionOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const url = "eventName" in item ? item.eventUrl : item.orgUrl;
  const description =
    "eventName" in item ? item.eventDescription : item.orgDescription;

  // if (lat && lng) {
  // const world = latLng2World({ lat, lng });
  // const screen = world2Screen({ x: world.x, y: world.y }, zoomLevel);
  // }

  let additionalStyles = "";

  //console.log(zoomLevel);

  if (zoomLevel > 14) {
    console.log(getStyleObjectFromString(styles));
    additionalStyles = `
    
    `;
  }

  return (
    <div key={key}>
      <Tooltip label={name}>
        <Box
          css={css(styles + additionalStyles)}
          onClick={() => {
            setIsDescriptionOpen({
              ...isDescriptionOpen,
              [name]: true
            });
          }}
          _hover={{ zIndex: 1 }}
        />
      </Tooltip>

      {/* <Button
        cursor="pointer"
        leftIcon={<Icon as={FaMapMarkerAlt} boxSize={8} />}
        color="red"
        bg="transparent"
        _hover={{
          color: "green"
        }}
      >
        {name}
      </Button> */}

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
            href={`/${url}`}
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
    </div>
  );
};

export const Map = withGoogleApi({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
})(
  ({
    center,
    items,
    height,
    onFullscreenControlClick,
    ...props
  }: {
    google: any;
    loaded: boolean;
    center?: LatLon;
    items: IEvent[] | IOrg[];
    height?: number;
    onGoogleApiLoaded: () => void;
    onFullscreenControlClick?: (isFull: boolean) => void;
  }) => {
    const FullscreenControl = () => {
      const [isFull, setIsFull] = useState(false);
      const onClick = () => {
        const f = !isFull;
        setIsFull(f);
        onFullscreenControlClick && onFullscreenControlClick(f);
      };

      return (
        <Button
          className="gm-control-active gm-fullscreen-control"
          draggable="false"
          aria-label="Passer en plein écran"
          title="Passer en plein écran"
          type="button"
          onClick={onClick}
          css={css`
            background: none rgb(255, 255, 255);
            border: 0px;
            margin: 10px;
            padding: 0px;
            text-transform: none;
            appearance: none;
            position: absolute;
            cursor: pointer;
            user-select: none;
            border-radius: 2px;
            height: 40px;
            width: 40px;
            box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
            overflow: hidden;
            top: 0px;
            right: 0px;
          `}
        >
          <>
            <img
              src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2018%2018%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M0%200v6h2V2h4V0H0zm16%200h-4v2h4v4h2V0h-2zm0%2016h-4v2h6v-6h-2v4zM2%2012H0v6h6v-2H2v-4z%22/%3E%3C/svg%3E"
              alt=""
              css={css`
                height: 18px;
                width: 18px;
              `}
            />
            <img
              src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2018%2018%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M0%200v6h2V2h4V0H0zm16%200h-4v2h4v4h2V0h-2zm0%2016h-4v2h6v-6h-2v4zM2%2012H0v6h6v-2H2v-4z%22/%3E%3C/svg%3E"
              alt=""
              css={css`
                height: 18px;
                width: 18px;
              `}
            />
            <img
              src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2018%2018%22%3E%3Cpath%20fill%3D%22%23111%22%20d%3D%22M0%200v6h2V2h4V0H0zm16%200h-4v2h4v4h2V0h-2zm0%2016h-4v2h6v-6h-2v4zM2%2012H0v6h6v-2H2v-4z%22/%3E%3C/svg%3E"
              alt=""
              css={css`
                height: 18px;
                width: 18px;
              `}
            />
          </>
        </Button>
      );
    };

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

      props.onGoogleApiLoaded();

      // if (mapRef.current) {
      //   console.log(mapRef.current);
      // }

      if (!options.fullscreenControl) {
        const controlButtonDiv = document.createElement("div");
        render(<FullscreenControl />, controlButtonDiv);
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
      <div style={{ height: height + "px" || "400px", width: "100%" }}>
        <GoogleMap
          ref={mapRef}
          defaultCenter={defaultCenter}
          defaultZoom={10}
          center={center}
          zoom={zoomLevel}
          // style={{
          //   position: "absolute",
          //   left: 0,
          //   right: 0,
          //   top: 0,
          //   bottom: 0
          // }}
          options={(maps) => options}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onGoogleApiLoaded}
          onChange={(e) => {
            console.log(e.zoom);
            setZoomLevel(e.zoom);
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
      </div>
    );
  }
);
