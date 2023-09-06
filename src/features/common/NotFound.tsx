import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { EntityAddButton, AppHeading, Row } from "features/common";
import { Layout } from "features/layout";
import { PageProps } from "main";
import { EOrgType } from "models/Org";

export const NotFound = ({
  isRedirect = false,
  message = "",
  ...props
}: PageProps & { isRedirect?: boolean; message?: string }) => {
  const router = useRouter();
  const entityName = Array.isArray(router.query.name)
    ? router.query.name[0]
    : "";

  useEffect(() => {
    if (isRedirect)
      setTimeout(() => {
        router.push("/");
      }, 2000);
  }, []);

  return (
    <Layout {...props} pageTitle="Page introuvable" {...props}>
      <Row border={!message && !isRedirect ? 0 : undefined} p={3}>
        {!message && entityName ? (
          <Flex flexDir="column" alignItems="flex-start">
            <EntityAddButton
              label={`Créer la planète « ${entityName} »`}
              orgName={entityName}
              orgType={EOrgType.NETWORK}
              mb={3}
            />
            <EntityAddButton
              label={`Créer l'arbre « ${entityName} »`}
              orgName={entityName}
              orgType={EOrgType.GENERIC}
              mb={3}
            />
            <EntityAddButton
              label={`Créer l'événement « ${entityName} »`}
              eventName={entityName}
            />
          </Flex>
        ) : (
          message
        )}

        {isRedirect &&
          "Vous allez être redirigé vers la page d'accueil dans quelques secondes..."}
      </Row>
    </Layout>
  );
};
