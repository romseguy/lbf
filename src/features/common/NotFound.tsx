import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Heading, Row } from "features/common";
import { Layout } from "features/layout";
import { PageProps } from "main";

export const NotFound = ({
  isRedirect = false,
  message = "",
  ...props
}: PageProps & { isRedirect?: boolean; message?: string }) => {
  const router = useRouter();

  useEffect(() => {
    if (isRedirect)
      setTimeout(() => {
        router.push("/");
      }, 2000);
  }, []);

  return (
    <Layout {...props} pageTitle="Page introuvable" {...props}>
      <Row p={3}>
        {message}
        {!isRedirect && !message && "Veuillez réessayer."}
        {isRedirect &&
          "Vous allez être redirigé vers la page d'accueil dans quelques secondes..."}
      </Row>
    </Layout>
  );
};
