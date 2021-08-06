import React from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import { Libraries } from "@react-google-maps/api/dist/utils/make-load-script-url";

const containerStyle = {
  width: "400px",
  height: "400px"
};

const center = {
  lat: 44.940694,
  lng: 1.989113
};

const libraries: Libraries = ["places"];

export const Map = React.memo(({ onClose }: { onClose: () => void }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
    libraries
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (loadError)
    return (
      <Alert status="error">
        <AlertIcon />
        Nous n'avons pas pu charger la carte. Êtes-vous connecté à internet ?
      </Alert>
    );

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      // onLoad={onLoad}
      // onUnmount={onUnmount}
    >
      {/* Child components, such as markers, info windows, etc. */}
      <></>
    </GoogleMap>
  ) : (
    <Spinner />
  );
});
