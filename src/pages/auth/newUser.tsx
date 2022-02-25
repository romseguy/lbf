import { Alert, AlertIcon, Text } from "@chakra-ui/react";
import React from "react";
import { Column } from "features/common";
import { Layout } from "features/layout";
import { EmailLoginForm } from "features/forms/EmailLoginForm";
import { useSession } from "hooks/useAuth";
import { PageProps } from "../_app";

const NewUserPage = (props: PageProps) => {
  const { data: clientSession } = useSession();
  const session = clientSession || props.session;

  return (
    <Layout {...props}>
      <Alert status="success" mb={5}>
        <AlertIcon />
        <Text>
          {session
            ? "Vous avez été connecté à l'application."
            : "Votre compte a bien été créé."}
        </Text>
      </Alert>

      {!session && (
        <>
          <Alert status="warning" mb={5}>
            <AlertIcon />
            <Text>
              Pour vous connecter, merci de saisir à nouveau votre e-mail dans
              le formulaire ci-dessous :
            </Text>
          </Alert>
          <Column>
            <EmailLoginForm />
          </Column>
        </>
      )}
    </Layout>
  );
};

export default NewUserPage;
