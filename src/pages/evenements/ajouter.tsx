import { useRouter } from "next/router";
import React from "react";
import { Column } from "features/common";
import { EventForm } from "features/forms/EventForm";
import { Layout } from "features/layout";
import { PageProps } from "pages/_app";

const EventsAddPage = (props: PageProps) => {
  const router = useRouter();
  const { orgId }: { orgId?: string } = router.query;

  const onSubmit = async (eventUrl: string) => {
    await router.push(`/${eventUrl}`, `/${eventUrl}`, {
      shallow: true
    });
  };

  return (
    <Layout {...props} pageTitle="Ajouter un événement">
      <Column>
        <EventForm {...props} orgId={orgId} onSubmit={onSubmit} />
      </Column>
    </Layout>
  );
};

export default EventsAddPage;
