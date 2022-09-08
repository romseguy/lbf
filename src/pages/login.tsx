import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Spinner
} from "@chakra-ui/react";
import Head from "next/head";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { css } from "twin.macro";
import { Column } from "features/common";
import { breakpoints } from "features/layout/theme";
import { EmailControl } from "features/common";
import { SocialLogins } from "features/session/SocialLogins";
import { handleLoginWithSocial, magic } from "utils/auth";
import { capitalize } from "utils/string";

const defaultTitle = process.env.NEXT_PUBLIC_SHORT_URL;

const LoginPage = () => {
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
          background-color: lightblue;
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
        <Flex flexDirection="column" m="0 auto" my={3}>
          <Heading fontFamily="Lato">
            {capitalize(process.env.NEXT_PUBLIC_SHORT_URL)}
          </Heading>
          <Box m="0 auto">
            <Image height="100px" src="/images/bg.png" />
          </Box>
        </Flex>

        {isLoading && <Spinner m="0 auto" />}

        {isSent && (
          <Alert status="success" py={5}>
            <AlertIcon />
            Un e-mail de connexion a été envoyé à {email}.
          </Alert>
        )}

        {!isSent && (
          <>
            <Alert
              status="info"
              bg="lightcyan"
              py={5}
              width={["auto", "md"]}
              css={css`
                margin-bottom: 12px;
                @media (min-width: ${breakpoints["2xl"]}) {
                  margin: 0 auto;
                  margin-bottom: 12px;
                }
              `}
            >
              <AlertIcon /> Pour vous connecter à votre compte Koala, pas besoin
              d'inscription, saisissez simplement votre adresse e-mail
              ci-dessous pour recevoir un e-mail de connexion :
            </Alert>

            <Column
              css={css`
                margin-bottom: 12px;
                @media (min-width: ${breakpoints["2xl"]}) {
                  margin: 0 auto;
                  margin-bottom: 12px;
                }
              `}
              width={["auto", "md"]}
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
              status="info"
              bg="lightcyan"
              my={3}
              py={5}
              width={["auto", "md"]}
              css={css`
                margin-bottom: 12px;
                @media (min-width: ${breakpoints["2xl"]}) {
                  margin: 0 auto;
                  margin-bottom: 12px;
                }
              `}
            >
              <AlertIcon />
              Ou connectez-vous grâce aux réseaux sociaux :
            </Alert>

            <Column m="0 auto" pb={0} mb={5}>
              <SocialLogins
                flexDirection="column"
                onSubmit={handleLoginWithSocial}
              />
            </Column>
          </>
        )}
      </Flex>
    </>
  );
};

export default LoginPage;
