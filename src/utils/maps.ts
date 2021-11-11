import {
  GeocodeResult,
  getDetails,
  getGeocode,
  getLatLng,
  LatLon,
  Suggestion
} from "use-places-autocomplete";

export const getCity = (
  result: google.maps.places.PlaceResult | google.maps.GeocoderResult | string
) => {
  //console.log("getCity: result", result);
  let city = "Paris";

  if (typeof result === "string") return city;

  result.address_components?.forEach(
    (address_component: google.maps.GeocoderAddressComponent) => {
      if (address_component.types.indexOf("locality") !== -1) {
        city = address_component.long_name || address_component.short_name;
      }
    }
  );

  return city;
};

export const unwrapSuggestion = async (suggestion: Suggestion) => {
  //console.log("unwrapSuggestion: Suggestion", suggestion);

  // const placeResult = await getDetails({
  //   placeId: suggestion.place_id,
  //   fields: ["address_component"]
  // });
  // console.log("unwrapSuggestion: PlaceResult", placeResult);

  const results = await getGeocode({ address: suggestion.description });
  //console.log("unwrapSuggestion: GeocoderResult[]", results);

  const { lat, lng } = await getLatLng(results[0]);
  //console.log("unwrapSuggestion: lat, lng", lat, lng);

  const city = getCity(results[0]);
  //console.log("unwrapSuggestion: city", city);

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

const rad = function (x: number) {
  return (x * Math.PI) / 180;
};

export const getDistance = function (p1: LatLon, p2: LatLon) {
  const R = 6378137; // Earth's mean radius in meter
  const dLat = rad(p2.lat - p1.lat);
  const dLong = rad(p2.lng - p1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) *
      Math.cos(rad(p2.lat)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d); // returns the distance in meter
};
