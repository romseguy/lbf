import {
  getDetails,
  getGeocode,
  getLatLng,
  LatLon,
  Suggestion
} from "use-places-autocomplete";

export const unwrapSuggestion = async (suggestion: Suggestion) => {
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
