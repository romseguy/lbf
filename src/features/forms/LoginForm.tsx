import {
  Alert,
  AlertIcon,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Spinner,
  Stack,
  Text,
  useColorMode
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { OAuthProvider } from "@magic-ext/oauth";
import bcrypt from "bcryptjs";
import { FaPowerOff } from "react-icons/fa";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { getUser } from "features/api/usersApi";
import {
  AppHeading,
  Button,
  Column,
  EmailControl,
  ErrorMessageText,
  PasswordControl
} from "features/common";
import { SocialLogins } from "features/session/SocialLogins";
import { useRouterLoading } from "hooks/useRouterLoading";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { useAppDispatch } from "store";
import { resetUserEmail } from "store/userSlice";
import api from "utils/api";
import { magic } from "utils/auth";
import { handleError } from "utils/form";
import { ErrorMessage } from "@hookform/error-message";

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
  const router = useRouter();
  const routerLoading = useRouterLoading();
  const {
    data: session,
    loading: isSessionLoading,
    setSession,
    setIsSessionLoading
  } = useSession();
  const toast = useToast({ position: "top" });
  //const [postResetPasswordMail] = usePostResetPasswordMailMutation();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const isLoading = isLoggingIn || routerLoading.isLoading;
  const [isPassword, setIsPassword] = useState(false);
  //const [isSent, setIsSent] = useState(false);

  //#region form
  const { clearErrors, register, control, errors, setError, handleSubmit } =
    useForm({ mode: "onChange" });
  //const email = useWatch<string>({ control, name: "email" });
  //const password = useWatch<string>({ control, name: "password" });

  const onChange = () => {
    clearErrors("formErrorMessage");
  };
  const onSubmit = async (form: { email: string; password?: string }) => {
    console.log("submitted", form);
    setIsLoggingIn(true);

    try {
      if (form.password) {
        const { data: user } = await dispatch(
          getUser.initiate({ slug: form.email })
        );

        if (!user) throw new Error("Identifiants incorrects");

        if (user?.passwordSalt) {
          const hash = await bcrypt.hash(form.password, user.passwordSalt);
          const {
            data
          } = await api.post("login", { email: form.email, hash });

          if (data && data.authenticated) router.push("/", "/", { shallow: true });
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
      console.log("🚀 ~ onSubmit ~ error:", error);
      setIsLoggingIn(false);
      handleError(error, (message, field) => {
        console.log("🚀 ~ handleError ~ message:", message);
        console.log("🚀 ~ handleError ~ field:", field);
        setError(field || "formErrorMessage", {
          type: "manual",
          message
        });
      });
    }
  };
  //#endregion

  return (
    <Flex flexDirection="column" width={isMobile ? "auto" : "md"} m="0 auto">
      <AppHeading textAlign="center" smaller>
        {title}
      </AppHeading>

      <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
        <Column borderRadius={isMobile ? 0 : undefined} mt={3} mb={5}>
          <Flex
            flexDirection="column"
            //width={isMobile ? "auto" : "md"}
            m="0 auto"
          >
            <Alert
              fontSize="18px"
              status="info"
              m="0 auto"
              mb={5}
              {...(isMobile ? { mt: 12 } : {})}
            >
              <AlertIcon />
              <Text align="justify">
                Pour accéder aux forums{" "}
                <b>
                  saisissez simplement votre adresse e-mail ci-dessous pour
                  recevoir un e-mail
                </b>{" "}
                qui vous permettra de vous identifier. Vous aurez ensuite la
                possibilité de définir un mot de passe pour votre compte.
              </Text>
            </Alert>
          </Flex>

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

          <Button
            type="submit"
            colorScheme="green"
            isLoading={isLoading}
            isDisabled={isLoading || Object.keys(errors).length > 0}
            fontSize="sm"
          >
            {isPassword ? "Se connecter" : "Envoyer un e-mail de connexion"}
          </Button>
        </Column>

        <Column borderRadius={isMobile ? 0 : undefined} pb={0}>
          <SocialLogins flexDirection="column" onSubmit={onLoginWithSocial} />
        </Column>
      </form>
    </Flex>
  );
};
