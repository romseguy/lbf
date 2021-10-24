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
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
  SpaceProps
} from "@chakra-ui/react";
// import { Input } from "features/common";
import { ErrorMessage } from "@hookform/error-message";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { Link } from "../Link";

export const EmailControl = ({
  defaultValue,
  errors,
  name,
  label = "Adresse e-mail",
  noLabel,
  control,
  register,
  setValue,
  isRequired = false,
  isMultiple = true,
  onRightElementClick,
  ...props
}: SpaceProps & {
  defaultValue?: string;
  errors: any;
  name: string;
  label?: string;
  noLabel?: boolean;
  control?: any;
  register: any;
  setValue?: any;
  isRequired?: boolean;
  isMultiple?: boolean;
  placeholder?: string;
  onRightElementClick?: () => void;
}) => {
  let formRules: { required?: string | boolean } = {};

  if (isRequired) {
    formRules.required = "Veuillez saisir une adresse e-mail";
  }

  if (!isMultiple) {
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
              props.placeholder ||
              "Cliquez ici pour saisir une adresse e-mail..."
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
              children={<Icon as={AtSignIcon} onClick={onRightElementClick} />}
            />
          )}
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
    <Box {...props}>
      {fields.map((field, index) => {
        return (
          <FormControl
            key={field.id}
            id={name}
            isRequired={isRequired}
            isInvalid={errors[name] && errors[name][index]}
            {...props}
          >
            {!noLabel && (
              <FormLabel m={0}>
                {index > 0 ? `${index + 1}ème ${label.toLowerCase()}` : label}
              </FormLabel>
            )}
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<AtSignIcon />}
              />
              <Input
                name={`${name}[${index}].email`}
                placeholder={
                  props.placeholder ||
                  "Cliquez ici pour saisir une adresse e-mail..."
                }
                defaultValue={`${field.email}`} // make sure to set up defaultValue
                ref={register({
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Adresse email invalide"
                  },
                  ...formRules
                })}
              />
              <InputRightAddon
                p={0}
                children={
                  <IconButton
                    aria-label={
                      index + 1 === 1
                        ? "Supprimer la 1ère adresse e-mail"
                        : `Supprimer la ${index + 1}ème adresse e-mail`
                    }
                    icon={<DeleteIcon />}
                    bg="transparent"
                    _hover={{ bg: "transparent", color: "red" }}
                    onClick={() => {
                      remove(index);

                      if (fields.length === 1) setValue(name, null);
                    }}
                  />
                }
              />
            </InputGroup>
            <FormErrorMessage>
              <ErrorMessage errors={errors} name={`${name}[${index}].email`} />
            </FormErrorMessage>
          </FormControl>
        );
      })}

      <Link
        fontSize="smaller"
        onClick={() => {
          append({ email: "" });
        }}
      >
        <AtSignIcon mr={1} /> Ajouter une adresse e-mail
      </Link>
    </Box>
  );
};
