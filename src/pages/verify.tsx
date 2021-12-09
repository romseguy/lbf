import { Alert, AlertIcon } from "@chakra-ui/react";
import { Layout } from "features/layout";
import { PageProps } from "./_app";

const Verify = (props: PageProps) => {
  return (
    <Layout {...props}>
      <Alert status="success">
        <AlertIcon />
        Un e-mail de connexion vous a été envoyé.
      </Alert>
    </Layout>
  );
};

export default Verify;
