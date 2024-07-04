import {
  Alert,
  AlertIcon,
  Box,
  ButtonProps,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Spinner,
  Stack,
  Text,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { OAuthProvider } from "@magic-ext/oauth";
import bcrypt from "bcryptjs";
import { FaPowerOff } from "react-icons/fa";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { css } from "twin.macro";
import {
  getUser,
  usePostResetPasswordMailMutation
} from "features/api/usersApi";
import {
  AppHeading,
  Button,
  Column,
  EmailControl,
  Link,
  PasswordControl
} from "features/common";
import { breakpoints } from "features/layout/theme";
import { SocialLogins } from "features/session/SocialLogins";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { useAppDispatch } from "store";
import { resetUserEmail } from "store/userSlice";
import api from "utils/api";
import { magic, sealOptions, TOKEN_NAME } from "utils/auth";
import { seal } from "@hapi/iron";

const onLoginWithSocial = async (provider: OAuthProvider) => {
  await magic.oauth.loginWithRedirect({
    provider,
    redirectURI: new URL("/callback", window.location.origin).href
  });
};

export const LoginForm = ({
  isMobile,
  title = "Connexion",
  ...props
}: PageProps & { title?: string }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useAppDispatch();
  //const router = useRouter();
  const {
    data: session,
    loading: isSessionLoading,
    setSession,
    setIsSessionLoading
  } = useSession();
  const toast = useToast({ position: "top" });
  //const [postResetPasswordMail] = usePostResetPasswordMailMutation();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  //const [isSent, setIsSent] = useState(false);

  //#region form
  const { clearErrors, register, control, errors, setError, handleSubmit } =
    useForm({ mode: "onChange" });
  //const email = useWatch<string>({ control, name: "email" });
  //const password = useWatch<string>({ control, name: "password" });

  const onSubmit = async (form: { email: string; password?: string }) => {
    console.log("submitted", form);
    setIsLoggingIn(true);

    try {
      if (form.password) {
        const { data: user } = await dispatch(
          getUser.initiate({ slug: form.email })
        );

        if (user?.passwordSalt) {
          const hash = await bcrypt.hash(form.password, user.passwordSalt);
          const {
            data: { authenticated }
          } = await api.post("login", { email: form.email, hash });

          if (authenticated) window.location.href = "/";
          else
            toast({
              status: "error",
              title: "L'adresse e-mail et le mot de passe ne correspondent pas"
            });

          // todo: POST hash to /api/login

          // if (user.password === hash) {
          //   toast({ title: "OK" });
          //   const userToken = {
          //     email: form.email,
          //     userId: user._id,
          //     userName: user.userName
          //   };

          //   const authToken = await seal(userToken, "i9udjxke5S", sealOptions);

          //   dispatch(
          //     setSession({
          //       user: userToken,
          //       [TOKEN_NAME]: authToken
          //     })
          //   );
          // } else toast({ title: "NOK" });
        }

        setIsLoggingIn(false);
      } else {
        await magic.auth.loginWithMagicLink({
          email: form.email,
          redirectURI: new URL("/callback", window.location.origin).href
        });
      }
    } catch (error) {
      setIsLoggingIn(false);
    }
  };
  //#endregion

  return (
    <Flex flexDirection="column" width={isMobile ? "auto" : "md"} m="0 auto">
      <AppHeading textAlign="center">{title}</AppHeading>

      {isSessionLoading && <Spinner mb={3} />}

      {!isSessionLoading && (
        <>
          {session && (
            <Column borderRadius={isMobile ? 0 : undefined}>
              <Alert bg={isDark ? "gray.600" : undefined} status="success">
                <AlertIcon />
                <Stack spacing={3} textAlign="center">
                  <Text>Vous êtes déjà connecté avec l'adresse e-mail :</Text>

                  <Text fontWeight="bold" ml={1}>
                    {session.user.email}
                  </Text>
                </Stack>
              </Alert>

              <Button
                colorScheme="red"
                leftIcon={<FaPowerOff />}
                mt={3}
                onClick={async () => {
                  dispatch(setIsSessionLoading(true));
                  dispatch(resetUserEmail());
                  await magic.user.logout();
                  await api.get("logout");
                  dispatch(setSession(null));
                  dispatch(setIsSessionLoading(false));
                }}
              >
                Se déconnecter
              </Button>
            </Column>
          )}

          {!session && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Column borderRadius={isMobile ? 0 : undefined} mt={3} mb={5}>
                <EmailControl
                  name="email"
                  control={control}
                  errors={errors}
                  register={register}
                  isDisabled={isLoggingIn}
                  isMultiple={false}
                  isRequired
                  mb={0}
                />

                <FormControl display="flex" flexDir="row" mb={0}>
                  <FormLabel mt={3}>Mot de passe</FormLabel>
                  <Checkbox
                    borderColor={isDark ? "white" : "black"}
                    onChange={() => setIsPassword(!isPassword)}
                  />
                </FormControl>

                {isPassword && (
                  <PasswordControl
                    errors={errors}
                    register={register}
                    noLabel
                    mb={3}
                  />
                )}

                <Button
                  type="submit"
                  colorScheme="green"
                  isLoading={isLoggingIn}
                  isDisabled={isLoggingIn || Object.keys(errors).length > 0}
                  fontSize="sm"
                >
                  {isPassword
                    ? "Se connecter"
                    : "Envoyer un e-mail de connexion"}
                </Button>
              </Column>

              <Column borderRadius={isMobile ? 0 : undefined} pb={0}>
                <SocialLogins
                  flexDirection="column"
                  onSubmit={onLoginWithSocial}
                />
              </Column>
            </form>
          )}
        </>
      )}
    </Flex>
  );
};
