import { useRouter } from "next/router";
import React, { useState } from "react";
import { Column } from "features/common";
import { OrgForm } from "features/forms/OrgForm";
import { Layout } from "features/layout";
import { EOrgType, orgTypeFull3 } from "models/Org";
import { PageProps } from "pages/_app";

const NetworksAddPage = (props: PageProps) => {
  const router = useRouter();
  const [orgType, setOrgType] = useState<EOrgType>(EOrgType.GENERIC);

  const onSubmit = async (orgUrl: string) => {
    await router.push(`/${orgUrl}`, `/${orgUrl}`, {
      shallow: true
    });
  };

  return (
    <Layout {...props} pageTitle={`Ajouter une planète`}>
      <Column>
        <OrgForm
          {...props}
          orgType={EOrgType.NETWORK}
          setOrgType={setOrgType}
          onSubmit={onSubmit}
        />
      </Column>
    </Layout>
  );
};

export default NetworksAddPage;
