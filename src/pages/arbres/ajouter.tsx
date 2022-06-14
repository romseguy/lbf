import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { EntityAddPage } from "features/common";
import { getSession } from "hooks/useAuth";
import { Session } from "lib/SessionContext";
import { EOrgType } from "models/Org";
import { PageProps } from "pages/_app";

const OrganisationsAddPage = (props: PageProps) => {
  const router = useRouter();
  useEffect(() => {
    if (!props.isSessionLoading && !props.session) {
      window.localStorage.setItem("path", router.asPath);
      router.push("/?login", "/?login", { shallow: true });
    }
  }, [props.isSessionLoading]);

  return <EntityAddPage orgType={EOrgType.GENERIC} {...props} />;
};

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ session: Session | null }>> {
  const session = await getSession({ req: ctx.req });

  // if (!session)
  //   return { redirect: { permanent: false, destination: "/?login" } };

  return { props: { session } };
}

export default OrganisationsAddPage;
