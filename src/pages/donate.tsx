import { Alert, AlertIcon } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { useRouter } from "next/router";
import { Layout } from "features/layout";
import { PageProps } from "main";

const DonatePage = (props: PageProps) => {
  const { query } = useRouter();
  let message = (
    <Alert status="success">
      <AlertIcon />
      Nous vous remercions de votre générosité.
    </Alert>
  );

  if (query.nok !== undefined) {
    message = (
      <Alert status="warning">
        <AlertIcon />
        Votre demande de don a été annulée.
      </Alert>
    );
  }

  return (
    <Layout {...props} pageTitle="Faire un don">
      {message}
    </Layout>
  );
};

export default DonatePage;
