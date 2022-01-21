import { Alert, AlertIcon, Text } from "@chakra-ui/react";
import React from "react";
import { Layout } from "features/layout";
import { EmailLoginForm } from "features/forms/EmailLoginForm";
import { useSession } from "hooks/useAuth";
import { PageProps } from "../_app";
import { PageContainer } from "features/common";

const NewUserPage = (props: PageProps) => {
  const { data: clientSession } = useSession();
  const session = props.session || clientSession;

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
          <PageContainer>
            <EmailLoginForm />
          </PageContainer>
        </>
      )}
    </Layout>
  );
};

export default NewUserPage;
