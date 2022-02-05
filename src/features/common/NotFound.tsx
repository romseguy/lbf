import { Flex, Heading } from "@chakra-ui/layout";
import { Container } from "features/common";
import { Layout } from "features/layout";
import router from "next/router";
import { PageProps } from "pages/_app";
import React from "react";

export const NotFound = ({
  isRedirect = true,
  message = "",
  ...props
}: PageProps & { isRedirect?: boolean; message?: string }) => {
  if (isRedirect)
    setTimeout(() => {
      router.push("/");
    }, 2000);

  return (
    <Layout {...props} pageTitle="Page introuvable" {...props}>
      <Flex>
        <Heading className="rainbow-text" fontFamily="DancingScript">
          Page introuvable
        </Heading>
      </Flex>

      <Container>
        {message}
        {isRedirect &&
          "Vous allez être redirigé vers la page d'accueil dans quelques secondes..."}
      </Container>
    </Layout>
  );
};
