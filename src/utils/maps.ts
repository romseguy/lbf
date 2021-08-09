import { Loader } from "@googlemaps/js-api-loader";

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
