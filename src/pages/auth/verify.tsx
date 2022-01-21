import { Alert, AlertIcon } from "@chakra-ui/react";
import { useEffect } from "react";
import router from "next/router";
import { Layout } from "features/layout";
import { PageProps } from "../_app";

const VerifyPage = (props: PageProps) => {
  // useEffect(() => {
  //   setTimeout(() => {
  //     router.push("/");
  //   }, 2000);
  // }, []);

  return (
    <Layout {...props}>
      <Alert status="success">
        <AlertIcon />
        {/* Un e-mail de connexion vous a été envoyé. Vous allez être redirigé vers
        la page d'accueil dans quelques secondes... */}
        Un e-mail de connexion vous a été envoyé.
      </Alert>
    </Layout>
  );
};

export default VerifyPage;
