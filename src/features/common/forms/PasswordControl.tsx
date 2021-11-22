import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormControlProps,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  Input,
  InputRightElement
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useState } from "react";

export const PasswordControl = ({
  errors,
  name,
  register,
  isRequired = true,
  ...props
}: FormControlProps & {
  errors: any;
  name: string;
  register: any;
  isRequired?: boolean;
}) => {
  const [passwordFieldType, setPasswordFieldType] = useState("password");

  return (
    <FormControl isRequired={isRequired} isInvalid={!!errors[name]} {...props}>
      <FormLabel>Mot de passe</FormLabel>
      <InputGroup>
        <Input
          name="password"
          ref={register(
            isRequired
              ? {
                  required: "Veuillez saisir un mot de passe"
                }
              : undefined
          )}
          type={passwordFieldType}
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
