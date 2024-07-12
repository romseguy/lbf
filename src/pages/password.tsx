import { Alert, AlertIcon, Flex, Spinner, useToast } from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import bcrypt from "bcryptjs";
import { EditUserPayload, useEditUserMutation } from "features/api/usersApi";
import {
  PasswordControl,
  PasswordConfirmControl,
  AppHeading,
  Button,
  ErrorMessageText
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
  //const toast = useToast({ position: "top" });
  const toast = useToast();
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
    password: string;
    passwordConfirm: string;
  }) => {
    let payload: EditUserPayload = {};

    try {
      setIsLoading(true);

      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash(form.password, salt);
      payload.passwordSalt = salt;

      await editUser({
        slug: session!.user.email,
        payload
      }).unwrap();

      toast({ title: "Le mot de passe a bien été défini", status: "success" });

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
    <Layout {...props} pageTitle="Définir un nouveau mot de passe" noHeader>
      <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
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
    </Layout>
  );
};
export default PasswordPage;
