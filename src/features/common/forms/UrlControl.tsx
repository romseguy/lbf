import { ErrorMessage } from "@hookform/error-message";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputProps,
  Select
} from "@chakra-ui/react";
// import { Input } from "features/common";
import { optionalProtocolUrlR, urlR } from "utils/url";
import { css } from "twin.macro";
import { useState } from "react";

export const UrlControl = ({
  label,
  placeholder,
  defaultValue,
  errors,
  name,
  register,
  urlPrefix,
  setUrlPrefix,
  isRequired = false,
  mb,
  ...props
}: {
  label?: string;
  defaultValue?: string;
  errors: { [key: string]: string };
  name: string;
  register: any;
  urlPrefix?: "https://" | "http://";
  setUrlPrefix?: (prefix: "https://" | "http://") => void;
  isRequired?: boolean;
  mb?: number;
  placeholder?: string;
} & InputProps) => {
  let formRules: { required?: string | boolean } = {};

  if (isRequired) {
    formRules.required = "Veuillez saisir une adresse internet";
  }

  return (
    <FormControl
      id={name}
      isRequired={isRequired}
      isInvalid={!!errors[name]}
      mb={mb}
    >
      <FormLabel>{label || "Site internet"}</FormLabel>

      <InputGroup>
        <InputLeftAddon
          bg="transparent"
          border={0}
          p={0}
          children={
            <Select
              id="noop"
              defaultValue="https"
              variant="filled"
              borderTopRightRadius={0}
              borderBottomRightRadius={0}
              css={css`
                margin: 0 !important;
              `}
              onChange={(e) => {
                if (
                  setUrlPrefix &&
                  (e.target.value === "http://" ||
                    e.target.value === "https://")
                )
                  setUrlPrefix(e.target.value);
              }}
            >
              <option value="https://">https://</option>
              <option value="http://">http://</option>
            </Select>
          }
        />
        <Input
          name={name}
          placeholder={placeholder || "Saisir une adresse internet"}
          ref={register({
            pattern: {
              value: optionalProtocolUrlR,
              message: "Adresse invalide"
            },
            ...formRules
          })}
          defaultValue={defaultValue}
          {...props}
        />
      </InputGroup>

      <FormErrorMessage>
        <ErrorMessage errors={errors} name={name} />
      </FormErrorMessage>
    </FormControl>
  );
};
