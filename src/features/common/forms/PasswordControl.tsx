import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormControlProps,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  Input,
  InputRightElement,
  InputLeftElement
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useState } from "react";
import { FaKey } from "react-icons/fa";

export const PasswordControl = ({
  errors,
  register,
  isRequired = true,
  ...props
}: FormControlProps & {
  errors: any;
  name?: string;
  register: any;
  isRequired?: boolean;
}) => {
  const name = props.name || "password";
  const [passwordFieldType, setPasswordFieldType] = useState("password");

  return (
    <FormControl isRequired={isRequired} isInvalid={!!errors[name]} {...props}>
      <FormLabel>Mot de passe</FormLabel>
      <InputGroup>
        <InputLeftElement pointerEvents="none" children={<FaKey />} />
        <Input
          name={name}
          ref={register(
            isRequired
              ? {
                  required: "Veuillez saisir un mot de passe"
                }
              : undefined
          )}
          type={passwordFieldType}
          placeholder="Saisir un mot de passe..."
          data-cy="password-input"
        />
        <InputRightElement
          cursor="pointer"
          children={
            passwordFieldType === "password" ? <ViewOffIcon /> : <ViewIcon />
          }
          onClick={() => {
            if (passwordFieldType === "password") setPasswordFieldType("text");
            else setPasswordFieldType("password");
          }}
        />
      </InputGroup>
      <FormErrorMessage>
        <ErrorMessage errors={errors} name={name} />
      </FormErrorMessage>
    </FormControl>
  );
};
