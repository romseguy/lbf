import { Loader } from "@googlemaps/js-api-loader";

let loader: Loader;

export async function loadMapsApi() {
  if (!loader) {
    loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
      libraries: ["places"]
    });
  }

  return loader.load();
}
