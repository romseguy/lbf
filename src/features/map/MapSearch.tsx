import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { LatLon, Suggestion } from "use-places-autocomplete";
import { AddressControl } from "features/common";
import { unwrapSuggestion } from "utils/maps";

export const MapSearch = ({
  entityAddress = "",
  isVisible,
  setCenter,
  setZoomLevel
}: {
  entityAddress?: string;
  setCenter: (center: LatLon) => void;
  isVisible: boolean;
  setZoomLevel?: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [value, setValue] = useState(entityAddress);
  console.log("🚀 ~ file: MapSearch.tsx:19 ~ value:", value);

  const { control, handleSubmit, errors } = useForm({
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
        isMultiple={false}
        control={control}
        errors={errors}
        value={value}
        noLabel
        mb={3}
        onChange={(description: string) => {
          setValue(description);
        }}
        onClick={() => {
          setValue("");
        }}
        onSuggestionSelect={async (suggestion: Suggestion) => {
          if (suggestion) {
            const { city, lat, lng } = await unwrapSuggestion(suggestion);
            setValue(city);
            setCenter({ lat, lng });
            setZoomLevel && setZoomLevel(12);
          }
        }}
      />
    </form>
  );
};
