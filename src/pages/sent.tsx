import { Alert, AlertIcon } from "@chakra-ui/react";
import { Layout } from "features/layout";
import { PageProps } from "./_app";

const SentPage = (props: PageProps) => {
  return (
    <Layout {...props} pageTitle="Message envoyé">
      <Alert status="success">
        <AlertIcon />
        Votre message a été envoyé. Je vous répondrai dès que possible. Merci !
      </Alert>
    </Layout>
  );
};

export default SentPage;
