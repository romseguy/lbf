import { Spinner, useColorMode } from "@chakra-ui/react";
import React from "react";
import { Layout } from "features/layout";
import { PageProps } from "main";

const Sandbox = ({ ...props }: PageProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  let t: React.FC<React.PropsWithChildren<{}>>;

  return (
    <Layout pageTitle="Sandbox" {...props}>
      {isDark ? "dark" : "light"}
    </Layout>
  );
  //return <>{isDark ? "dark" : "light"}</>;
};

export default Sandbox;
