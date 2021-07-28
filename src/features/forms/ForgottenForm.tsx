import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputLeftElement,
  InputGroup,
  RequiredIndicator,
  Stack,
  useToast
} from "@chakra-ui/react";
import { EmailIcon, WarningIcon } from "@chakra-ui/icons";
import { ErrorMessageText } from "features/common";
import { emailR } from "utils/email";
import api from "utils/api";
import { handleError } from "utils/form";

export const ForgottenForm = ({
  display,
  onSuccess
}: {
  display: string;
  onSuccess?: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [savedSecurityCode, setSavedSecurityCode] = useState();
  const [isValid, setIsValid] = useState(false);
  const [savedEmail, setSavedEmail] = useState();
  const toast = useToast({ position: "top" });

  const {
    control,
    register,
    handleSubmit,
    getValues,
    watch,
    errors,
    setError,
    clearErrors,
    trigger,
    reset
  } = useForm({
    mode: "onChange"
  });

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async () => {
    setIsLoading(true);

    trigger();
    const { emailForgotten, securityCode, password } = getValues([
      "emailForgotten",
      "securityCode",
      "password"
    ]);

    if (emailForgotten) {
      const { error, data } = await api.post("auth/forgotten", {
        email: emailForgotten
      });

      if (error) {
        handleError(error, (message, field) => {
          if (!field || field === "message") {
            setError("formErrorMessage", { type: "manual", message });
          }
        });
      } else {
        setSavedEmail(emailForgotten);
        setSavedSecurityCode(data);
        reset();
        setIsSent(true);
        toast({
          title: `Veuillez saisir le code de sécurité qui vous a été envoyé à ${emailForgotten}`,
          status: "success",
          duration: 9000,
          isClosable: true
        });
      }
    } else if (securityCode) {
      if (parseInt(savedSecurityCode!) === parseInt(securityCode)) {
        setIsValid(true);
      } else {
        setError("formErrorMessage", {
          type: "manual",
          message: "Le code de sécurité est incorrect."
        });
      }
    } else if (password) {
      const { error, data } = await api.post("auth/forgotten", {
        email: savedEmail,
        password
      });

      if (error) {
        handleError(error, (message, field) => {
          if (!field || field === "message") {
            setError("formErrorMessage", { type: "manual", message });
          }
        });
      } else {
        toast({
          title: `Le mot de passe du compte ${savedEmail} a bien été changé.`,
          status: "success",
          isClosable: true
        });
        onSuccess && onSuccess();
      }
    } else {
    }

    setIsLoading(false);
  };

  return (
    <form style={{ display }} onChange={onChange}>
      <ErrorMessage
        errors={errors}
        name="formErrorMessage"
        render={({ message }) => (
          <Stack isInline p={5} mb={5} shadow="md" color="red.500">
            <WarningIcon boxSize={5} />
            <Box>
              <ErrorMessageText>{message}</ErrorMessageText>
            </Box>
          </Stack>
        )}
      />

      {/* Step 1 */}
      {!isSent && !isValid && (
        <FormControl
          id="emailForgotten"
          isRequired
          isInvalid={!!errors["emailForgotten"]}
          mt={3}
          mb={3}
        >
          <InputGroup>
            <InputLeftElement pointerEvents="none" children={<EmailIcon />} />

            <Input
              name="emailForgotten"
              placeholder="Entrez votre adresse e-mail"
              ref={register({
                required: "Veuillez saisir votre adresse e-mail",
                pattern: {
                  value: emailR,
                  message: "Adresse e-mail invalide"
                }
              })}
            />
          </InputGroup>
          <FormErrorMessage>
            <ErrorMessage errors={errors} name="emailForgotten" />
          </FormErrorMessage>
        </FormControl>
      )}

      {/* Step 2 */}
      {isSent && !isValid && (
        <FormControl
          id="securityCode"
          isRequired
          isInvalid={!!errors["securityCode"]}
          mb={3}
          mt={3}
        >
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<RequiredIndicator color="red" />}
            />

            <Input
              name="securityCode"
              placeholder="Entrez le code de sécurité"
              ref={register({
                required: "Veuillez saisir le code de sécurité"
              })}
            />
          </InputGroup>
          <FormErrorMessage>
            <ErrorMessage errors={errors} name="securityCode" />
          </FormErrorMessage>
        </FormControl>
      )}

      {/* Step 3 */}
      {isValid && (
        <>
          <FormControl
            id="password"
            mt={3}
            mb={3}
            isRequired
            isInvalid={!!errors["password"]}
          >
            <FormLabel>Nouveau mot de passe</FormLabel>
            <Input
              name="password"
              ref={register({
                required: "Veuillez saisir un mot de passe"
              })}
              type="password"
            />
            <FormErrorMessage>
              <ErrorMessage errors={errors} name="password" />
            </FormErrorMessage>
          </FormControl>

          <FormControl
            id="passwordConfirm"
            isRequired
            isInvalid={!!errors["passwordConfirm"]}
            mb={3}
          >
            <FormLabel>Confirmation du nouveau mot de passe</FormLabel>
            <Input
              name="passwordConfirm"
              ref={register({
                validate: (value) =>
                  value === getValues("password") ||
                  "Les mots de passe ne correspondent pas"
              })}
              type="password"
            />
            <FormErrorMessage>
              <ErrorMessage errors={errors} name="passwordConfirm" />
            </FormErrorMessage>
          </FormControl>
        </>
      )}

      <Button
        colorScheme="blue"
        isLoading={isLoading}
        isDisabled={Object.keys(errors).length > 0}
        p={5}
        mb={3}
        onClick={onSubmit}
      >
        {isSent
          ? isValid
            ? "Valider le changement de mot de passe"
            : "Valider le code de sécurité"
          : "Demander un nouveau mot de passe"}
      </Button>
    </form>
  );
};
