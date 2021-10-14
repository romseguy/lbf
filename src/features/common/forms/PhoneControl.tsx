import { ErrorMessage } from "@hookform/error-message";
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
import { AtSignIcon, DeleteIcon, PhoneIcon } from "@chakra-ui/icons";
import React from "react";
import { useFieldArray } from "react-hook-form";
import { Link } from "../Link";
import { phoneR } from "utils/string";

export const PhoneControl = ({
  defaultValue = "",
  errors,
  name,
  label = "Numéro de téléphone",
  noLabel,
  control,
  register,
  isRequired = false,
  isMultiple = true,
  ...props
}: SpaceProps & {
  defaultValue?: string;
  errors: any;
  name: string;
  label?: string;
  noLabel?: boolean;
  control: any;
  register: any;
  isRequired?: boolean;
  placeholder?: string;
  isMultiple?: boolean;
}) => {
  let formRules: { required?: string | boolean } = {};

  if (isRequired) {
    formRules.required = "Veuillez saisir un numéro de téléphone";
  }

  if (!isMultiple) {
    return (
      <FormControl
        id={name}
        isRequired={isRequired}
        isInvalid={!!errors[name]}
        {...props}
      >
        {!noLabel && <FormLabel m={0}>{label}</FormLabel>}
        <InputGroup>
          <InputLeftElement pointerEvents="none" children={<PhoneIcon />} />
          <Input
            name={name}
            placeholder={
              props.placeholder ||
              "Cliquez ici pour saisir un numéro de téléphone..."
            }
            defaultValue={defaultValue}
            ref={register({
              pattern: {
                value: phoneR,
                message: "Numéro de téléphone invalide"
              },
              ...formRules
            })}
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
            isInvalid={errors[name] && errors[name][index]}
            {...props}
          >
            {!noLabel && (
              <FormLabel m={0}>
                {index > 0 ? `${index + 1}ème ${label.toLowerCase()}` : label}
              </FormLabel>
            )}
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<PhoneIcon />} />
              <Input
                name={`${name}[${index}].phone`}
                placeholder={
                  props.placeholder ||
                  "Cliquez ici pour saisir un numéro de téléphone..."
                }
                defaultValue={`${field.phone}`} // make sure to set up defaultValue
                ref={register({
                  pattern: {
                    value: phoneR,
                    message: "Numéro de téléphone invalide"
                  },
                  ...formRules
                })}
              />
              {index > 0 && (
                <InputRightAddon
                  children={
                    <IconButton
                      aria-label={`Supprimer le ${
                        index + 1
                      }ème numéro de téléphone`}
                      icon={<DeleteIcon />}
                      onClick={() => remove(index)}
                    />
                  }
                />
              )}
            </InputGroup>
            <FormErrorMessage>
              <ErrorMessage errors={errors} name={`${name}[${index}].phone`} />
            </FormErrorMessage>
          </FormControl>
        );
      })}

      <Link
        fontSize="smaller"
        onClick={() => {
          append({ phone: "" });
        }}
      >
        <PhoneIcon /> Ajouter un numéro de téléphone
      </Link>
    </Box>
  );
};
