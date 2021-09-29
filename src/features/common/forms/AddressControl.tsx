import React from "react";
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
import { withGoogleApi } from "features/map/GoogleApiWrapper";

export const AddressControl = withGoogleApi({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
})(
  ({
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
    google: any;
    loaded: boolean;
    name: string;
    defaultValue?: string;
    value?: string;
    errors: { [key: string]: string };
    control: Control<any>;
    isRequired?: boolean;
    noLabel?: boolean;
    mb?: number;
    placeholder?: string;
    onSuggestionSelect?: (suggestion: Suggestion) => void;
    onClick?: () => void;
    onChange?: (description: string) => void;
  }) => {
    const controlRules: {
      required?: boolean;
    } = {
      required: isRequired && props.google
    };

    let loaded = props.loaded && props.google;

    if (process.env.NODE_ENV === "development") {
      if (props.loaded && !props.google) loaded = true;
    }

    return (
      <>
        <FormControl
          id={name}
          isRequired={!!controlRules.required}
          isInvalid={!!errors[name]}
          mb={mb}
        >
          {!noLabel && <FormLabel>Adresse</FormLabel>}
          {loaded ? (
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
                      onChange(description.replace(", France", ""));
                      props.onChange &&
                        props.onChange(description.replace(", France", ""));
                    }}
                    onSuggestionSelect={onSuggestionSelect}
                    value={
                      typeof props.value === "string" ? props.value : value
                    }
                    placeholder={
                      props.placeholder ||
                      "Cliquez ici pour saisir une adresse..."
                    }
                  />
                );
              }}
            />
          ) : (
            <Spinner />
          )}
          <FormErrorMessage>
            <ErrorMessage errors={errors} name={name} />
          </FormErrorMessage>
        </FormControl>
      </>
    );
  }
);
