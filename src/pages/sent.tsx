import { Alert, AlertIcon } from "@chakra-ui/react";
import { Layout } from "features/layout";
import { PageProps } from "main";

const SentPage = (props: PageProps) => {
  return (
    <Layout {...props} pageTitle="Message envoyé">
      <Alert status="success">
        <AlertIcon />
        Votre message a été envoyé. Nous vous répondrons dès que possible.
      </Alert>
    </Layout>
  );
};

export default SentPage;
