import { ErrorMessage } from "@hookform/error-message";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps
} from "@chakra-ui/react";
// import { Input } from "features/common";
import { AtSignIcon } from "@chakra-ui/icons";
import { urlR } from "utils/url";

export const UrlControl = ({
  label,
  placeholder,
  defaultValue,
  errors,
  name,
  register,
  isRequired = false,
  mb,
  ...props
}: {
  label?: string;
  defaultValue?: string;
  errors: { [key: string]: string };
  name: string;
  register: any;
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
};
