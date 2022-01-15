import { Alert, AlertIcon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Layout } from "features/layout";
import { PageProps } from "./_app";

const DonatePage = (props: PageProps) => {
  const { query } = useRouter();
  let message = (
    <Alert status="warning">
      <AlertIcon />
      Le créateur de cet outil vous remercie de votre générosité.
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

  return <Layout {...props}>{message}</Layout>;
};

export default DonatePage;
