import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Column } from "features/common";
import { OrgForm } from "features/forms/OrgForm";
import { Layout } from "features/layout";
import { getSession } from "hooks/useAuth";
import { EOrgType } from "models/Org";
import { PageProps } from "pages/_app";

const OrganisationsAddPage = (props: PageProps) => {
  const router = useRouter();
  const [orgType, setOrgType] = useState<EOrgType>(EOrgType.GENERIC);

  const onSubmit = async (orgUrl: string) => {
    await router.push(`/${orgUrl}`, `/${orgUrl}`, {
      shallow: true
    });
  };

  return (
    <Layout {...props} pageTitle={`Ajouter un arbre`}>
      <Column>
        <OrgForm
          {...props}
          orgType={EOrgType.GENERIC}
          setOrgType={setOrgType}
          onSubmit={onSubmit}
        />
      </Column>
    </Layout>
  );
};

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{}>> {
  const session = await getSession({ req: ctx.req });

  if (!session)
    return { redirect: { permanent: false, destination: "/?login" } };

  return { props: {} };
}

export default OrganisationsAddPage;
