import { SmallCloseIcon } from "@chakra-ui/icons";
import { InputGroup, InputRightElement } from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteTag,
  ItemTag
} from "@choc-ui/chakra-autocomplete";
import React, { useEffect, useState } from "react";
import { Control, Controller, useWatch, UseFormMethods } from "react-hook-form";

export const TagsControl = ({
  control,
  name,
  setValue,
  tags,
  setTags
}: {
  control: Control;
  name: string;
  tags: ItemTag[];
  setTags: React.Dispatch<React.SetStateAction<ItemTag[]>>;
  setValue: UseFormMethods["setValue"];
}) => {
  const [tagLabelToRemove, setTagLabelToRemove] = useState("");
  useEffect(() => {
    setTags(tags.filter(({ label }) => label !== tagLabelToRemove));
  }, [tagLabelToRemove]);

  const value = useWatch<string>({ control, name }) || "";

  if (value !== "") {
    const chunks = value.split(/(\s+)/).filter((str: string) => str.length > 0);

    if (chunks.length >= 2) {
      let labels: string[] = [];

      for (let i = 0; i < chunks.length; ++i) {
        const chunk = chunks[i];
        if (chunk !== " ") {
          if (
            !!chunks[i + 1] &&
            !labels.includes(chunk) &&
            !tags.find(({ label }) => label === chunk)
          ) {
            labels.push(chunk);
          }
        }
      }

      setValue(name, chunks.length % 2 === 0 ? "" : chunks[chunks.length - 1]);
      setTags(
        tags.concat(
          labels.map((label) => ({
            label,
            onRemove: () => setTagLabelToRemove(label)
          }))
        )
      );
    }
  }

  return (
    <Controller
      name="emailList"
      control={control}
      render={(renderProps) => {
        return (
          <AutoComplete multiple>
            <InputGroup>
              <AutoCompleteInput
                value={renderProps.value}
                onChange={renderProps.onChange}
              >
                {tags.map((tag, tid) => (
                  <AutoCompleteTag
                    key={tid}
                    label={tag.label}
                    onRemove={tag.onRemove}
                  />
                ))}
              </AutoCompleteInput>
              <InputRightElement
                cursor="pointer"
                children={<SmallCloseIcon />}
                _hover={{ color: "red" }}
                onClick={() => setTags([])}
              />
            </InputGroup>
          </AutoComplete>
        );
      }}
    />
  );
};
