import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React from "react";
import {
  Control,
  Controller,
  DeepMap,
  FieldError,
  FieldValues
} from "react-hook-form";
import { MultiSelect } from "features/common";
import { IOrgList } from "models/Org";

export const ListsControl = ({
  control,
  errors,
  isRequired = false,
  label = "Visibilité",
  lists,
  name,
  onChange
}: {
  control: Control<FieldValues>;
  errors: DeepMap<FieldValues, FieldError>;
  isRequired?: boolean;
  label?: string;
  lists?: IOrgList[];
  name: string;
  onChange?: () => void;
}) => {
  return (
    <FormControl isInvalid={!!errors[name]} isRequired={isRequired} mb={3}>
      <FormLabel>{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={(renderProps) => {
          return (
            <MultiSelect
              value={renderProps.value}
              onChange={(...args) => {
                renderProps.onChange(...args);
                onChange && onChange();
              }}
              options={
                lists
                  ? lists.map((list) => ({
                      label: list.listName,
                      value: list.listName
                    }))
                  : []
              }
              allOptionLabel="Toutes les listes"
              placeholder="Sélectionner une ou plusieurs listes"
              noOptionsMessage={() => "Aucun résultat"}
              isClearable
              isSearchable={false}
              className="react-select-container"
              classNamePrefix="react-select"
              styles={{
                control: (defaultStyles: any) => {
                  return {
                    ...defaultStyles,
                    borderColor: "#e2e8f0",
                    paddingLeft: "8px"
                  };
                },
                placeholder: () => {
                  return {
                    color: "#A0AEC0"
                  };
                }
              }}
            />
          );
        }}
      />
      <FormErrorMessage>
        <ErrorMessage errors={errors} name={name} />
      </FormErrorMessage>
    </FormControl>
  );
};
