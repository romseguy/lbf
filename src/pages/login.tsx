import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  Heading,
  Image,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useColorMode
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { OAuthProvider } from "@magic-ext/oauth";
import { FaPowerOff } from "react-icons/fa";
import Head from "next/head";
import { useRouter } from "next/router";
import NextNprogress from "nextjs-progressbar";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { css } from "twin.macro";
import {
  Button,
  Column,
  DarkModeSwitch,
  EmailControl,
  Link
} from "features/common";
import { breakpoints } from "features/layout/theme";
import { SocialLogins } from "features/session/SocialLogins";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { useAppDispatch } from "store";
import { resetUserEmail } from "store/userSlice";
import api from "utils/api";
import { magic } from "utils/auth";
import { capitalize } from "utils/string";

const LoginPage = ({ isMobile, ...props }: PageProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    data: session,
    loading: isSessionLoading,
    setSession,
    setIsSessionLoading
  } = useSession();
  const { register, control, errors, handleSubmit, setValue } = useForm();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const onSubmit = async (form: { email: string }) => {
    console.log("submitted", form);

    try {
      setIsLoggingIn(true);
      await magic.auth.loginWithMagicLink({
        email: form.email,
        redirectURI: new URL("/callback", window.location.origin).href
      });
    } catch {
      setIsLoggingIn(false);
    }
  };

  const onLoginWithSocial = async (provider: OAuthProvider) => {
    await magic.oauth.loginWithRedirect({
      provider,
      redirectURI: new URL("/callback", window.location.origin).href
    });
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{process.env.NEXT_PUBLIC_SHORT_URL} – Connexion</title>
      </Head>

      <Flex
        css={css`
          background-color: ${isDark ? "#2D3748" : "lightblue"};
          flex-direction: column;
          flex-grow: 1;

          @media (min-width: ${breakpoints["2xl"]}) {
            margin: 0 auto;
            width: 1180px;
            border-left: 12px solid transparent;
            border-right: 12px solid transparent;
            border-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E %3ClinearGradient id='g' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23cffffe' /%3E%3Cstop offset='25%25' stop-color='%23f9f7d9' /%3E%3Cstop offset='50%25' stop-color='%23fce2ce' /%3E%3Cstop offset='100%25' stop-color='%23ffc1f3' /%3E%3C/linearGradient%3E %3Cpath d='M1.5 1.5 l97 0l0 97l-97 0 l0 -97' stroke-linecap='square' stroke='url(%23g)' stroke-width='3'/%3E %3C/svg%3E")
              1;
          }
        `}
      >
        <NextNprogress
          color="#29D"
          startPosition={0.3}
          stopDelayMs={200}
          height={3}
          showOnShallow={true}
        />

        <Box position="fixed" right={4} bottom={1}>
          <Tooltip
            placement="top-start"
            label={`Basculer vers le thème ${isDark ? "clair" : "sombre"}`}
            hasArrow
          >
            <Box>
              <DarkModeSwitch />
            </Box>
          </Tooltip>
        </Box>

        <Flex
          flexDirection="column"
          width={isMobile ? "auto" : "md"}
          m="0 auto"
        >
          <Link href="/" m="0 auto">
            <Heading fontFamily="Lato">
              {process.env.NEXT_PUBLIC_SHORT_URL}
            </Heading>
          </Link>

          <Link href="/" m="0 auto" mb="3">
            <Image height="100px" src="/images/bg.png" m="0 auto" />
          </Link>

          {isSessionLoading && (
            <Box m="0 auto" mb="3">
              <Spinner />
            </Box>
          )}

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

                  <Button
                    colorScheme="blue"
                    leftIcon={<ArrowBackIcon />}
                    mt={3}
                    onClick={() => router.push("/", "/", { shallow: true })}
                  >
                    Retour à l'accueil
                  </Button>

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
                <>
                  <Alert
                    bg={isDark ? "gray.600" : "lightcyan"}
                    status="info"
                    py={5}
                  >
                    <AlertIcon /> Pour vous connecter à votre compte, pas besoin
                    d'inscription, saisissez votre adresse e-mail ci-dessous
                    pour recevoir un e-mail de connexion :
                  </Alert>

                  <Column borderRadius={isMobile ? 0 : undefined} my={3}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <EmailControl
                        name="email"
                        register={register}
                        control={control}
                        errors={errors}
                        isDisabled={
                          isLoggingIn || Object.keys(errors).length > 0
                        }
                        isMultiple={false}
                        isRequired
                        setValue={setValue}
                        mb={3}
                      />

                      <Button
                        colorScheme="green"
                        isDisabled={
                          isLoggingIn || Object.keys(errors).length > 0
                        }
                        fontSize="sm"
                        type="submit"
                        mb={3}
                      >
                        Envoyer un e-mail de connexion
                      </Button>
                    </form>
                  </Column>

                  <Alert
                    bg={isDark ? "gray.600" : "lightcyan"}
                    status="info"
                    mb={3}
                    py={5}
                  >
                    <AlertIcon />
                    Ou connectez-vous grâce aux réseaux sociaux :
                  </Alert>

                  <Column borderRadius={isMobile ? 0 : undefined} mb={5} pb={0}>
                    <SocialLogins
                      flexDirection="column"
                      onSubmit={onLoginWithSocial}
                    />
                  </Column>
                </>
              )}
            </>
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default LoginPage;
