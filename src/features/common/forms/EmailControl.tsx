import { ErrorMessage } from "@hookform/error-message";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  SpaceProps
} from "@chakra-ui/react";
// import { Input } from "features/common";
import { AtSignIcon, EmailIcon } from "@chakra-ui/icons";

export const EmailControl = ({
  defaultValue,
  errors,
  name,
  label = "Adresse e-mail",
  noLabel,
  register,
  isRequired = false,
  onRightElementClick,
  ...props
}: SpaceProps & {
  defaultValue?: string;
  errors: { [key: string]: string };
  name: string;
  label?: string;
  noLabel?: boolean;
  register: any;
  isRequired?: boolean;
  placeholder?: string;
  onRightElementClick?: () => void;
}) => {
  let formRules: { required?: string | boolean } = {};

  if (isRequired) {
    formRules.required = "Veuillez saisir une adresse e-mail";
  }

  return (
    <FormControl
      id={name}
      isRequired={isRequired}
      isInvalid={!!errors[name]}
      {...props}
    >
      {!noLabel && <FormLabel>{label}</FormLabel>}

      <InputGroup>
        <InputLeftElement pointerEvents="none" children={<AtSignIcon />} />
        <Input
          name={name}
          placeholder={
            props.placeholder || "Cliquez ici pour saisir une adresse e-mail..."
          }
          ref={register({
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Adresse email invalide"
            },
            ...formRules
          })}
          defaultValue={defaultValue}
          pl={10}
        />
        {noLabel && onRightElementClick && (
          <InputRightElement
            pointerEvents="none"
            children={<Icon as={EmailIcon} onClick={onRightElementClick} />}
          />
        )}
      </InputGroup>

      <FormErrorMessage>
        <ErrorMessage errors={errors} name={name} />
      </FormErrorMessage>
    </FormControl>
  );
};
