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
import { loadMapsSdk } from "utils/maps";

export const AddressControl = ({
  name,
  defaultValue,
  errors,
  control,
  isRequired = false,
  noLabel = false,
  mb,
  onSuggestionSelect,
  onClick,
  ...props
}: {
  name: string;
  defaultValue?: string;
  value?: string;
  errors: { [key: string]: string };
  control: Control<any>;
  isRequired?: boolean;
  noLabel?: boolean;
  mb?: number;
  onSuggestionSelect?: (suggestion: Suggestion) => void;
  onClick?: () => void;
  onChange?: (description: string) => void;
}) => {
  const [controlRules, setControlRules] = useState<{
    required?: string | boolean;
  }>({});

  const [mapsSdkState, setMapsSdkState] = useState({
    loaded: false,
    loading: false
  });

  useEffect(() => {
    const xhr = async () => {
      try {
        setMapsSdkState({ loaded: false, loading: true });
        await loadMapsSdk();
        setMapsSdkState({ loaded: true, loading: false });
        if (isRequired)
          setControlRules({ required: "Veuillez saisir une adresse" });
      } catch (error) {
        console.log(error);
        setMapsSdkState({ loaded: false, loading: false });
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
        {!noLabel && <FormLabel>Adresse</FormLabel>}
        {mapsSdkState.loading ? (
          <Spinner />
        ) : (
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            rules={controlRules}
            render={({ onChange, value }) => {
              return (
                <AutoCompletePlacesControl
                  onClick={onClick}
                  onChange={(description: string) => {
                    onChange(description);
                    props.onChange && props.onChange(description);
                  }}
                  onSuggestionSelect={onSuggestionSelect}
                  value={typeof props.value === "string" ? props.value : value}
                  placeholder="Cliquez ici pour saisir une adresse..."
                />
              );
            }}
          />
        )}
        <FormErrorMessage>
          <ErrorMessage errors={errors} name={name} />
        </FormErrorMessage>
      </FormControl>
    </>
  );
};
