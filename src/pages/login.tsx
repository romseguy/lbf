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
        as="main"
        css={css`
          background-color: ${isDark ? "#2D3748" : "lightblue"};

          @media (min-width: ${breakpoints["2xl"]}) {
            margin: 0 auto;
            /*height: ${window.innerHeight}px;*/
            width: 1180px;
            ${isDark
              ? `
            border-left: 12px solid transparent;
            border-right: 12px solid transparent;
            border-image: linear-gradient(to bottom right, #b827fc 0%, #2c90fc 25%, #b8fd33 50%, #fec837 75%, #fd1892 100%);
            border-image-slice: 1;
            `
              : `
            border-left: 12px solid transparent;
            border-right: 12px solid transparent;
            border-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E %3ClinearGradient id='g' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23cffffe' /%3E%3Cstop offset='25%25' stop-color='%23f9f7d9' /%3E%3Cstop offset='50%25' stop-color='%23fce2ce' /%3E%3Cstop offset='100%25' stop-color='%23ffc1f3' /%3E%3C/linearGradient%3E %3Cpath d='M1.5 1.5 l97 0l0 97l-97 0 l0 -97' stroke-linecap='square' stroke='url(%23g)' stroke-width='3'/%3E %3C/svg%3E") 1;
            `};
          }
        `}
      >
        <Flex
          flexDirection="column"
          width={isMobile ? "auto" : "md"}
          m="0 auto"
        >
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

{
  /*

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
                      <Checkbox onChange={() => setIsPassword(!isPassword)} />
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

                  <Column borderRadius={isMobile ? 0 : undefined} mb={5} pb={0}>
                    <SocialLogins
                      flexDirection="column"
                      onSubmit={onLoginWithSocial}
                    />
                  </Column>

                  <BackButton colorScheme="red" mb={5} />
                </form>
  */
}

{
  /* <Link href="/" m="0 auto" mt={3} mb={1}>
            <Image height="100px" src="/images/bg.png" m="0 auto" />
          </Link> */
}

{
  /* <Alert
                    bg={isDark ? "gray.600" : "lightcyan"}
                    status="info"
                    py={5}
                  >
                    <AlertIcon /> Pour vous connecter à votre compte, pas besoin
                    de mot de passe, saisissez votre adresse e-mail ci-dessous
                    pour recevoir un e-mail de connexion :
                  </Alert> */
}

{
  /* <Column borderRadius={isMobile ? 0 : undefined} mt={3} mb={5}>
                    <PasswordControl
                      label="Mot de passe (optionnel)"
                      register={register}
                      errors={errors}
                      isRequired={false}
                      mb={3}
                    />
                    <Link
                      _hover={{ textDecoration: "underline" }}
                      onClick={async () => {
                        if (!email) {
                          setError("email", {
                            message: "Veuillez saisir une adresse e-mail",
                            shouldFocus: true
                          });
                        } else {
                          await postResetPasswordMail({ email }).unwrap();
                          setIsSent(true);
                        }
                      }}
                    >
                      Mot de passe oublié ?
                    </Link>

                    {password && (
                      <Button
                        type="submit"
                        colorScheme="green"
                        isLoading={isLoggingIn}
                        isDisabled={
                          isLoggingIn || Object.keys(errors).length > 0
                        }
                        fontSize="sm"
                        mb={3}
                      >
                        {true
                          ? "Se connecter"
                          : "Envoyer un e-mail de récupération de mot de passe"}
                      </Button>
                    )}
                  </Column> */
}

{
  /* <Alert
                    bg={isDark ? "gray.600" : "lightcyan"}
                    status="info"
                    mb={3}
                    py={5}
                  >
                    <AlertIcon />
                    Ou connectez-vous grâce aux réseaux sociaux :
                  </Alert> */
}
