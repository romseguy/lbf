import { useRouter } from "next/router";
import React, { useState } from "react";
import { Column } from "features/common";
import { EventForm } from "features/forms/EventForm";
import { Layout } from "features/layout";
import { PageProps } from "pages/_app";
//import { onCancelWithConfirm } from "utils/form";

const EventanisationsAddPage = (props: PageProps) => {
  const router = useRouter();
  const { orgId }: { orgId?: string } = router.query;
  const [isTouched, setIsTouched] = useState(false);

  //const onCancel = () => onCancelWithConfirm({ isTouched, onCancel: () => {} });
  const onSubmit = async (eventUrl: string) => {
    await router.push(`/${eventUrl}`, `/${eventUrl}`, {
      shallow: true
    });
  };

  return (
    <Layout {...props} pageTitle={`Ajouter un événement`}>
      <Column>
        <EventForm
          {...props}
          orgId={orgId}
          setIsTouched={setIsTouched}
          //onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </Column>
    </Layout>
  );
};

export default EventanisationsAddPage;
