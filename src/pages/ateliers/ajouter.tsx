import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { EntityAddPage } from "features/common";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { EOrgType } from "models/Org";
import { useErrorBoundary } from "react-error-boundary";

const NetworksAddPage = (props: PageProps) => {
  const { showBoundary } = useErrorBoundary();
  const router = useRouter();
  const { data: session, loading } = useSession();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        window.localStorage.setItem("path", router.asPath);
        router.push("/login", "/login", { shallow: true });
      } else if (!session.user.isAdmin) {
        showBoundary(
          new Error("Vous devez être administrateur pour accéder à cette page")
        );
      }
    }
  }, [session, loading]);

  return <EntityAddPage orgType={EOrgType.NETWORK} {...props} />;
};

export default NetworksAddPage;
