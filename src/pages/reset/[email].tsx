import { Alert, AlertIcon, Flex, Spinner, useToast } from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import bcrypt from "bcryptjs";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { ParsedUrlQuery } from "querystring";
import {
  PasswordControl,
  PasswordConfirmControl,
  Button,
  ErrorMessageText,
  AppHeading
} from "features/common";
import { Layout } from "features/layout";
import { PageProps } from "main";
import { useRouter } from "next/router";
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { handleError } from "utils/form";
import { fromUnixTime, isBefore } from "date-fns";
import {
  useCheckSecurityCodeMutation,
  useEditUserMutation,
  useGetUserQuery
} from "features/api/usersApi";

interface ResetPageProps {}

type FormValues = {
  formErrorMessage?: string;
  orgPassword?: string;
  orgPasswordConfirm?: string;
};

const ResetPage = ({ ...props }: PageProps & ResetPageProps) => {
  const router = useRouter();
  const { code, email } = router.query;
  const toast = useToast({ position: "top" });

  // todo check securityCode
  const [checkSecurityCode] = useCheckSecurityCodeMutation();
  const [editUser] = useEditUserMutation();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const isSecurityCodeValid = await checkSecurityCode({
          payload: { code: code as string, email: email as string }
        }).unwrap();

        if (isSecurityCodeValid) {
          setIsValid(true);
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    })();
  }, []);

  const { control, errors, clearErrors, handleSubmit, register, setError } =
    useForm<FormValues>({
      mode: "onChange"
    });
  const password = useRef<string | undefined>();
  password.current = useWatch({ control, name: "password" }) || "";

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: {
    password: string;
    passwordConfirm: string;
  }) => {
    console.log("submitted", form);
    setIsLoading(true);

    try {
      const passwordSalt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(form.password, passwordSalt);

      await editUser({
        payload: { password, passwordSalt },
        slug: email as string
      }).unwrap();

      toast({
        title: `Le mot de passe a été modifié !`,
        status: "success"
      });

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

  return (
    <Layout {...props} pageTitle="Réinitialisation de mot de passe">
      {isLoading && <Spinner />}

      {!isLoading && !isValid && (
        <Alert status="error">
          <AlertIcon />
          Le lien de réinitialisation de mot de passe est invalide ou a expiré.
        </Alert>
      )}

      {!isLoading && isValid && (
        <>
          {/* <AppHeading smaller mb={3}>
              Réinitialiser le mot de passe
            </AppHeading> */}

          <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
            <PasswordControl
              name="password"
              errors={errors}
              register={register}
              mb={3}
            />

            <PasswordConfirmControl
              name="passwordConfirm"
              errors={errors}
              register={register}
              password={password}
              mb={5}
            />

            <ErrorMessage
              errors={errors}
              name="formErrorMessage"
              render={({ message }) => (
                <Alert status="error" mb={5}>
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
          </form>
        </>
      )}
    </Layout>
  );
};

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ResetPageProps>> {
  const code = (ctx.params as ParsedUrlQuery).code as string;
  return { props: {} };
}

export default ResetPage;
