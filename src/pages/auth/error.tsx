import { Alert, AlertIcon } from "@chakra-ui/react";
import { useEffect } from "react";
import router from "next/router";
import { Layout } from "features/layout";
import { PageProps } from "../_app";

const VerifyPage = (props: PageProps) => {
  return (
    <Layout {...props}>
      <Alert status="error">
        <AlertIcon />
        error
      </Alert>
    </Layout>
  );
};

export default VerifyPage;
