import {
  Alert,
  AlertIcon,
  ButtonProps,
  Flex,
  Spinner,
  Stack,
  Text,
  useColorMode
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { ArrowBackIcon } from "@chakra-ui/icons";
import { OAuthProvider } from "@magic-ext/oauth";
import bcrypt from "bcryptjs";
import { FaPowerOff } from "react-icons/fa";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { css } from "twin.macro";
import { getUser } from "features/api/usersApi";
import { AppHeading, Button, Column } from "features/common";
import { breakpoints } from "features/layout/theme";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { useAppDispatch, wrapper } from "store";
import { resetUserEmail } from "store/userSlice";
import api from "utils/api";
import { magic } from "utils/auth";
import { LoginForm } from "features/forms/LoginForm";
import { mainStyles } from "features/layout";

const onLoginWithSocial = async (provider: OAuthProvider) => {
  await magic.oauth.loginWithRedirect({
    provider,
    redirectURI: new URL("/callback", window.location.origin).href
  });
};

const BackButton = ({ ...props }: ButtonProps & {}) => {
  const router = useRouter();
  return (
    <Button
      colorScheme="blue"
      leftIcon={<ArrowBackIcon />}
      onClick={() => router.push("/", "/", { shallow: true })}
      {...props}
    >
      Retour à l'accueil
    </Button>
  );
};

const LoginPage = ({ isMobile, ...props }: PageProps) => {
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
  const title = `Connexion – ${process.env.NEXT_PUBLIC_SHORT_URL}`;
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
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
      </Head>

      <Flex
        flexDir="column"
        css={css(
          mainStyles({ isDark, isMobile }) +
            `background-color: ${isDark ? "#2D3748" : "lightblue"};`
        )}
      >
        <Flex
          flexDirection="column"
          width={isMobile ? "auto" : "md"}
          m="0 auto"
        >
          {!session && <BackButton my={3} />}

          <AppHeading>Connexion</AppHeading>

          {isSessionLoading && <Spinner mb={3} />}

          {!isSessionLoading && (
            <>
              {session && (
                <Column borderRadius={isMobile ? 0 : undefined} mb={3}>
                  <Alert bg={isDark ? "gray.600" : undefined} status="success">
                    <AlertIcon />
                    <Stack spacing={3} textAlign="center">
                      <Text>
                        Vous êtes déjà connecté avec l'adresse e-mail :
                      </Text>

                      <Text fontWeight="bold" ml={1}>
                        {session.user.email}
                      </Text>
                    </Stack>
                  </Alert>

                  <BackButton mt={3} />

                  <Button
                    colorScheme="red"
                    leftIcon={<FaPowerOff />}
                    mt={3}
                    onClick={async () => {
                      dispatch(setIsSessionLoading(true));
                      dispatch(resetUserEmail());
                      if (await magic.user.isLoggedIn()) {
                        await magic.user.logout();
                      }
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
                <LoginForm
                  {...props}
                  isMobile={isMobile}
                  title=""
                  //title="Veuillez saisir votre adresse e-mail ci-dessous pour accéder aux ateliers"
                />
              )}
            </>
          )}
        </Flex>
      </Flex>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    return { props: {} };
  }
);

export default LoginPage;
