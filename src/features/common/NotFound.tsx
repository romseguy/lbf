import { Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Container } from "features/common";
import { Layout } from "features/layout";
import { PageProps } from "pages/_app";

export const NotFound = ({
  isRedirect = true,
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
