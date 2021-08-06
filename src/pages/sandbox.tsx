import React, { useState, useEffect } from "react";
import { Layout } from "features/layout";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { Libraries } from "@react-google-maps/api/dist/utils/make-load-script-url";

const libraries: Libraries = ["places"];

const Sandbox: React.FC = () => {
  // const { isLoaded, loadError } = useJsApiLoader({
  //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
  //   libraries
  // });
  // const [autocomplete, setAutocomplete] = useState(null);

  // const onLoad = (autocompleteInstance) => {
  //   console.log("autocomplete: ", autocomplete);
  //   setAutocomplete(autocompleteInstance);
  // };

  // const onPlaceChanged = () => {
  //   if (autocomplete) {
  //     console.log(autocomplete.getPlace());
  //   } else {
  //     console.log("Autocomplete is not loaded yet!");
  //   }
  // };
  return (
    <Layout>
      {/* {isLoaded && (
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            placeholder="Customized your placeholder"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              left: "50%",
              marginLeft: "-120px"
            }}
          />
        </Autocomplete>
      )} */}
    </Layout>
  );
};

export default Sandbox;
