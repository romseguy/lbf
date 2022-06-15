import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { Column } from "features/common";
import { EventForm } from "features/forms/EventForm";
import { OrgForm } from "features/forms/OrgForm";
import { Layout } from "features/layout";
import { EOrgType, orgTypeFull3 } from "models/Org";
import { PageProps } from "pages/_app";

export const EntityAddPage = ({
  orgType,
  ...props
}: PageProps & { orgType?: EOrgType }) => {
  const router = useRouter();
  const { orgId }: { orgId?: string } = router.query;
  const onSubmit = async (url: string) => {
    await router.push(`/${url}`, `/${url}`, {
      shallow: true
    });
    localStorage.removeItem("storageKey");
  };

  return (
    <Layout
      {...props}
      pageTitle={`Ajouter ${!orgType ? "un événement" : orgTypeFull3(orgType)}`}
    >
      <Column>
        {props.isSessionLoading ? (
          <Spinner />
        ) : props.session ? (
          <>
            {orgType ? (
              <OrgForm {...props} orgType={orgType} onSubmit={onSubmit} />
            ) : (
              <EventForm {...props} orgId={orgId} onSubmit={onSubmit} />
            )}
          </>
        ) : (
          <Alert status="info">
            <AlertIcon />
            Vous allez être redirigé vers la fenêtre de connexion...
          </Alert>
        )}
      </Column>
    </Layout>
  );
};
