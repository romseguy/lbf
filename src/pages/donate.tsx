import { Alert, AlertIcon } from "@chakra-ui/react";
import { Layout } from "features/layout";
import { useRouter } from "next/router";

const DonatePage = () => {
  const { query } = useRouter();
  let message = (
    <Alert status="warning">
      <AlertIcon />
      Le développeur vous remercie de votre contribution.
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

  return <Layout>{message}</Layout>;
};

export default DonatePage;
