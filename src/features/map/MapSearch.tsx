import type { LatLon } from "use-places-autocomplete";
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
  const defaultValue = "Comiac, France";
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
        defaultValue={defaultValue}
        value={value}
        noLabel
        mb={3}
        onChange={(description) => {
          setValue(description);
        }}
        onClick={() => {
          setValue("");
        }}
        onSuggestionSelect={async (suggestion) => {
          if (suggestion) {
            setCenter(await unwrapSuggestion(suggestion));
          }
        }}
      />
    </form>
  );
};
