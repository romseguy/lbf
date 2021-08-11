import React, { ChangeEvent, useEffect } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import { InputGroup, InputLeftElement, List, ListItem } from "@chakra-ui/react";
import { Input } from "features/common";
import usePlacesAutocomplete, { Suggestion } from "use-places-autocomplete";
import { FaMapMarkedAlt } from "react-icons/fa";
import { EmailIcon } from "@chakra-ui/icons";

type ControlProps = {
  onChange: (description: string) => void;
  value?: string;
  placeholder?: string;
  onSuggestionSelect?: (suggestion: Suggestion) => void;
  onClick?: () => void;
};

export const AutoCompletePlacesControl = ({
  onChange,
  value,
  placeholder,
  onSuggestionSelect,
  onClick
}: ControlProps) => {
  const {
    ready,
    value: autoCompleteValue,
    suggestions: { status, data },
    setValue: setAutoCompleteValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: {
        country: "fr"
      }
    },
    debounce: 300
  });

  useEffect(() => {
    if (typeof value === "string") {
      setAutoCompleteValue(value, false);
    }
  }, [value]);

  const ref = useOnclickOutside(() => {
    clearSuggestions();
  });

  const handleSelect = (suggestion: Suggestion) => () => {
    const { description } = suggestion;
    setAutoCompleteValue(description, false);
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
      <InputGroup>
        <InputLeftElement pointerEvents="none" children={<FaMapMarkedAlt />} />

        <Input
          value={autoCompleteValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setAutoCompleteValue(e.target.value);
            onChange(e.target.value);
          }}
          autoComplete="off"
          placeholder={placeholder}
          pl={10}
          onClick={onClick}
        />
      </InputGroup>

      {status === "OK" && (
        <List className="suggestions" spacing={3} pt={2} px={5}>
          {renderSuggestions()}
        </List>
      )}
    </div>
  );
};
