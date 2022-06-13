import { Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { Column } from "features/common";
import { OrgForm } from "features/forms/OrgForm";
import { Layout } from "features/layout";
import { EOrgType } from "models/Org";
import { PageProps } from "pages/_app";
import { EventForm } from "features/forms/EventForm";

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
  };

  return (
    <Layout
      {...props}
      pageTitle={`Ajouter ${
        !orgType
          ? "un événement"
          : orgType === EOrgType.GENERIC
          ? "un arbre"
          : "une planète"
      }`}
    >
      <Column>
        {props.isSessionLoading ? (
          <Spinner />
        ) : (
          props.session && (
            <>
              {orgType ? (
                <OrgForm {...props} orgType={orgType} onSubmit={onSubmit} />
              ) : (
                <EventForm {...props} orgId={orgId} onSubmit={onSubmit} />
              )}
            </>
          )
        )}
      </Column>
    </Layout>
  );
};
