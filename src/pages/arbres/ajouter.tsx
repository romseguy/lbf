import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { EntityAddPage } from "features/common";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { EOrgType } from "models/Org";

const OrganisationsAddPage = (props: PageProps) => {
  const router = useRouter();
  const { data } = useSession();
  const session = data || props.session;

  useEffect(() => {
    if (!session) {
      window.localStorage.setItem("path", router.asPath);
      router.push("/login", "/login", { shallow: true });
    }
  }, []);

  return <EntityAddPage orgType={EOrgType.GENERIC} {...props} />;
};

export default OrganisationsAddPage;
