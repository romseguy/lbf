import type { LatLon, Suggestion } from "use-places-autocomplete";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AddressControl } from "features/common";
import { unwrapSuggestion } from "utils/maps";

export const MapSearch = ({
  setCenter,
  isVisible
}: {
  setCenter: (center: LatLon) => void;
  isVisible: boolean;
}) => {
  const defaultValue = "";
  const [value, setValue] = useState(defaultValue);

  const {
    control,
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    watch,
    getValues
  } = useForm({
    defaultValues: {
      eventAddress: defaultValue
    },
    mode: "onChange"
  });

  const onChange = () => {};
  const onSubmit = () => {};

  if (!isVisible) return null;

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <AddressControl
        name="eventAddress"
        control={control}
        errors={errors}
        value={value}
        noLabel
        mb={3}
        isMultiple={false}
        onChange={(description: string) => {
          setValue(description);
        }}
        onClick={() => {
          setValue("");
        }}
        onSuggestionSelect={async (suggestion: Suggestion) => {
          if (suggestion) {
            setCenter(await unwrapSuggestion(suggestion));
          }
        }}
      />
    </form>
  );
};
