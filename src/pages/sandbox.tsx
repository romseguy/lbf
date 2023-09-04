import { Spinner } from "@chakra-ui/react";
import React from "react";
import { Layout } from "features/layout";
import { PageProps } from "main";

const Sandbox = ({ ...props }: PageProps) => {
  return (
    <Layout {...props}>
      <Spinner />
    </Layout>
  );
};

export default Sandbox;
