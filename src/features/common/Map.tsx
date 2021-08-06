//@ts-nocheck
import type { IEvent } from "models/Event";
import React from "react";
//import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import GoogleMap from "google-map-react";
import {
  Alert,
  AlertIcon,
  Icon,
  Spinner,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Button,
  Box,
  Text
} from "@chakra-ui/react";
import { Libraries } from "@react-google-maps/api/dist/utils/make-load-script-url";
import { loadMapsApi } from "utils/maps";
import { useEffect } from "react";
import { useState } from "react";
import { FaMapMarker, FaMarker } from "react-icons/fa";
import { Link } from "./Link";
import { css } from "twin.macro";
import { DescriptionModal } from "features/modals/DescriptionModal";

const containerStyle = {
  width: "400px",
  height: "400px"
};

const center = {
  lat: 44.940694,
  lng: 1.989113
};

const libraries: Libraries = ["places"];

const Marker = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState<{
    [key: string]: boolean;
  }>({});

  console.log(isOpen);

  return (
    <>
      <Popover isLazy isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <PopoverTrigger>
          {/* <Button onClick={() => setIsOpen(true)}>YTOOO</Button> */}
          <Icon
            cursor="pointer"
            onClick={() => setIsOpen(true)}
            as={FaMapMarker}
            color="red"
          />
        </PopoverTrigger>
        <PopoverContent width="auto" cursor="default">
          <PopoverBody>
            <Link
              css={css`
                letter-spacing: 0.1em;
              `}
              size="larger"
              className="rainbow-text"
            >
              {item.eventName}
            </Link>
            {item.eventDescription && item.eventDescription.length > 0 ? (
              <Box mt={1}>
                <Link
                  fontSize="sm"
                  variant="underline"
                  onClick={() => {
                    setIsDescriptionOpen({
                      ...isDescriptionOpen,
                      [item.eventName]: true
                    });
                  }}
                >
                  Voir l'affiche de l'événement
                </Link>
              </Box>
            ) : (
              <Text mt={3}>Aucune affiche disponible.</Text>
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>

      <DescriptionModal
        defaultIsOpen={false}
        isOpen={isDescriptionOpen[item.eventName]}
        onClose={() => {
          setIsDescriptionOpen({
            ...isDescriptionOpen,
            [item.eventName]: false
          });
          setTimeout(() => {
            setIsOpen(true);
          }, 500);
        }}
        header={item.eventName}
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

export const Map = React.memo(
  ({ items, onClose }: { items?: IEvent[]; onClose: () => void }) => {
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

    // const { isLoaded, loadError } = useJsApiLoader({
    //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
    //   libraries
    // });
    // const [map, setMap] = React.useState(null);
    // const onLoad = React.useCallback(function callback(map) {
    //   const bounds = new window.google.maps.LatLngBounds();
    //   map.fitBounds(bounds);
    //   setMap(map);
    // }, []);

    // const onUnmount = React.useCallback(function callback(map) {
    //   setMap(null);
    // }, []);

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
            console.log(item);

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
      // <GoogleMap
      //   mapContainerStyle={containerStyle}
      //   center={center}
      //   zoom={10}
      //   // onLoad={onLoad}
      //   // onUnmount={onUnmount}
      // >
      //   {items?.map((item, index) => {
      //     if (!item.eventLat || !item.eventLng) return null;
      //     return (
      //       <Marker
      //         key={`item-${index}`}
      //         position={{ lat: item.eventLat, lng: item.eventLng }}
      //       />
      //     );
      //   })}
      // </GoogleMap>
    );
  }
);
