import { NextPageContext } from "next";
import { Layout } from "features/layout";
import { PageProps } from "main";
import { Alert, AlertIcon, Box } from "@chakra-ui/react";

import { Column, ContactLink } from "features/common";
import { IEntity } from "models/Entity";
import { getEnv } from "utils/env";
import { getError } from "utils/query";
import { AppQuery } from "utils/types";

export const ErrorPage = ({
  query,
  ...props
}: PageProps & {
  query: AppQuery<IEntity>;
}) => {
  const columnProps = {
    maxWidth: "4xl",
    m: "0 auto",
    p: props.isMobile ? 2 : 3
  };
  const error = getError(query);

  if (getEnv() === "production")
    return (
      <Layout pageTitle="Erreur" {...props}>
        <Column {...columnProps}>
          <Box flexDir="row">
            Une erreur est survenue,{" "}
            <ContactLink label="merci de nous contacter" /> avec une description
            du scénario.
          </Box>
        </Column>
      </Layout>
    );

  return (
    <Layout mainContainer={false} noHeader pageTitle="Erreur" {...props}>
      <Column {...columnProps}>
        <Alert status="error">
          <AlertIcon />
          {error && error.message
            ? error.message
            : "Une erreur inconnue est survenue."}
        </Alert>
      </Column>
    </Layout>
  );
};

function Error({
  statusCode,
  message,
  ...props
}: PageProps & {
  statusCode?: number;
  message: string;
}) {
  return (
    <Layout pageTitle="Erreur" {...props}>
      <Alert status="error">
        <AlertIcon />
        {`Une erreur ${
          statusCode ? `(${statusCode})` : ""
        } est survenue : ${message}`}
      </Alert>
    </Layout>
  );
}

Error.getInitialProps = (ctx: NextPageContext) => {
  const { res, err } = ctx;
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const message = err?.message || "aucun message d'erreur";
  return { statusCode, message };
};

export default Error;
