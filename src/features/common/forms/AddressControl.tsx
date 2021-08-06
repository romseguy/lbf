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
import { Suggestion } from "use-places-autocomplete";
import { loadMapsApi } from "utils/maps";

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
        ) : (
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
        )}
        <FormErrorMessage>
          <ErrorMessage errors={errors} name={name} />
        </FormErrorMessage>
      </FormControl>
    </>
  );
};
