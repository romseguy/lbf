import { Flex, Heading } from "@chakra-ui/layout";
import { Container } from "features/common";
import { Layout } from "features/layout";
import router from "next/router";
import { PageProps } from "pages/_app";
import React from "react";

export const NotFound = ({
  canRedirect,
  ...props
}: PageProps & { canRedirect: boolean }) => {
  if (canRedirect)
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
        Vous allez être redirigé vers la page d'accueil dans quelques
        secondes...
      </Container>
    </Layout>
  );
};
