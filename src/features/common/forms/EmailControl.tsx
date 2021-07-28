import { ErrorMessage } from "@hookform/error-message";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import { Input } from "features/common";

export const EmailControl = ({
  defaultValue,
  errors,
  name,
  register,
  isRequired = false,
  mb
}: {
  defaultValue?: string;
  errors: { [key: string]: string };
  name: string;
  register: any;
  isRequired?: boolean;
  mb?: number;
}) => {
  let formRules: { required?: string | boolean } = {};

  if (isRequired) {
    formRules.required = "Veuillez saisir l'adresse e-mail";
  }

  return (
    <FormControl
      id={name}
      isRequired={isRequired}
      isInvalid={!!errors[name]}
      mb={mb}
    >
      <FormLabel>Adresse e-mail</FormLabel>
      <Input
        name={name}
        placeholder="Cliquez ici pour saisir une adresse e-mail..."
        ref={register({
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Adresse email invalide"
          },
          ...formRules
        })}
        defaultValue={defaultValue}
      />
      <FormErrorMessage>
        <ErrorMessage errors={errors} name={name} />
      </FormErrorMessage>
    </FormControl>
  );
};
