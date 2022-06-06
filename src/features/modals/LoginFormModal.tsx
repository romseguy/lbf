import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Portal,
  Alert,
  AlertIcon,
  useColorMode,
  Flex
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import bcrypt from "bcryptjs";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  EmailControl,
  ErrorMessageText,
  PasswordConfirmControl,
  PasswordControl
} from "features/common";
import { ForgottenForm } from "features/forms/ForgottenForm";
import { getUser } from "features/users/usersApi";
import { useAppDispatch } from "store";
import api from "utils/api";
import { handleError as handleError } from "utils/form";
import { SocialLogins } from "features/session/SocialLogins";
import { handleLoginWithSocial } from "lib/magic";

export const LoginFormModal = (props: {
  onClose: () => void;
  onSubmit: () => void;
}) => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useAppDispatch();

  const [isEmail, setIsEmail] = useState(false);
  const [isForgotten, setIsForgotten] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const portalRef = useRef(null);

  const { register, handleSubmit, watch, errors, setError, clearErrors } =
    useForm({
      mode: "onChange"
    });

  const password = useRef({});
  password.current = watch("password", "");

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async ({
    email,
    password
  }: {
    password: string;
    email: string;
  }) => {
    console.log("submitted", { email, password });

    if (isForgotten) return;
    setIsLoading(true);

    try {
      if (isEmail) {
        //await signIn("email", { email });
        return;
      }

      if (isSignup) {
        const salt = await bcrypt.genSalt(10);
        const { data: user } = await api.post("auth/signup", {
          email,
          password: await bcrypt.hash(password, salt)
        });
        //await signIn("credentials", { email });
      } else {
        const userQuery = await dispatch(
          getUser.initiate({ slug: email, select: "password" })
        );

        if (
          !userQuery.data ||
          !(await bcrypt.compare(password, userQuery.data.password))
        )
          throw new Error(
            "Échec de la connexion, veuillez vérifier vos identifiants."
          );

        //await signIn("credentials", { email });
      }

      //props.onSubmit && props.onSubmit();
    } catch (error) {
      setIsLoading(false);
      handleError(error, (message, field) => {
        if (field) setError(field, { type: "manual", message });
        else setError("formErrorMessage", { type: "manual", message });
      });
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => {
        setIsLoading(false);
        props.onClose && props.onClose();
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
              : isEmail
              ? "Connexion par e-mail"
              : "Connexion"}
          </ModalHeader>
          <ModalCloseButton />
          <SocialLogins onSubmit={handleLoginWithSocial} />
          {/* <form
            onChange={onChange}
            onSubmit={handleSubmit(onSubmit)}
            data-cy="login-form"
          >
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
                  <EmailControl
                    name="email"
                    errors={errors}
                    register={register}
                    isMultiple={false}
                    isRequired
                    mb={3}
                  />

                  {!isEmail && (
                    <PasswordControl
                      name="password"
                      errors={errors}
                      register={register}
                      mb={3}
                    />
                  )}
                </>
              )}

              {!isSignup && (
                <>
                  {!isForgotten && (
                    <Flex justifyContent="space-between">
                      {isEmail ? (
                        <Link
                          fontSize={12}
                          onClick={() => {
                            clearErrors("formErrorMessage");
                            setIsEmail(false);
                          }}
                        >
                          Connexion par mot de passe
                        </Link>
                      ) : (
                        <Link
                          fontSize={12}
                          onClick={() => {
                            clearErrors("formErrorMessage");
                            setIsEmail(true);
                          }}
                        >
                          Connexion par e-mail
                        </Link>
                      )}
                      {!isEmail && (
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
                    </Flex>
                  )}

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
                <PasswordConfirmControl
                  name="passwordConfirm"
                  errors={errors}
                  register={register}
                  password={password}
                />
              )}
            </ModalBody>

            {!isForgotten && (
              <ModalFooter justifyContent="space-between">
                {isSignup ? (
                  <Button
                    colorScheme="transparent"
                    color={isDark ? "white" : "black"}
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
                  type="submit"
                  isDisabled={Object.keys(errors).length > 0}
                  isLoading={isLoading}
                  colorScheme="green"
                >
                  {isSignup ? "Inscription" : "Connexion"}
                </Button>
              </ModalFooter>
            )}
          </form> */}
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
