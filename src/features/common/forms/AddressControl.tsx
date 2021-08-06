import React, { useEffect, useState } from "react";
import { Control, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Spinner
} from "@chakra-ui/react";
import { AutoCompletePlacesControl } from "features/common";
import { useJsApiLoader } from "@react-google-maps/api";
import { Libraries } from "@react-google-maps/api/dist/utils/make-load-script-url";
import { Suggestion } from "use-places-autocomplete";
import { loadMapsApi } from "utils/maps";

const libraries: Libraries = ["places"];

export const AddressControl = ({
  name,
  defaultValue,
  errors,
  control,
  isRequired = false,
  mb,
  onSuggestionSelect
}: {
  name: string;
  defaultValue?: string;
  errors: { [key: string]: string };
  control: Control<any>;
  isRequired?: boolean;
  mb?: number;
  onSuggestionSelect?: (suggestion: Suggestion) => void;
}) => {
  //let controlRules: { required?: string | boolean } = {};

  // const { isLoaded, loadError } = useJsApiLoader({
  //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
  //   libraries
  // });

  // if (isRequired) {
  //   if (isLoaded) controlRules.required = "Veuillez saisir une adresse";
  // }

  const [controlRules, setControlRules] = useState<{
    required?: string | boolean;
  }>({});

  const [mapsApiState, setMapsApiState] = useState({
    loaded: false,
    loading: false
  });

  useEffect(() => {
    const xhr = async () => {
      try {
        setMapsApiState({ loaded: false, loading: true });
        await loadMapsApi();
        setMapsApiState({ loaded: true, loading: false });
        setControlRules({ required: "Veuillez saisir une adresse" });
      } catch (error) {
        console.log(error);
        setMapsApiState({ loaded: false, loading: false });
      }
    };

    xhr();
  }, []);

  return (
    <>
      <FormControl
        id={name}
        isRequired={!!controlRules.required}
        isInvalid={!!errors[name]}
        mb={mb}
      >
        <FormLabel>Adresse</FormLabel>
        {mapsApiState.loading ? (
          <Spinner />
        ) : mapsApiState.loaded ? (
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            rules={controlRules}
            render={({ onChange, value }) => (
              <AutoCompletePlacesControl
                onChange={onChange}
                onSuggestionSelect={onSuggestionSelect}
                value={value}
                placeholder="Cliquez ici pour saisir une adresse..."
              />
            )}
          />
        ) : (
          <span>error</span>
        )}
        {/* {isLoaded || loadError ? (
        ) : (
        )} */}
        <FormErrorMessage>
          <ErrorMessage errors={errors} name={name} />
        </FormErrorMessage>
      </FormControl>
    </>
  );
};
