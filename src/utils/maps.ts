import {
  GeocodeResult,
  getDetails,
  getGeocode,
  getLatLng,
  LatLon,
  Suggestion
} from "use-places-autocomplete";

export const markerIcons: {
  [key: string]: { paths: string[]; viewBox: string };
} = {
  event: {
    paths: [
      "M10.8889,5.5 L3.11111,5.5 L3.11111,7.05556 L10.8889,7.05556 L10.8889,5.5 Z M12.4444,1.05556 L11.6667,1.05556 L11.6667,0 L10.1111,0 L10.1111,1.05556 L3.88889,1.05556 L3.88889,0 L2.33333,0 L2.33333,1.05556 L1.55556,1.05556 C0.692222,1.05556 0.00777777,1.75556 0.00777777,2.61111 L0,12.5 C0,13.3556 0.692222,14 1.55556,14 L12.4444,14 C13.3,14 14,13.3556 14,12.5 L14,2.61111 C14,1.75556 13.3,1.05556 12.4444,1.05556 Z M12.4444,12.5 L1.55556,12.5 L1.55556,3.94444 L12.4444,3.94444 L12.4444,12.5 Z M8.55556,8.61111 L3.11111,8.61111 L3.11111,10.1667 L8.55556,10.1667 L8.55556,8.61111 Z"
    ],
    viewBox: "0 0 14 14"
  },
  org: {
    paths: [
      "M349.1 334.7c-11.2-4-29.5-4.2-37.6-7.3-5.6-2.2-14.5-4.6-17.4-8.1-2.9-3.5-2.9-28.5-2.9-28.5s7-6.6 9.9-14c2.9-7.3 4.8-27.5 4.8-27.5s6.6 2.8 9.2-10.4c2.2-11.4 6.4-17.4 5.3-25.8-1.2-8.4-5.8-6.4-5.8-6.4s5.8-8.5 5.8-37.4c0-29.8-22.5-59.1-64.6-59.1-42 0-64.7 29.4-64.7 59.1 0 28.9 5.7 37.4 5.7 37.4s-4.7-2-5.8 6.4c-1.2 8.4 3 14.4 5.3 25.8 2.6 13.3 9.2 10.4 9.2 10.4s1.9 20.1 4.8 27.5c2.9 7.4 9.9 14 9.9 14s0 25-2.9 28.5-11.8 5.9-17.4 8c-8 3.1-26.3 3.5-37.6 7.5-11.2 4-45.8 22.2-45.8 67.2h278.3c.1-45.1-34.5-63.3-45.7-67.3z",
      "M140 286s23.9-.8 33.4-9.3c-15.5-23.5-7.1-50.9-10.3-76.5-3.2-25.5-17.7-40.8-46.7-40.8h-.4c-28 0-43.1 15.2-46.3 40.8-3.2 25.5 5.7 56-10.2 76.5C69 285.3 93 285 93 285s1 14.4-1 16.8c-2 2.4-7.9 4.7-12 5.5-8.8 1.9-18.1 4.5-25.9 7.2-7.8 2.7-22.6 17.2-22.6 37.2h80.3c2.2-8 17.3-22.3 32-29.8 9-4.6 17.9-4.3 24.7-5.2 0 0 3.8-6-8.7-8.3 0 0-17.2-4.3-19.2-6.7-1.9-2.2-.6-15.7-.6-15.7zM372 286s-23.9-.8-33.4-9.3c15.5-23.5 7.1-50.9 10.3-76.5 3.2-25.5 17.7-40.8 46.7-40.8h.4c28 0 43.1 15.2 46.3 40.8 3.2 25.5-5.7 56 10.2 76.5-9.5 8.6-33.5 8.3-33.5 8.3s-1 14.4 1 16.8c2 2.4 7.9 4.7 12 5.5 8.8 1.9 18.1 4.5 25.9 7.2 7.8 2.7 22.6 17.2 22.6 37.2h-80.3c-2.2-8-17.3-22.3-32-29.8-9-4.6-17.9-4.3-24.7-5.2 0 0-3.8-6 8.7-8.3 0 0 17.2-4.3 19.2-6.7 1.9-2.2.6-15.7.6-15.7z"
    ],
    viewBox: "0 0 512 512"
  },
  heart: {
    paths: [
      "M340.8,83C307,83,276,98.8,256,124.8c-20-26-51-41.8-84.8-41.8C112.1,83,64,131.3,64,190.7c0,27.9,10.6,54.4,29.9,74.6 L245.1,418l10.9,11l10.9-11l148.3-149.8c21-20.3,32.8-47.9,32.8-77.5C448,131.3,399.9,83,340.8,83L340.8,83z"
    ],
    viewBox: "0 0 512 512"
  },
  gear: {
    paths: [
      "M462,280.72v-49.44l-46.414-16.48c-3.903-15.098-9.922-29.343-17.675-42.447l0.063-0.064l21.168-44.473l-34.96-34.96 l-44.471,21.167l-0.064,0.064c-13.104-7.753-27.352-13.772-42.447-17.673L280.72,50h-49.44L214.8,96.415 c-15.096,3.9-29.343,9.919-42.447,17.675l-0.064-0.066l-44.473-21.167l-34.96,34.96l21.167,44.473l0.066,0.064 c-7.755,13.104-13.774,27.352-17.675,42.447L50,231.28v49.44l46.415,16.48c3.9,15.096,9.921,29.343,17.675,42.447l-0.066,0.064 l-21.167,44.471l34.96,34.96l44.473-21.168l0.064-0.063c13.104,7.753,27.352,13.771,42.447,17.675L231.28,462h49.44l16.48-46.414 c15.096-3.903,29.343-9.922,42.447-17.675l0.064,0.063l44.471,21.168l34.96-34.96l-21.168-44.471l-0.063-0.064 c7.753-13.104,13.771-27.352,17.675-42.447L462,280.72z M256,338.4c-45.509,0-82.4-36.892-82.4-82.4c0-45.509,36.891-82.4,82.4-82.4 c45.509,0,82.4,36.891,82.4,82.4C338.4,301.509,301.509,338.4,256,338.4z"
    ],
    viewBox: "0 0 512 512"
  },
  vader: {
    paths: [
      "M 454.5779,419.82295 328.03631,394.69439 282.01503,515.21933 210.30518,407.97233 92.539234,460.65437 117.66778,334.11278 -2.8571457,288.09151 104.38984,216.38165 51.707798,98.615703 178.2494,123.74425 224.27067,3.2193247 295.98052,110.46631 413.74648,57.784277 388.61793,184.32587 509.14286,230.34714 401.89587,302.057 z"
    ],
    viewBox: "0 0 512 512"
  }
};

export const getMarkerUrl = ({
  id,
  fill,
  height = 50,
  width = 50
}: {
  id: string;
  width?: number;
  height?: number;
  fill: string;
}) => {
  const { paths, viewBox } = markerIcons[id];

  return `data:image/svg+xml;base64, ${window.btoa(
    `<svg fill="${fill}" height="${height}" viewBox="${viewBox}" width="${width}" xmlns="http://www.w3.org/2000/svg"><g>${paths.map(
      (path) => `<path d="${path}"/>`
    )}</g></svg>`
  )}`;
};

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
