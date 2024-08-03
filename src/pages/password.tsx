import {
  Alert,
  AlertIcon,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
  useToast
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import bcrypt from "bcryptjs";
import { EditUserPayload, useEditUserMutation } from "features/api/usersApi";
import {
  PasswordControl,
  PasswordConfirmControl,
  AppHeading,
  Button,
  ErrorMessageText,
  Column
} from "features/common";
import { Layout } from "features/layout";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useAppDispatch } from "store";
import { resetUserEmail } from "store/userSlice";
import api from "utils/api";
import { magic } from "utils/auth";
import { handleError } from "utils/form";

const PasswordPage = ({ ...props }: PageProps & {}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session, setSession, setIsSessionLoading } = useSession();
  const toast = useToast({ position: "top" });
  const [editUser] = useEditUserMutation();

  const [isLoading, setIsLoading] = useState(false);
  const { clearErrors, control, errors, handleSubmit, register, setError } =
    useForm();
  const password = useRef<string | undefined>();
  password.current = useWatch({ control, name: "password" }) || "";

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: {
    userName: string;
    password: string;
    passwordConfirm: string;
  }) => {
    let payload: EditUserPayload = { userName: form.userName };

    try {
      setIsLoading(true);

      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash(form.password, salt);
      payload.passwordSalt = salt;

      await editUser({
        slug: session!.user.email,
        payload
      }).unwrap();

      toast({
        title:
          "Vous allez devoir vous reconnecter pour que les changements soient effectifs...",
        status: "success"
      });

      dispatch(resetUserEmail());
      dispatch(setSession(null));
      await magic.user.logout();
      await api.get("logout");
      router.push("/login", "/login", { shallow: false });

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      handleError(error, (message, field) => {
        setError(field || "formErrorMessage", {
          type: "manual",
          message
        });
      });
    }
  };

  const FooterFormControl = (
    <>
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

      <Flex justifyContent="space-between">
        {/* {props.onCancel && (
            <Button colorScheme="red" onClick={props.onCancel}>
              Annuler
            </Button>
          )} */}

        <Button
          colorScheme="green"
          type="submit"
          isLoading={isLoading}
          isDisabled={Object.keys(errors).length > 0}
        >
          Valider
        </Button>
      </Flex>
    </>
  );

  if (!session) return <Spinner />;

  return (
    <Layout {...props} pageTitle="Configurer votre compte" noHeader>
      <Column mx={3} maxWidth={["50%", "50%", "50%", "33%"]}>
        <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
          <FormControl
            isRequired={!!session.user}
            isInvalid={!!errors["userName"]}
            mb={3}
          >
            <FormLabel>Votre prénom</FormLabel>
            <Input
              name="userName"
              placeholder="Nom d'utilisateur"
              ref={register({
                required: session.user
                  ? "Veuillez saisir le nom de l'utilisateur"
                  : false
                // pattern: {
                //   value: /^[a-z0-9 ]+$/i,
                //   message:
                //     "Veuillez saisir un nom composé de lettres et de chiffres uniquement"
                // }
              })}
              defaultValue={session.user?.userName}
              data-cy="username-input"
            />
            <FormErrorMessage>
              <ErrorMessage errors={errors} name="userName" />
            </FormErrorMessage>
          </FormControl>

          <PasswordControl
            name="password"
            errors={errors}
            register={register}
            isRequired
            mb={3}
          />
          <PasswordConfirmControl
            name="passwordConfirm"
            errors={errors}
            register={register}
            password={password}
            mb={3}
          />
          {FooterFormControl}
        </form>
      </Column>
    </Layout>
  );
};
export default PasswordPage;
