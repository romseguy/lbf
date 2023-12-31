import {
  IconButton,
  IconButtonProps,
  Flex,
  InputProps,
  Spinner,
  Tooltip,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { geolocated } from "react-geolocated";
import { FaMapMarkerAlt } from "react-icons/fa";
import { withGoogleApi } from "features/map/GoogleApiWrapper";
import { getCity, unwrapSuggestion } from "utils/maps";
import { LatLon, Suggestion } from "use-places-autocomplete";
import { AddressControl } from ".";
import { removeProps } from "utils/object";

export const LocationButton = withGoogleApi({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
})(
  geolocated({
    positionOptions: {
      enableHighAccuracy: true
    }
    // userDecisionTimeout: 5000
  })(
    ({
      loaded,
      coords,
      timestamp,
      isGeolocationAvailable,
      isGeolocationEnabled,
      positionError,
      city,
      setCity,
      location,
      setLocation,
      onLocationChange,
      onSuggestionSelect,
      inputProps,
      ...props
    }: IconButtonProps & {
      loaded: boolean;
      google: typeof google;
      /**
       * The Geolocation API's coords object containing latitude, longitude, and accuracy and also optionally containing altitude, altitudeAccuracy, heading and speed.
       */
      coords: GeolocationCoordinates | null;
      /**
       * The Geolocation API's timestamp value representing the time at which the location was retrieved.
       */
      timestamp?: EpochTimeStamp;
      /**
       * Flag indicating that the browser supports the Geolocation API.
       */
      isGeolocationAvailable?: boolean;
      /**
       * Flag indicating that the user has allowed the use of the Geolocation API. It optimistically presumes they did until they either explicitly deny it or userDecisionTimeout (if set) has elapsed and they haven't allowed it yet.
       */
      isGeolocationEnabled?: boolean;
      /**
       * The Geolocation API's PositionError object resulting from an error occurring in the API call.
       */
      positionError?: GeolocationPositionError;
      city: string | null;
      setCity: (city: string | null) => void;
      location: LatLon;
      setLocation: (location: LatLon) => void;
      onLocationChange?: (coordinates?: LatLon) => void;
      onSuggestionSelect?: () => void;
      inputProps: InputProps;
    }) => {
      const toast = useToast();
      const { colorMode } = useColorMode();
      const isDark = colorMode === "dark";
      const isOffline = loaded && !props.google;

      useEffect(() => {
        if (coords && !location) {
          setLocation({ lat: coords.latitude, lng: coords.longitude });
        }
      }, [coords, location]);

      useEffect(() => {
        const xhr = async () => {
          if (!city && loaded && props.google && location) {
            try {
              const geocoder: google.maps.Geocoder =
                new props.google.maps.Geocoder();
              const { results } = await geocoder.geocode({
                location: { lat: location.lat, lng: location.lng },
                componentRestrictions: {
                  country: "FR"
                }
              });
              const city = getCity(results[0]);
              if (city) setCity(city);
            } catch (error) {
              // toast({
              //   status: "error",
              //   title:
              //     "Une erreur est survenue, vous pouvez laisser un message sur le forum."
              // });
            }
          }
        };
        xhr();
      }, [loaded, props.google, location]);

      if (!loaded) return <Spinner />;

      return (
        <Flex alignItems="center">
          {/* <Tooltip label={city ? "Changer la ville" : ""}> */}
          <IconButton
            aria-label="Définir la ville"
            icon={<FaMapMarkerAlt />}
            {...removeProps(props, ["google"])}
          />
          {/* </Tooltip> */}
          <AddressControl
            inputProps={inputProps}
            isMultiple={false}
            size="sm"
            onSuggestionSelect={async (suggestion: Suggestion) => {
              const { lat, lng, city } = await unwrapSuggestion(suggestion);
              if (lat && lng) setLocation({ lat, lng });
              if (city) setCity(city);
              onSuggestionSelect && onSuggestionSelect();
            }}
          />
        </Flex>
      );
    }
  )
);
