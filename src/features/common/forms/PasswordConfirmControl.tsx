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

export const PasswordConfirmControl = ({
  errors,
  name,
  register,
  isRequired = true,
  password,
  ...props
}: FormControlProps & {
  errors: any;
  name: string;
  register: any;
  isRequired?: boolean;
  password: React.MutableRefObject<{}>;
}) => {
  const [passwordConfirmFieldType, setPasswordConfirmFieldType] =
    useState("password");

  return (
    <FormControl isRequired isInvalid={!!errors[name]} {...props}>
      <FormLabel>Confirmation du mot de passe</FormLabel>
      <InputGroup>
        <Input
          name={name}
          ref={register({
            validate: (value: string) =>
              value === password.current ||
              "Les mots de passe ne correspondent pas"
          })}
          type={passwordConfirmFieldType}
        />
        <InputRightElement
          cursor="pointer"
          children={
            passwordConfirmFieldType === "password" ? (
              <ViewOffIcon />
            ) : (
              <ViewIcon />
            )
          }
          onClick={() => {
            if (passwordConfirmFieldType === "password")
              setPasswordConfirmFieldType("text");
            else setPasswordConfirmFieldType("password");
          }}
        />
      </InputGroup>
      <FormErrorMessage>
        <ErrorMessage errors={errors} name={name} />
      </FormErrorMessage>
    </FormControl>
  );
};
