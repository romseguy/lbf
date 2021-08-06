import React, { ChangeEvent } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import { FormControlProps, List, ListItem } from "@chakra-ui/react";
import { Input } from "features/common";
import usePlacesAutocomplete, { Suggestion } from "use-places-autocomplete";

type ControlProps = FormControlProps & {
  onChange: (description: string) => void;
  placeholder?: string;
  value?: string;
  onSuggestionSelect?: (suggestion: Suggestion) => void;
};

export const AutoCompletePlacesControl = ({
  onChange,
  placeholder,
  value,
  onSuggestionSelect
}: ControlProps) => {
  const {
    ready,
    value: autoCompleteValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: {
        country: "fr"
      }
    },
    debounce: 300
    // callbackName: "initMap"
  });

  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect = (suggestion: Suggestion) => () => {
    const { description } = suggestion;
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    setValue(description, false);
    onChange(description);
    onSuggestionSelect && onSuggestionSelect(suggestion);
    clearSuggestions();
  };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text }
      } = suggestion;

      return (
        <ListItem
          key={place_id}
          onClick={handleSelect(suggestion)}
          cursor="pointer"
          _hover={{ boxShadow: "outline" }}
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </ListItem>
      );
    });

  return (
    <div ref={ref}>
      <Input
        value={value || autoCompleteValue}
        onChange={(e) => {
          handleInput(e);
          onChange(e);
        }}
        autoComplete="off"
        placeholder={placeholder}
      />
      {status === "OK" && (
        <List className="suggestions" spacing={3} pt={2} px={5}>
          {renderSuggestions()}
        </List>
      )}
    </div>
  );
};
