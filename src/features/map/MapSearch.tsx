import type { LatLon, Suggestion } from "use-places-autocomplete";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AddressControl } from "features/common";
import { unwrapSuggestion } from "utils/maps";

export const MapSearch = ({
  entityAddress = "",
  setCenter,
  isVisible
}: {
  entityAddress?: string;
  setCenter: (center: LatLon) => void;
  isVisible: boolean;
}) => {
  const [value, setValue] = useState(entityAddress);

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
      entityAddress
    },
    mode: "onChange"
  });

  const onChange = () => {};
  const onSubmit = () => {};

  if (!isVisible) return null;

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <AddressControl
        name="entityAddress"
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
