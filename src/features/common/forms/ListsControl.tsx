import {
  FormControl,
  FormControlProps,
  FormLabel,
  FormErrorMessage
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { ErrorMessage } from "@hookform/error-message";
import React, { useEffect } from "react";
import {
  Control,
  Controller,
  DeepMap,
  FieldError,
  FieldValues,
  UseFormMethods,
  useWatch
} from "react-hook-form";
import { MultiSelect } from "features/common";
import { IOrgList } from "models/Org";
import { hasItems } from "utils/array";

export const ListsControl = ({
  control,
  errors,
  setError,
  isMultiple = true,
  isRequired = false,
  label = "Visibilité",
  lists,
  name,
  onChange,
  ...props
}: FormControlProps & {
  control: Control<FieldValues>;
  errors: DeepMap<FieldValues, FieldError>;
  setError?: UseFormMethods["setError"];
  isMultiple?: boolean;
  isRequired?: boolean;
  label?: string;
  lists?: IOrgList[];
  name: string;
  onChange?: () => void;
}) => {
  const value = useWatch<string[]>({ control, name }) || "";

  useEffect(() => {
    if (isRequired && setError && !hasItems(value)) {
      setError(name, { message: "" });
    }
  }, [value]);

  if (!isMultiple) {
    return (
      <FormControl
        isInvalid={!!errors[name]}
        isRequired={isRequired}
        {...props}
      >
        <FormLabel>{label}</FormLabel>

        <Controller
          name={name}
          control={control}
          defaultValue={[]}
          render={(renderProps) => {
            return (
              <MultiSelect
                isMulti={false}
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
                placeholder="Sélectionner une liste"
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
  }

  return (
    <FormControl isInvalid={!!errors[name]} isRequired={isRequired} {...props}>
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
