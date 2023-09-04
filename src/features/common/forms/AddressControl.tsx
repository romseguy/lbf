import { DeleteIcon, EmailIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputProps,
  Spinner,
  SpaceProps,
  Box,
  IconButton,
  InputRightAddon,
  useColorMode,
  CSSObject
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React from "react";
import { Control, Controller, useFieldArray } from "react-hook-form";
import { Suggestion } from "use-places-autocomplete";
import { AutoCompletePlacesControl, Link } from "features/common";
import { withGoogleApi } from "features/map/GoogleApiWrapper";

import { zIndex } from "utils/string";
const { getEnv } = require("utils/env");

type AddressControlValue = [{ address: string }] | null;

export const AddressControl = withGoogleApi({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
})(
  ({
    loaded,
    name,
    label = "Adresse",
    labelAdd = "Ajouter une adresse postale",
    errors,
    control,
    setValue,
    value,
    placeholder = "Saisir une adresse...",
    isRequired = false,
    noLabel = false,
    isMultiple = true,
    rightAddon,
    containerProps = {},
    onSuggestionSelect,
    onClick,
    onChange,
    ...props
  }: SpaceProps & {
    google: typeof google;
    loaded: boolean;
    name?: string;
    label?: string;
    labelAdd?: string;
    errors: { [key: string]: string };
    control?: Control<any>;
    setValue: (name: string, value: AddressControlValue) => void;
    value?: string;
    placeholder?: string;
    inputProps?: InputProps;
    isRequired?: boolean;
    noLabel?: boolean;
    isMultiple?: boolean;
    rightAddon?: React.ReactNode;
    containerProps?: CSSObject;
    onSuggestionSelect?: (suggestion: Suggestion) => void;
    onClick?: () => void;
    onChange?: (description: string) => void;
  }) => {
    console.log("🚀 ~ file: AddressControl.tsx:70 ~ value:", value);
    const { colorMode } = useColorMode();
    const isDark = colorMode === "dark";

    const controlRules: {
      required?: boolean;
    } = {
      required: isRequired && !!props.google
    };

    let isGoogleApiLoaded = loaded && !!props.google;

    if (getEnv() === "development") {
      if (loaded && !props.google) isGoogleApiLoaded = true;
    }

    if (!isMultiple) {
      if (errors && name) {
        // Control is part of a form
        return (
          <FormControl
            isRequired={!!controlRules.required}
            isInvalid={!!errors[name]}
            {...props}
          >
            {!noLabel && <FormLabel>Adresse</FormLabel>}

            {isGoogleApiLoaded ? (
              <Controller
                name={name}
                control={control}
                rules={controlRules}
                render={(renderProps) => {
                  return (
                    <AutoCompletePlacesControl
                      value={
                        typeof value === "string" ? value : renderProps.value
                      }
                      placeholder={placeholder}
                      rightAddon={rightAddon}
                      onClick={onClick}
                      onChange={renderProps.onChange}
                      onSuggestionSelect={onSuggestionSelect}
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
        );
      } else {
        // Control is standalone
        return (
          <AutoCompletePlacesControl
            value={value}
            placeholder={placeholder}
            rightAddon={rightAddon}
            suggestionsListProps={{
              position: "absolute",
              zIndex: zIndex(),
              bg: isDark ? "whiteAlpha.400" : "blackAlpha.600",
              borderRadius: "lg",
              py: 5
            }}
            onClick={onClick}
            onChange={onChange}
            onSuggestionSelect={onSuggestionSelect}
            {...props}
          />
        );
      }
    }

    if (!errors || !name) return null;

    const { fields, append, prepend, remove, swap, move, insert } =
      useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name // unique name for your Field Array
        // keyName: "id", default to "id", you can change the key name
      });

    return (
      <Box mb={3} sx={containerProps}>
        {fields.map((field, index) => {
          return (
            <FormControl
              key={field.id}
              id={name}
              isRequired={isRequired}
              isInvalid={!!(errors[name] && errors[name][index])}
              {...props}
            >
              {!noLabel && (
                <FormLabel m={0}>
                  {index > 0 ? `${index + 1}ème ${label.toLowerCase()}` : label}
                </FormLabel>
              )}
              {isGoogleApiLoaded ? (
                <Controller
                  name={`${name}[${index}].address`}
                  control={control}
                  defaultValue={field.address}
                  rules={controlRules}
                  render={(renderProps) => {
                    return (
                      <AutoCompletePlacesControl
                        value={
                          typeof value === "string" ? value : renderProps.value
                        }
                        placeholder={placeholder}
                        rightAddon={
                          <InputRightAddon
                            p={0}
                            children={
                              <IconButton
                                aria-label={
                                  index + 1 === 1
                                    ? "Supprimer la 1ère adresse"
                                    : `Supprimer la ${index + 1}ème adresse`
                                }
                                icon={<DeleteIcon />}
                                bg="transparent"
                                _hover={{ bg: "transparent", color: "red" }}
                                onClick={() => {
                                  remove(index);

                                  if (fields.length === 1) setValue(name, null);
                                }}
                              />
                            }
                          />
                        }
                        onClick={onClick}
                        onChange={(description: string) => {
                          renderProps.onChange(
                            description.replace(", France", "")
                          );
                        }}
                        onSuggestionSelect={onSuggestionSelect}
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
          );
        })}

        <Link
          fontSize="smaller"
          onClick={() => {
            append({ address: "" });
          }}
        >
          <EmailIcon mr={1} /> {labelAdd}{" "}
          {fields.length > 0 && "supplémentaire"}
        </Link>
      </Box>
    );
  }
);
