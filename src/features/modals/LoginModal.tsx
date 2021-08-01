import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { signIn, signOut } from "next-auth/react";
import { ErrorMessage } from "@hookform/error-message";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Portal,
  useDisclosure,
  Stack
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  WarningIcon
} from "@chakra-ui/icons";
import { ErrorMessageText } from "features/common";
import api from "utils/api";
import { handleError as handleFormError } from "utils/form";
import { emailR } from "utils/email";
import { ForgottenForm } from "features/forms/ForgottenForm";

export const LoginModal = (props: {
  onClose: () => void;
  onSubmit: (url?: string | null) => void;
}) => {
  const router = useRouter();

  const [isForgotten, setIsForgotten] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const portalRef = useRef(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
    errors,
    setError,
    clearErrors,
    reset
  } = useForm({
    mode: "onChange"
  });

  const password = useRef({});
  password.current = watch("password", "");

  const handleError = (error: { [key: string]: string }) =>
    Object.keys(error).forEach((key) => {
      if (key === "email" || key === "password") {
        setError(key, { type: "manual", message: error[key] });
      } else {
        setError("formErrorMessage", {
          type: "manual",
          message: error[key] || error.message
        });
      }
    });

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async ({
    password,
    email
  }: {
    password: string;
    email: string;
  }) => {
    setIsLoading(true);

    try {
      if (isSignup) {
        const { error } = await api.post("auth/signup", { email, password });

        if (!error) {
          await signIn("credentials", { email, password });
        } else {
          handleError(error);
        }
      } else {
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false
        });

        if (res?.error) {
          throw { message: res.error };
        }

        props.onSubmit && props.onSubmit(res?.url);
      }
    } catch (error) {
      setError("formErrorMessage", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsLoading(false);
        props.onClose && props.onClose();
        onClose();
      }}
      closeOnOverlayClick={false}
    >
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>Connexion</ModalHeader>
          <ModalCloseButton />
          <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
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

              <FormControl
                id="email"
                isRequired
                isInvalid={!!errors["email"]}
                mb={3}
              >
                <FormLabel>Adresse e-mail</FormLabel>
                <Input
                  name="email"
                  ref={register({
                    required: "Veuillez saisir une adresse e-mail",
                    pattern: {
                      value: emailR,
                      message: "Adresse e-mail invalide"
                    }
                  })}
                />
                <FormErrorMessage>
                  <ErrorMessage errors={errors} name="email" />
                </FormErrorMessage>
              </FormControl>

              <FormControl
                id="password"
                mb={3}
                isRequired
                isInvalid={!!errors["password"]}
              >
                <FormLabel>Mot de passe</FormLabel>
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

              {!isSignup && (
                <>
                  <Box mt={5}>
                    <Link
                      onClick={() => {
                        setIsForgotten(!isForgotten);
                      }}
                    >
                      <Icon
                        as={isForgotten ? ChevronDownIcon : ChevronRightIcon}
                      />{" "}
                      Mot de passe oublié ?
                    </Link>
                  </Box>

                  <>
                    <Portal containerRef={portalRef}>
                      <ForgottenForm
                        display={isForgotten ? "block" : "none"}
                        onSuccess={() => setIsForgotten(false)}
                      />
                    </Portal>
                    <Box ref={portalRef}></Box>
                  </>
                </>
              )}

              {isSignup && (
                <FormControl
                  id="passwordConfirm"
                  isRequired
                  isInvalid={!!errors["passwordConfirm"]}
                >
                  <FormLabel>Confirmation du mot de passe</FormLabel>
                  <Input
                    name="passwordConfirm"
                    ref={register({
                      validate: (value) =>
                        value === password.current ||
                        "Les mots de passe ne correspondent pas"
                    })}
                    type="password"
                  />
                  <FormErrorMessage>
                    <ErrorMessage errors={errors} name="passwordConfirm" />
                  </FormErrorMessage>
                </FormControl>
              )}
            </ModalBody>

            {!isForgotten && (
              <ModalFooter justifyContent="space-between">
                {isSignup ? (
                  <Button
                    colorScheme="blue"
                    leftIcon={<ChevronLeftIcon />}
                    onClick={() => {
                      reset();
                      setIsSignup(false);
                    }}
                  >
                    J'ai déjà un compte
                  </Button>
                ) : (
                  <Button
                    colorScheme="blue"
                    rightIcon={<ChevronRightIcon />}
                    onClick={() => {
                      reset();
                      setIsSignup(true);
                    }}
                  >
                    Je crée mon compte
                  </Button>
                )}
                <Button
                  colorScheme="green"
                  type="submit"
                  isLoading={isLoading}
                  isDisabled={Object.keys(errors).length > 0}
                >
                  {isSignup ? "Inscription" : "Connexion"}
                </Button>
              </ModalFooter>
            )}
          </form>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
