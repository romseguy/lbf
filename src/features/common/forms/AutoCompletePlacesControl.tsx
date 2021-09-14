import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import {
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  useColorMode
} from "@chakra-ui/react";
import { Input } from "features/common";
import usePlacesAutocomplete, { Suggestion } from "use-places-autocomplete";
import { FaMapMarkedAlt } from "react-icons/fa";
import { EmailIcon } from "@chakra-ui/icons";
import { css } from "twin.macro";

let cachedVal = "";
const acceptedKeys = ["ArrowUp", "ArrowDown", "Escape", "Enter"];

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
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

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

  const [currIndex, setCurrIndex] = useState<number | null>(null);
  const dismissSuggestions = () => {
    setCurrIndex(null);
    clearSuggestions();
  };
  const hasSuggestions = status === "OK";

  useEffect(() => {
    if (typeof value === "string") {
      setAutoCompleteValue(value, false);
    }
  }, [value]);

  const ref = useOnclickOutside(() => {
    dismissSuggestions();
  });

  const handleSelect = (suggestion: Suggestion) => () => {
    const { description } = suggestion;
    setAutoCompleteValue(description, false);
    onChange(description);
    onSuggestionSelect && onSuggestionSelect(suggestion);
    dismissSuggestions();
  };

  const renderSuggestions = () =>
    data.map((suggestion: Suggestion, idx: number) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text }
      } = suggestion;
      const isCurrent = idx === currIndex;

      let bg = isDark ? "gray.600" : "white";
      let color = isDark ? "white" : "black";

      if (isCurrent) {
        if (isDark) {
          bg = "white";
          color = "black";
        } else {
          bg = "black";
          color = "white";
        }
      }

      return (
        <ListItem
          key={place_id}
          cursor="pointer"
          bg={bg}
          color={color}
          borderRadius="lg"
          px={3}
          py={2}
          _hover={{ boxShadow: "outline" }}
          onClick={handleSelect(suggestion)}
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
            cachedVal = e.target.value;
            onChange(e.target.value);
          }}
          autoComplete="off"
          placeholder={placeholder}
          pl={10}
          onClick={onClick}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (!hasSuggestions || !acceptedKeys.includes(e.key)) return;

            if (e.key === "Enter" || e.key === "Escape") {
              e.preventDefault();
              dismissSuggestions();
              return;
            }

            let nextIndex: number | null;

            if (e.key === "ArrowUp") {
              e.preventDefault();
              nextIndex = currIndex ?? data.length;
              nextIndex = nextIndex > 0 ? nextIndex - 1 : null;
            } else {
              nextIndex = currIndex ?? -1;
              nextIndex = nextIndex < data.length - 1 ? nextIndex + 1 : null;
            }

            setCurrIndex(nextIndex);
            if (nextIndex === null) setAutoCompleteValue(cachedVal);
            else setAutoCompleteValue(data[nextIndex].description, false);
          }}
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
