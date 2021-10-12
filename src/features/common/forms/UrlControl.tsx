import { AtSignIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputProps,
  InputRightAddon,
  Select
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { FaGlobeEurope } from "react-icons/fa";
import { css } from "twin.macro";
import { optionalProtocolUrlR, urlR } from "utils/url";
import { Link } from "../Link";

export const UrlControl = ({
  label = "Site internet",
  placeholder,
  defaultValue,
  errors,
  name,
  control,
  register,
  setValue,
  isRequired = false,
  isMultiple = true,
  ...props
}: {
  label?: string;
  defaultValue?: string;
  errors: { [key: string]: string };
  name: string;
  control: any;
  register: any;
  setValue?: any;
  isRequired?: boolean;
  placeholder?: string;
  isMultiple?: boolean;
} & InputProps) => {
  let formRules: { required?: string | boolean } = {};

  if (isRequired) {
    formRules.required = "Veuillez saisir une adresse internet";
  }

  if (!isMultiple) {
    return (
      <FormControl id={name} isRequired={isRequired} isInvalid={!!errors[name]}>
        <FormLabel>{label || "Site internet"}</FormLabel>

        <InputGroup>
          <InputLeftElement pointerEvents="none" children={<AtSignIcon />} />
          <Input
            name={name}
            placeholder={placeholder || "Saisir une adresse internet"}
            ref={register({
              pattern: {
                value: urlR,
                message: "Adresse invalide"
              },
              ...formRules
            })}
            defaultValue={defaultValue}
            pl={10}
            {...props}
          />
        </InputGroup>

        <FormErrorMessage>
          <ErrorMessage errors={errors} name={name} />
        </FormErrorMessage>
      </FormControl>
    );
  }

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name // unique name for your Field Array
      // keyName: "id", default to "id", you can change the key name
    }
  );

  return (
    <Box mb={3}>
      {fields.map((field, index) => {
        return (
          <FormControl
            key={field.id}
            id={name}
            isRequired={isRequired}
            isInvalid={!!(errors[name] && errors[name][index])}
            {...props}
          >
            <FormLabel m={0}>
              {index > 0 ? `${index + 1}ème ${label.toLowerCase()}` : label}
            </FormLabel>

            <InputGroup>
              <InputLeftAddon
                bg="transparent"
                border={0}
                p={0}
                children={
                  <Select
                    name={`${name}[${index}].prefix`}
                    ref={register()}
                    defaultValue={field.prefix}
                    variant="filled"
                    borderTopRightRadius={0}
                    borderBottomRightRadius={0}
                    css={css`
                      margin: 0 !important;
                    `}
                    onChange={(e) =>
                      setValue(`${name}[${index}].prefix`, e.target.value)
                    }
                  >
                    <option value="https://">https://</option>
                    <option value="http://">http://</option>
                  </Select>
                }
              />
              <Input
                name={`${name}[${index}].url`}
                placeholder={placeholder || "Saisir une adresse internet"}
                defaultValue={field.url}
                ref={register({
                  pattern: {
                    value: optionalProtocolUrlR,
                    message: "Adresse invalide"
                  },
                  ...formRules
                })}
              />
              {index > 0 && (
                <InputRightAddon
                  children={
                    <IconButton
                      aria-label={`Supprimer la ${index + 1}ème adresse e-mail`}
                      icon={<DeleteIcon />}
                      onClick={() => remove(index)}
                    />
                  }
                />
              )}
            </InputGroup>
            <FormErrorMessage>
              <ErrorMessage errors={errors} name={`${name}[${index}].url`} />
            </FormErrorMessage>
          </FormControl>
        );
      })}

      <Link
        fontSize="smaller"
        onClick={() => {
          append({ url: "", prefix: "https://" });
        }}
      >
        <Icon as={FaGlobeEurope} /> Ajouter un site internet
      </Link>
    </Box>
  );
};
