import { Box, Flex } from "@chakra-ui/react";

import { useRouter } from "next/router";
import React, { PropsWithChildren, useEffect } from "react";
import { EntityAddButton, AppHeading, Row } from "features/common";
import { Layout } from "features/layout";
import { PageProps } from "main";
import { EOrgType } from "models/Org";

export const NotFound = ({
  children,
  isRedirect = false,
  message = "",
  ...props
}: PropsWithChildren<
  PageProps & { isRedirect?: boolean; message?: string }
>) => {
  const router = useRouter();
  //console.log("🚀 ~ file: NotFound.tsx:15 ~ const:", router.query.name);
  const [entityName, _] = Array.isArray(router.query.name)
    ? router.query.name
    : [];

  useEffect(() => {
    if (isRedirect)
      setTimeout(() => {
        router.push("/");
      }, 2000);
  }, []);

  return (
    <Layout
      {...props}
      pageTitle={`${entityName === "forum" ? "Forum" : "Page"} introuvable`}
    >
      <Box mx={3}>
        {children ? (
          <>
            {message && (
              <Row
                border={!message && !isRedirect ? 0 : undefined}
                p={3}
                mb={3}
              >
                {message}
              </Row>
            )}
            {children}
            {isRedirect && (
              <Row
                border={!message && !isRedirect ? 0 : undefined}
                p={3}
                mt={message || children ? 3 : undefined}
              >
                Vous allez être redirigé vers la page d'accueil dans quelques
                secondes...
              </Row>
            )}
          </>
        ) : message || isRedirect ? (
          <>
            {message && (
              <Row border={!message && !isRedirect ? 0 : undefined} p={3}>
                {message}
              </Row>
            )}
            {isRedirect && (
              <Row
                border={!message && !isRedirect ? 0 : undefined}
                p={3}
                mt={message ? 3 : undefined}
              >
                Vous allez être redirigé vers la page d'accueil dans quelques
                secondes...
              </Row>
            )}
          </>
        ) : (
          <Flex flexDir="column" alignItems="flex-start">
            <EntityAddButton
              label={`Créer l'atelier « ${entityName} »`}
              orgName={entityName}
              orgType={EOrgType.NETWORK}
              mb={3}
            />
            {/* <EntityAddButton
            label={`Créer l'arbre « ${entityName} »`}
            orgName={entityName}
            orgType={EOrgType.GENERIC}
            mb={3}
          /> */}
            <EntityAddButton
              label={`Créer l'événement « ${entityName} »`}
              eventName={entityName}
            />
          </Flex>
        )}
      </Box>
    </Layout>
  );
};
