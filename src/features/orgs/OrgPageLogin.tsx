import { Alert, AlertIcon, Button } from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Column, ErrorMessageText, PasswordControl } from "features/common";
import { Layout } from "features/layout";
import { PageProps } from "main";
import { IOrg, orgTypeFull } from "models/Org";
import { AppQueryWithData } from "utils/types";

export const OrgPageLogin = ({
  orgQuery,
  status,
  onSubmit,
  ...props
}: PageProps & {
  orgQuery: AppQueryWithData<IOrg>;
  status: number;
  onSubmit: (orgPassword: string) => Promise<void>;
}) => {
  const org = orgQuery.data;
  const { clearErrors, errors, handleSubmit, register, setError, setValue } =
    useForm({
      mode: "onChange"
    });
  const [isLoading, setIsLoading] = useState(false);
  //const [isSent, setIsSent] = useState(false);
  useEffect(() => {
    if (status === 403) {
      setError("formErrorMessage", {
        type: "manual",
        message: "Mot de passe incorrect."
      });
      setValue("orgPassword", "");
    }
  }, [status]);

  // if (isSent)
  //   return (
  //     <Layout {...props} entity={org}>
  //       <Alert status="success">
  //         <AlertIcon />
  //         Un e-mail de réinitialisation de mot de passe a été envoyé au créateur{" "}
  //         {orgTypeFull(org.orgType)} {org.orgName}.
  //       </Alert>
  //     </Layout>
  //   );

  return (
    <Layout {...props} entity={org}>
      <form
        onChange={() => clearErrors()}
        onSubmit={handleSubmit(async (form: { orgPassword: string }) => {
          console.log("submitted", form);
          setIsLoading(true);

          await onSubmit(form.orgPassword);

          setIsLoading(false);
        })}
      >
        <Column maxWidth="350px">
          <PasswordControl
            name="orgPassword"
            label={`Mot de passe ${orgTypeFull(org.orgType)}`}
            errors={errors}
            register={register}
            mb={3}
          />

          <ErrorMessage
            errors={errors}
            name="formErrorMessage"
            data-cy="formErrorMessage"
            render={({ message }) => (
              <Alert status="error" mb={3}>
                <AlertIcon />
                <ErrorMessageText>{message}</ErrorMessageText>
              </Alert>
            )}
          />

          {/* <Link
            mb={3}
            _hover={{ textDecoration: "underline" }}
            onClick={async () => {
              const { orgUrl } = org;
              await postResetPasswordMail({ orgUrl }).unwrap();
              setIsSent(true);
            }}
          >
            Mot de passe oublié ?
          </Link> */}

          <Button
            colorScheme="green"
            type="submit"
            isLoading={isLoading}
            isDisabled={Object.keys(errors).length > 0}
          >
            Valider
          </Button>
        </Column>
      </form>
    </Layout>
  );
};
