import { Spinner } from "@chakra-ui/react";
import React, { useState } from "react";
import { Layout } from "features/layout";
import { PageProps } from "main";
import api from "utils/api";
import { useGetOrgsQuery } from "features/api/orgsApi";
import { EOrgType, IOrg } from "models/Org";
import { AppQuery } from "utils/types";
import { useSession } from "hooks/useSession";

const Sandbox = ({ ...props }: PageProps) => {
  const { data: session } = useSession();
  if (!session) throw new Error("niet");

  //const createdBy = session ? session.user.userId : undefined;
  const createdBy = session.user.userId;

  const orgsQuery = useGetOrgsQuery({
    createdBy,
    orgType: EOrgType.NETWORK,
    populate: "orgs createdBy"
  }) as AppQuery<IOrg[]>;

  const json = {
    type: "text/x-moz-place-container",
    root: "placesRoot",
    children: [
      {
        type: "text/x-moz-place-container",
        root: "toolbarFolder",
        children: orgsQuery.data?.map((org) => ({
          type: "text/x-moz-place",
          uri: process.env.NEXT_PUBLIC_URL + "/" + org.orgUrl
        }))
      }
    ]
  };

  console.log("🚀 ~ Sandbox ~ json:", json);

  return null;
};

export default Sandbox;

{
  /* 
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
  */
}

{
  /*
  const [error, setError] = useState();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Layout pageTitle="Sandbox" {...props}>
      {isLoading ? (
        <Spinner />
      ) : (
        <button
          onClick={async () => {
            try {
              setIsLoading(true);
              const res = await api.get("sandbox");

              if (res.error) console.log("error", res.error);
              else if (res.data) setData(res.data);
            } catch (error) {
            } finally {
              setIsLoading(false);
            }
          }}
        >
          call
        </button>
      )}
    </Layout>
  );
*/
}
