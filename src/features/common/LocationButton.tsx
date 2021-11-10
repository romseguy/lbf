import {
  Button,
  ButtonProps,
  Flex,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { geolocated } from "react-geolocated";
import { FaMapMarkerAlt } from "react-icons/fa";
import { withGoogleApi } from "features/map/GoogleApiWrapper";
import { getCity, unwrapSuggestion } from "utils/maps";
import { AddressControl } from ".";
import { LatLon, Suggestion } from "use-places-autocomplete";

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
      google,
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
      ...props
    }: ButtonProps & {
      loaded: boolean;
      google: any;
      /**
       * The Geolocation API's coords object containing latitude, longitude, and accuracy and also optionally containing altitude, altitudeAccuracy, heading and speed.
       */
      coords: GeolocationCoordinates | null;
      /**
       * The Geolocation API's timestamp value representing the time at which the location was retrieved.
       */
      timestamp?: DOMTimeStamp;
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
    }) => {
      const toast = useToast();
      const { colorMode } = useColorMode();
      const isDark = colorMode === "dark";
      const isOffline = loaded && !google;

      useEffect(() => {
        if (coords) {
          setLocation({ lat: coords.latitude, lng: coords.longitude });
        }
      }, [coords]);

      const [showAddressControl, setShowAddressControl] = useState(false);

      useEffect(() => {
        const xhr = async () => {
          console.log(city, loaded, google, location);

          if (!city && loaded && google && location) {
            try {
              const geocoder: google.maps.Geocoder = new google.maps.Geocoder();
              const { results } = await geocoder.geocode({
                location: { lat: location.lat, lng: location.lng },
                componentRestrictions: {
                  country: "FR"
                }
              });
              console.log(results);

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
      }, [loaded, google, location]);

      return (
        <Flex alignItems="center">
          <Button
            leftIcon={<FaMapMarkerAlt />}
            onClick={() => {
              setShowAddressControl(!showAddressControl);
            }}
            {...props}
          >
            {city || "Définir la ville"}
          </Button>
          {showAddressControl && (
            <AddressControl
              isMultiple={false}
              size="sm"
              inputProps={{
                borderRadius: "lg",
                mr: 3
              }}
              onSuggestionSelect={async (suggestion: Suggestion) => {
                const { lat, lng, city } = await unwrapSuggestion(suggestion);
                console.log(suggestion, lat, lng, city);

                if (lat && lng) setLocation({ lat, lng });
                if (city) {
                  setCity(city);
                  setShowAddressControl(false);
                }
              }}
            />
          )}
        </Flex>
      );
    }
  )
);
