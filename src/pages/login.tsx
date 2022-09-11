import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useColorMode
} from "@chakra-ui/react";
import Head from "next/head";
//import { useRouter } from "next/router";
import NextNprogress from "nextjs-progressbar";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { css } from "twin.macro";
import { Column, DarkModeSwitch, EmailControl } from "features/common";
import { breakpoints } from "features/layout/theme";
import { SocialLogins } from "features/session/SocialLogins";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { useAppDispatch } from "store";
import { resetUserEmail } from "store/userSlice";
import api from "utils/api";
import { handleLoginWithSocial, magic } from "utils/auth";
import { capitalize } from "utils/string";

const defaultTitle = process.env.NEXT_PUBLIC_SHORT_URL;

const LoginPage = ({ isMobile }: PageProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useAppDispatch();
  //const router = useRouter();
  const {
    data: session,
    loading,
    setSession,
    setIsSessionLoading
  } = useSession();

  //#region local state
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  //#endregion

  //#region form
  const { register, control, errors, handleSubmit, setValue } = useForm();
  const [email, setEmail] = useState<string | undefined>();
  //#endregion

  const onSubmit = async (form: { email: string }) => {
    console.log("submitted", form);

    try {
      setIsLoading(true);
      const redirectURI = `${process.env.NEXT_PUBLIC_URL}/callback`;
      magic.auth.loginWithMagicLink({
        email: form.email,
        redirectURI,
        showUI: false
      });
      setIsLoading(false);
      setIsSent(true);
      setEmail(form.email);
      //props.onClose && props.onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{defaultTitle} – Connexion</title>
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

        <Flex flexDirection="column" m="0 auto" my={3}>
          <Heading fontFamily="Lato">
            {capitalize(process.env.NEXT_PUBLIC_SHORT_URL)}
          </Heading>
          <Box m="0 auto">
            <Image height="100px" src="/images/bg.png" />
          </Box>
        </Flex>

        <Box m="0 auto">
          {isLoading || loading ? (
            <Spinner />
          ) : (
            <>
              {session ? (
                <Column
                  borderRadius={isMobile ? 0 : undefined}
                  mb={3}
                  width={isMobile ? "auto" : "md"}
                >
                  <Alert bg={isDark ? "gray.600" : undefined} status="success">
                    <AlertIcon />
                    <Stack spacing={3}>
                      <Text>
                        Vous êtes déjà connecté avec l'adresse e-mail :
                      </Text>

                      <Text fontWeight="bold" ml={1}>
                        {session.user.email}
                      </Text>

                      <Button
                        colorScheme="red"
                        onClick={async () => {
                          setIsSessionLoading(true);
                          dispatch(resetUserEmail());
                          await magic.user.logout();
                          await api.get("logout");
                          setSession(null);
                          setIsSessionLoading(false);
                          //router.push("/login", "/login", { shallow: true });
                        }}
                      >
                        Déconnexion
                      </Button>
                    </Stack>
                  </Alert>
                </Column>
              ) : (
                <>
                  {isSent ? (
                    <Alert
                      bg={isDark ? "gray.600" : undefined}
                      status="success"
                      py={5}
                    >
                      <AlertIcon />
                      Un e-mail de connexion a été envoyé à {email}.
                    </Alert>
                  ) : (
                    <>
                      <Alert
                        bg={isDark ? "gray.600" : "lightcyan"}
                        status="info"
                        py={5}
                        width={isMobile ? "auto" : "md"}
                        css={css`
                          margin-bottom: 12px;
                          margin: 0 auto;
                        `}
                      >
                        <AlertIcon /> Pour vous connecter à votre compte Koala,
                        pas besoin d'inscription, saisissez simplement votre
                        adresse e-mail ci-dessous pour recevoir un e-mail de
                        connexion :
                      </Alert>

                      <Column
                        borderRadius={isMobile ? 0 : undefined}
                        m="0 auto"
                        my={3}
                        width={isMobile ? "auto" : "md"}
                      >
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <EmailControl
                            name="email"
                            register={register}
                            control={control}
                            errors={errors}
                            display={isSent ? "none" : "block"}
                            isMultiple={false}
                            isRequired
                            setValue={setValue}
                            mb={3}
                          />

                          <Button
                            colorScheme="green"
                            display={isSent ? "none" : "block"}
                            fontSize="sm"
                            type="submit"
                            isDisabled={Object.keys(errors).length > 0}
                            mb={3}
                          >
                            Envoyer un e-mail de connexion
                          </Button>
                        </form>
                      </Column>

                      <Alert
                        bg={isDark ? "gray.600" : "lightcyan"}
                        status="info"
                        m="0 auto"
                        mb={3}
                        py={5}
                        width={isMobile ? "auto" : "md"}
                      >
                        <AlertIcon />
                        Ou connectez-vous grâce aux réseaux sociaux :
                      </Alert>

                      <Column
                        borderRadius={isMobile ? 0 : undefined}
                        m="0 auto"
                        mb={5}
                        pb={0}
                      >
                        <SocialLogins
                          flexDirection="column"
                          onSubmit={handleLoginWithSocial}
                        />
                      </Column>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default LoginPage;
