import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { EntityAddPage, NotFound } from "features/common";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { EOrgType } from "models/Org";

const OrganisationsAddPage = (props: PageProps) => {
  const router = useRouter();
  const { data: session, loading } = useSession();

  useEffect(() => {
    if (!session && !loading) {
      window.localStorage.setItem("path", router.asPath);
      router.push("/login", "/login", { shallow: true });
    }
  }, [session, loading]);

  return <NotFound {...props} isRedirect />;
  return <EntityAddPage orgType={EOrgType.GENERIC} {...props} />;
};

export default OrganisationsAddPage;
