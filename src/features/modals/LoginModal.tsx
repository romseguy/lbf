import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { signIn, signOut } from "next-auth/client";
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
  Stack,
  useToast,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  useColorMode
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ViewIcon,
  ViewOffIcon,
  WarningIcon
} from "@chakra-ui/icons";
import { ErrorMessageText } from "features/common";
import api from "utils/api";
import { handleError as handleError } from "utils/form";
import { emailR } from "utils/email";
import { ForgottenForm } from "features/forms/ForgottenForm";

export const LoginModal = (props: {
  onClose: () => void;
  onSubmit: (url?: string | null) => void;
}) => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const [isForgotten, setIsForgotten] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordFieldType, setPasswordFieldType] = useState("password");
  const [passwordConfirmFieldType, setPasswordConfirmFieldType] =
    useState("password");

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
    if (isForgotten) return;
    setIsLoading(true);

    if (isSignup) {
      const { error } = await api.post("auth/signup", { email, password });

      if (error) {
        setIsLoading(false);
        handleError(error, (message, field) => {
          if (field) {
            setError(field, { type: "manual", message });
          } else {
            setError("formErrorMessage", { type: "manual", message });
          }
        });
      } else {
        await signIn("credentials", { email, password });
        setIsLoading(false);
        onClose();
        props.onClose && props.onClose();
      }
    } else {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false
      });
      setIsLoading(false);

      if (res?.error) {
        handleError({ message: res.error }, (message) =>
          setError("formErrorMessage", { type: "manual", message })
        );
      } else {
        onClose();
        props.onClose && props.onClose();
        props.onSubmit && props.onSubmit(res?.url);
      }
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
          <ModalHeader>
            {isForgotten
              ? "Mot de passe oublié"
              : isSignup
              ? "Inscription"
              : "Connexion"}
          </ModalHeader>
          <ModalCloseButton />
          <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
            <ModalBody pt={0}>
              <ErrorMessage
                errors={errors}
                name="formErrorMessage"
                render={({ message }) => (
                  <Alert status="error" mb={3}>
                    <AlertIcon />
                    <ErrorMessageText>{message}</ErrorMessageText>
                  </Alert>
                )}
              />

              {!isForgotten && (
                <>
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
                    <InputGroup>
                      <Input
                        name="password"
                        ref={register({
                          required: "Veuillez saisir un mot de passe"
                        })}
                        type={passwordFieldType}
                      />
                      <InputRightElement
                        cursor="pointer"
                        children={
                          passwordFieldType === "password" ? (
                            <ViewOffIcon />
                          ) : (
                            <ViewIcon />
                          )
                        }
                        onClick={() => {
                          if (passwordFieldType === "password")
                            setPasswordFieldType("text");
                          else setPasswordFieldType("password");
                        }}
                      />
                    </InputGroup>
                    <FormErrorMessage>
                      <ErrorMessage errors={errors} name="password" />
                    </FormErrorMessage>
                  </FormControl>
                </>
              )}

              {!isSignup && (
                <>
                  <Box textAlign="right">
                    {!isForgotten && (
                      <Link
                        fontSize={12}
                        onClick={() => {
                          clearErrors("formErrorMessage");
                          setIsForgotten(true);
                        }}
                      >
                        Mot de passe oublié ?
                      </Link>
                    )}
                  </Box>

                  <>
                    <Portal containerRef={portalRef}>
                      <ForgottenForm
                        display={isForgotten ? "block" : "none"}
                        onCancel={() => setIsForgotten(false)}
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
                  <InputGroup>
                    <Input
                      name="passwordConfirm"
                      ref={register({
                        validate: (value) =>
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
                    <ErrorMessage errors={errors} name="passwordConfirm" />
                  </FormErrorMessage>
                </FormControl>
              )}
            </ModalBody>

            {!isForgotten && (
              <ModalFooter justifyContent="space-between">
                {isSignup ? (
                  <Button
                    colorScheme="transparent"
                    color="black"
                    size="xs"
                    leftIcon={<ChevronLeftIcon />}
                    onClick={() => {
                      //reset();
                      clearErrors("formErrorMessage");
                      setIsSignup(false);
                    }}
                  >
                    Se connecter
                  </Button>
                ) : (
                  <Button
                    colorScheme="transparent"
                    color={isDark ? "white" : "black"}
                    size="xs"
                    rightIcon={<ChevronRightIcon />}
                    onClick={() => {
                      //reset();
                      clearErrors("formErrorMessage");
                      setIsSignup(true);
                    }}
                  >
                    S'inscrire
                  </Button>
                )}
                <Button
                  ml={3}
                  colorScheme="green"
                  type="submit"
                  isLoading={isLoading}
                  isDisabled={Object.keys(errors).length > 0}
                  data-cy="loginFormSubmit"
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
