import { Alert, AlertIcon } from "@chakra-ui/react";
import { Layout } from "features/layout";
import { PageProps } from "./_app";

const SentPage = (props: PageProps) => {
  return (
    <Layout {...props}>
      <Alert status="success">
        <AlertIcon />
        Votre message a bien été envoyé. Je vous répondrai dès que possible.
        Merci !
      </Alert>
    </Layout>
  );
};

export default SentPage;
