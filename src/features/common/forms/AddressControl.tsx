import {
  Control,
  Controller,
  FieldName,
  SetFieldValue,
  SetValueConfig
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { AutoCompletePlacesControl } from "features/common";
import useScript from "hooks/useScript";

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
  onSuggestionSelect?: (suggestion: any) => void;
}) => {
  const libStatus = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&callback=initMap&libraries=places`
  );

  let controlRules: { required?: string | boolean } = {};

  if (isRequired) {
    controlRules.required = "Veuillez saisir une adresse";
  }

  if (libStatus === "error") {
    controlRules.required = undefined;
  }

  return (
    <FormControl
      id={name}
      isRequired={!!controlRules.required}
      isInvalid={!!errors[name]}
      mb={mb}
    >
      <FormLabel>Adresse</FormLabel>
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
      <FormErrorMessage>
        <ErrorMessage errors={errors} name={name} />
      </FormErrorMessage>
    </FormControl>
  );
};
