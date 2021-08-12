import { Loader } from "@googlemaps/js-api-loader";
import {
  getDetails,
  getGeocode,
  getLatLng,
  LatLon
} from "use-places-autocomplete";

let loader: Loader;
let maps: any;

export async function loadMapsSdk() {
  if (!maps) {
    if (!loader) {
      loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
        libraries: ["places"]
      });
    }

    const res = await loader.load();
    maps = res.maps;
  }

  return maps;
}

export const unwrapSuggestion = async (suggestion: any) => {
  const details: any = await getDetails({
    placeId: suggestion.place_id,
    fields: ["address_component"]
  });

  let city;

  details.address_components.forEach((component: any) => {
    const types = component.types;

    if (types.indexOf("locality") > -1) {
      city = component.long_name;
    }
  });

  const results = await getGeocode({ address: suggestion.description });
  const { lat, lng } = await getLatLng(results[0]);

  return { lat, lng, city };
};

const TILE_SIZE = 256;

export function latLng2World({ lat, lng }: LatLon) {
  const sin = Math.sin((lat * Math.PI) / 180);
  const x = lng / 360 + 0.5;
  let y = 0.5 - (0.25 * Math.log((1 + sin) / (1 - sin))) / Math.PI;

  y =
    y < -1 // .
      ? -1
      : y > 1
      ? 1
      : y;
  return { x, y };
}

export function world2Screen({ x, y }: { x: number; y: number }, zoom: number) {
  const scale = Math.pow(2, zoom);
  return {
    x: x * scale * TILE_SIZE,
    y: y * scale * TILE_SIZE
  };
}
