import type { LatLon } from "use-places-autocomplete";
import type { IOrg } from "models/Org";
import type { IEvent } from "models/Event";
import React from "react";
import { css } from "twin.macro";
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
import { Link } from "../common/Link";
import { DescriptionModal } from "features/modals/DescriptionModal";
import DOMPurify from "isomorphic-dompurify";
import MarkerClusterer from "@googlemaps/markerclustererplus";
import { render } from "react-dom";

const defaultCenter = {
  lat: 44.940694,
  lng: 1.989113
};

const FullscreenControl = (props: { onClick: (isFull: boolean) => void }) => {
  const [isFull, setIsFull] = useState(false);
  const onClick = () => {
    setIsFull(!isFull);
    props.onClick(!isFull);
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
  const url = "eventName" in item ? item.eventUrl : item.orgUrl;
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
        bg="transparent"
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
    </>
  );
};

export const Map = React.memo(
  ({
    center,
    items,
    onFullscreenControlClick
  }: {
    center?: LatLon;
    items: IEvent[] | IOrg[];
    onFullscreenControlClick: (isFull: boolean) => void;
  }) => {
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
          defaultCenter={defaultCenter}
          defaultZoom={10}
          center={center}
          options={(maps) => ({
            fullscreenControl: false
            // zoomControl: boolean,
            // mapTypeControl: boolean,
            // scaleControl: boolean,
            // streetViewControl: boolean,
            // rotateControl: boolean,
          })}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps: api }) => {
            if (!map || !api) return;

            const controlButtonDiv = document.createElement("div");
            render(
              <FullscreenControl onClick={onFullscreenControlClick} />,
              controlButtonDiv
            );

            map.controls[api.ControlPosition.TOP_RIGHT].push(controlButtonDiv);

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
  }
);
