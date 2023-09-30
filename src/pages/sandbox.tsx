import { Spinner, useColorMode } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Layout } from "features/layout";
import { PageProps } from "main";
import api from "utils/api";
import { logJson, sanitize } from "utils/string";

const Sandbox = ({ ...props }: PageProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const description = "Test de <a href='https://fast.com'>lien</a>";
  return (
    <div className="rteditor">
      <div
        dangerouslySetInnerHTML={{
          __html: sanitize(description)
        }}
      />
    </div>
  );

  //const [error, setError] = useState();
  const [data, setData] = useState();
  console.log("🚀 ~ file: sandbox.tsx:13 ~ Sandbox ~ data:", data);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("sandbox");
        setIsLoading(false);

        if (res.error) console.log("1", res.error);
        else if (res.data) setData(res.data);
      } catch (error) {
        console.log("🚀 ~ file: sandbox.tsx:23 ~ error:", error);
      }
    })();
  }, [isLoading]);

  return (
    <Layout pageTitle="Sandbox" {...props}>
      {isLoading ? (
        <Spinner />
      ) : (
        <button onClick={() => setIsLoading(true)}>call</button>
      )}
    </Layout>
  );
  //return <>{isDark ? "dark" : "light"}</>;
};

export default Sandbox;
