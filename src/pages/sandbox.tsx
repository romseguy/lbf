import React from "react";
import { styled } from "twin.macro";
// import { RTEditor } from "features/common/forms/RTEditor";
// import { Button } from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  AutoCompleteTag
} from "@choc-ui/chakra-autocomplete";
import { Stack, Text } from "@chakra-ui/react";

const SandboxStyles = styled("div")((props) => {
  return `
  `;
});

const Sandbox = () => {
  const countries = [
    "nigeria",
    "japan",
    "india",
    "united states",
    "south korea"
  ];

  return (
    <SandboxStyles>
      {/* <RTEditor />
      <Button onClick={() => {}}>Valider</Button> */}
      <Stack direction="column">
        <Text>Multi select with tags</Text>
        <AutoComplete
          openOnFocus
          multiple
          //onChange={(vals) => console.log(vals)}
        >
          <AutoCompleteInput placeholder="Search..." variant="filled">
            {({ tags }) => {
              console.log(tags);
              return tags.map((tag, tid) => (
                <AutoCompleteTag
                  key={tid}
                  label={tag.label}
                  onRemove={tag.onRemove}
                />
              ));
            }}
          </AutoCompleteInput>
          <AutoCompleteList>
            {countries.map((country, cid) => (
              <AutoCompleteItem
                key={`option-${cid}`}
                value={country}
                textTransform="capitalize"
                _selected={{ bg: "whiteAlpha.50" }}
                _focus={{ bg: "whiteAlpha.100" }}
              >
                {country}
              </AutoCompleteItem>
            ))}
          </AutoCompleteList>
        </AutoComplete>
      </Stack>
    </SandboxStyles>
  );
};

export default Sandbox;
