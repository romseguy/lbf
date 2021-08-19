import { Alert, AlertIcon } from "@chakra-ui/react";
import { Layout } from "features/layout";

const Verify = () => {
  return (
    <Layout>
      <Alert status="success">
        <AlertIcon />
        Un e-mail de connexion vous a été envoyé.
      </Alert>
    </Layout>
  );
};

export default Verify;
