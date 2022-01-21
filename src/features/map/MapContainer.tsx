import { Alert, AlertIcon, Portal, Spinner } from "@chakra-ui/react";
import React, { useState } from "react";
import { LatLon } from "use-places-autocomplete";
import { withGoogleApi } from "features/map/GoogleApiWrapper";
import { Map, SizeMap } from "features/map/Map";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { hasItems } from "utils/array";
import { css } from "twin.macro";

export const MapContainer = withGoogleApi({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
})(
  ({
    events,
    orgs,
    ...props
  }: {
    google: typeof google;
    loaded: boolean;
    events?: IEvent[];
    orgs?: IOrg[];
    center: LatLon;
  }) => {
    //#region local state
    const canDisplay = props.loaded && props.google && hasItems(events || orgs);
    const isOffline = props.loaded && !props.google;
    const [center, setCenter] = useState<LatLon>(props.center);
    const [size, setSize] = useState<SizeMap>({
      defaultSize: { enabled: true },
      fullSize: { enabled: false }
    });
    //#endregion

    if (!props.loaded) return <Spinner p={3} />;

    if (!canDisplay) {
      if (isOffline) {
        return (
          <Alert status="error">
            <AlertIcon />
            Échec du chargement de la carte. Êtes-vous connecté à internet ?
          </Alert>
        );
      }

      return (
        <Alert status="warning" mb={3}>
          <AlertIcon />
          Il n'y a encore rien à afficher sur cette carte, revenez plus tard !
        </Alert>
      );
    }

    if (size.fullSize.enabled) {
      return (
        <Portal>
          <div
            css={css`
              position: fixed;
              left: 0px;
              top: 0px;
              width: 100vw;
              height: 100vh;
            `}
          >
            <Map
              center={center}
              events={events}
              orgs={orgs}
              size={size}
              style={{}}
              onFullscreenControlClick={(isFull: boolean) => {
                setSize({
                  defaultSize: { enabled: !isFull },
                  fullSize: { enabled: isFull }
                });
              }}
            />
          </div>
        </Portal>
      );
    }

    return (
      <Map
        center={center}
        events={events}
        orgs={orgs}
        size={size}
        style={{
          position: "relative",
          height: "340px",
          flex: 1
        }}
        onFullscreenControlClick={(isFull: boolean) => {
          setSize({
            defaultSize: { enabled: !isFull },
            fullSize: { enabled: isFull }
          });
        }}
      />
    );
  }
);
